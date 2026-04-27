import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get user_id and access_token from request body
    const { user_id, access_token } = await req.json()
    
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'user_id required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (!access_token) {
      return new Response(
        JSON.stringify({ error: 'access_token required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`🔍 Scanning Gmail for user: ${user_id}`)

    // Use service role to access DB
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // Fetch emails from Gmail API
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

    // Extract company names from emails
    const companies = new Map()

    for (const msg of messages.slice(0, 50)) {
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
        
        let fromHeader = ''
        let receivedDate = null
        
        for (const header of emailData.payload?.headers || []) {
          if (header.name === 'From') fromHeader = header.value
          if (header.name === 'Date') receivedDate = header.value
        }

        let companyName = ''
        
        const fromMatch = fromHeader.match(/"?([^"<]+)"?\s*</)
        if (fromMatch) {
          companyName = fromMatch[1].trim()
        }
        
        if (!companyName) {
          const domainMatch = fromHeader.match(/@([\w\-]+\.\w+)/)
          if (domainMatch) {
            const domain = domainMatch[1].split('.')[0]
            companyName = domain.charAt(0).toUpperCase() + domain.slice(1)
          }
        }

        if (!companyName || companyName.length < 2) continue

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

    // Save discovered accounts to database
    const savedAccounts = []
    for (const [name, data] of companies) {
      const { data: existing } = await supabase
        .from('discovered_accounts')
        .select('id')
        .eq('user_id', user_id)
        .eq('company_name', name)
        .maybeSingle()

      if (!existing) {
        const { data: inserted, error: insertError } = await supabase
          .from('discovered_accounts')
          .insert({
            user_id: user_id,
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