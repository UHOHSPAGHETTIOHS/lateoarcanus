import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Get and validate the JWT from Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Create authenticated Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      global: {
        headers: { Authorization: authHeader }
      }
    })

    // 3. Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired session', details: userError?.message }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 4. Parse request body
    const { access_token } = await req.json()
    
    if (!access_token) {
      return new Response(
        JSON.stringify({ error: 'access_token required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`🔍 Scanning Gmail for user: ${user.id} (${user.email})`)

    // 5. Fetch emails from Gmail API
    const gmailResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=100&q="welcome" OR "account created" OR "verify your email" OR "sign up" OR "thanks for joining"',
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!gmailResponse.ok) {
      const errorText = await gmailResponse.text()
      console.error('Gmail API error:', errorText)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch emails from Gmail', details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const gmailData = await gmailResponse.json()
    const messages = gmailData.messages || []
    console.log(`📧 Found ${messages.length} potential account emails`)

    // 6. Extract company names from emails
    const companies = new Map() // Use Map to track first_seen date

    for (const msg of messages.slice(0, 50)) { // Limit to 50 for performance
      try {
        const emailResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
          {
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (!emailResponse.ok) continue

        const emailData = await emailResponse.json()
        
        // Extract from and date headers
        let fromHeader = ''
        let receivedDate = null
        
        for (const header of emailData.payload?.headers || []) {
          if (header.name === 'From') fromHeader = header.value
          if (header.name === 'Date') receivedDate = header.value
        }

        // Extract company name from "From" header
        let companyName = ''
        
        // Try pattern: "Company Name <no-reply@company.com>"
        const fromMatch = fromHeader.match(/"?([^"<]+)"?\s*</)
        if (fromMatch) {
          companyName = fromMatch[1].trim()
        }
        
        // Try domain extraction
        if (!companyName) {
          const domainMatch = fromHeader.match(/@([\w\-]+\.\w+)/)
          if (domainMatch) {
            const domain = domainMatch[1].split('.')[0]
            companyName = domain.charAt(0).toUpperCase() + domain.slice(1)
          }
        }

        if (!companyName || companyName.length < 2) continue

        // Store company with first seen date
        if (!companies.has(companyName)) {
          companies.set(companyName, {
            name: companyName,
            first_seen: receivedDate ? new Date(receivedDate) : new Date()
          })
        }
      } catch (err) {
        console.error('Error processing email:', err)
        continue
      }
    }

    console.log(`🏢 Extracted ${companies.size} unique companies`)

    // 7. Save discovered accounts to database
    const savedAccounts = []
    for (const [name, data] of companies) {
      // Check if account already exists
      const { data: existing } = await supabase
        .from('discovered_accounts')
        .select('id')
        .eq('user_id', user.id)
        .eq('company_name', name)
        .maybeSingle()

      if (!existing) {
        const { data: inserted, error: insertError } = await supabase
          .from('discovered_accounts')
          .insert({
            user_id: user.id,
            company_name: name,
            signup_date: data.first_seen.toISOString(),
            status: 'pending'
          })
          .select()
          .single()

        if (inserted && !insertError) {
          savedAccounts.push(inserted)
          console.log(`✅ Saved new account: ${name}`)
        }
      }
    }

    console.log(`💾 Saved ${savedAccounts.length} new accounts`)

    return new Response(
      JSON.stringify({
        success: true,
        total_emails_scanned: messages.length,
        accounts_found: companies.size,
        new_accounts: savedAccounts.length,
        accounts: Array.from(companies.keys())
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})