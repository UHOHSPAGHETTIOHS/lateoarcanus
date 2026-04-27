import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const GMAIL_CLIENT_ID = Deno.env.get('GMAIL_CLIENT_ID')
const GMAIL_CLIENT_SECRET = Deno.env.get('GMAIL_CLIENT_SECRET')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Common account creation email patterns
const ACCOUNT_PATTERNS = [
  { pattern: /welcome to/i, type: 'welcome' },
  { pattern: /account created/i, type: 'creation' },
  { pattern: /verify your email/i, type: 'verification' },
  { pattern: /thanks for signing up/i, type: 'welcome' },
  { pattern: /your account is ready/i, type: 'creation' },
  { pattern: /confirm your account/i, type: 'verification' },
  { pattern: /you're confirmed/i, type: 'confirmation' },
]

// Company name extraction patterns
const COMPANY_PATTERNS = [
  { pattern: /from:\s*([\w\s]+?)\s*</, type: 'from_header' },
  { pattern: /welcome to (\w+)/i, type: 'body' },
  { pattern: /your (\w+) account/i, type: 'body' },
]

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!)
    const { user_id, access_token } = await req.json()

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'user_id required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!access_token) {
      return new Response(
        JSON.stringify({ error: 'Gmail access_token required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Scanning emails for user: ${user_id}`)

    // Step 1: Fetch emails from Gmail API
    const gmailResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=500&q="welcome" OR "account created" OR "verify your email" OR "thanks for signing up"',
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
        JSON.stringify({ error: 'Failed to fetch emails from Gmail' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const gmailData = await gmailResponse.json()
    const messages = gmailData.messages || []
    
    console.log(`Found ${messages.length} potential account creation emails`)

    // Step 2: Process each email to extract company info
    const discoveredCompanies = new Map()

    for (const message of messages.slice(0, 100)) { // Limit to 100 for performance
      try {
        // Fetch individual email details
        const emailResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
          {
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (!emailResponse.ok) continue

        const emailData = await emailResponse.json()
        
        // Extract from and subject headers
        let fromHeader = ''
        let subject = ''
        let receivedDate = null

        for (const header of emailData.payload?.headers || []) {
          if (header.name === 'From') fromHeader = header.value
          if (header.name === 'Subject') subject = header.value
          if (header.name === 'Date') receivedDate = header.value
        }

        // Extract company name from email
        let companyName = ''
        
        // Try to get company from "From" header
        const fromMatch = fromHeader.match(/from:\s*"?([^"<]+)/i)
        if (fromMatch) {
          companyName = fromMatch[1].trim()
        }
        
        // Try subject patterns
        if (!companyName) {
          const welcomeMatch = subject.match(/welcome to (\w+)/i)
          if (welcomeMatch) companyName = welcomeMatch[1]
        }
        
        if (!companyName) {
          const yourMatch = subject.match(/your (\w+) account/i)
          if (yourMatch) companyName = yourMatch[1]
        }

        if (!companyName) {
          // Fallback: use domain from fromHeader
          const domainMatch = fromHeader.match(/@([\w\-]+\.\w+)/)
          if (domainMatch) {
            companyName = domainMatch[1].split('.')[0]
          }
        }

        if (!companyName) continue

        // Store discovered company
        if (!discoveredCompanies.has(companyName)) {
          discoveredCompanies.set(companyName, {
            company_name: companyName,
            first_seen: receivedDate ? new Date(receivedDate) : new Date(),
            emails_found: 1
          })
        } else {
          const existing = discoveredCompanies.get(companyName)
          existing.emails_found++
        }

      } catch (error) {
        console.error('Error processing email:', error)
        continue
      }
    }

    // Step 3: Save discovered accounts to database
    const savedAccounts = []
    for (const [companyName, data] of discoveredCompanies) {
      // Check if account already exists for this user
      const { data: existing } = await supabase
        .from('discovered_accounts')
        .select('id')
        .eq('user_id', user_id)
        .eq('company_name', companyName)
        .maybeSingle()

      if (!existing) {
        const { data: inserted, error } = await supabase
          .from('discovered_accounts')
          .insert({
            user_id: user_id,
            company_name: companyName,
            signup_date: data.first_seen,
            status: 'pending'
          })
          .select()
          .single()

        if (inserted && !error) {
          savedAccounts.push(inserted)
        }
      }
    }

    console.log(`Saved ${savedAccounts.length} new discovered accounts`)

    return new Response(
      JSON.stringify({
        success: true,
        total_emails_scanned: messages.length,
        accounts_found: discoveredCompanies.size,
        new_accounts: savedAccounts.length,
        accounts: Array.from(discoveredCompanies.entries()).map(([name, data]) => ({
          name,
          first_seen: data.first_seen,
          emails_found: data.emails_found
        }))
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})