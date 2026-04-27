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

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // Fetch emails from Gmail API
    const gmailResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=200&q="welcome" OR "account created" OR "verify your email" OR "sign up" OR "thanks for joining" OR "confirm your email" OR "activate your account"',
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

    for (const msg of messages.slice(0, 100)) {
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
        
        // Try to extract company name from "From" header
        const fromMatch = fromHeader.match(/"?([^"<]+)"?\s*</)
        if (fromMatch) {
          companyName = fromMatch[1].trim()
          // Clean up common prefixes/suffixes
          companyName = companyName.replace(/^(no-?reply|support|hello|welcome|team|info|notice|alerts?|updates?|notifications?|accounts?|security|noreply|do-not-reply)@?/i, '')
          companyName = companyName.replace(/[,\s]+$/, '')
        }
        
        // Try domain extraction if name not found
        if (!companyName || companyName.length < 2) {
          const domainMatch = fromHeader.match(/@([\w\-]+\.\w+)/)
          if (domainMatch) {
            let domain = domainMatch[1].split('.')[0]
            companyName = domain.charAt(0).toUpperCase() + domain.slice(1)
          }
        }

        if (!companyName || companyName.length < 2) continue

        // Clean up common patterns
        companyName = companyName.replace(/https?:\/\//i, '')
        companyName = companyName.replace(/www\./i, '')
        companyName = companyName.replace(/\.com$|\.net$|\.org$/i, '')
        companyName = companyName.trim()

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

    // Fetch deletion guides from database
    const { data: deletionGuides } = await supabase
      .from('deletion_guides')
      .select('company_name, deletion_url, instructions')

    const guideMap = new Map()
    if (deletionGuides) {
      for (const guide of deletionGuides) {
        guideMap.set(guide.company_name.toLowerCase(), guide)
      }
    }

    // Save discovered accounts to database
    const savedAccounts = []
    for (const [name, data] of companies) {
      // Check if account already exists
      const { data: existing } = await supabase
        .from('discovered_accounts')
        .select('id')
        .eq('user_id', user_id)
        .eq('company_name', name)
        .maybeSingle()

      if (!existing) {
        const guide = guideMap.get(name.toLowerCase())
        
        const { data: inserted, error: insertError } = await supabase
          .from('discovered_accounts')
          .insert({
            user_id: user_id,
            company_name: name,
            signup_date: data.first_seen.toISOString(),
            status: 'pending',
            deletion_url: guide?.deletion_url || null,
            deletion_instructions: guide?.instructions || null
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