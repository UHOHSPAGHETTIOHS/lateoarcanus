import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, svix-id, svix-timestamp, svix-signature',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!)
    
    const payload = await req.json()
    
    if (payload.type !== 'email.received') {
      return new Response('Not an inbound email', { status: 200 })
    }
    
    const toAddress = payload.data.to?.[0] || ''
    const fromAddress = payload.data.from || ''
    const subject = payload.data.subject || 'No subject'
    const textBody = payload.data.text || ''
    const htmlBody = payload.data.html || ''
    
    // Extract the alias from the "to" address
    const aliasMatch = toAddress.match(/(.+?)@/)
    const aliasFull = aliasMatch ? aliasMatch[1] : ''
    
    if (!aliasFull) {
      console.log('Could not extract alias from:', toAddress)
      return new Response('Could not extract alias', { status: 200 })
    }
    
    console.log(`Looking up alias: ${aliasFull}@redactxd.com`)
    
    // Look up which user owns this alias
    const { data: alias, error: aliasError } = await supabase
      .from('aliases')
      .select('user_id')
      .eq('alias', `${aliasFull}@redactxd.com`)
      .single()
    
    if (aliasError || !alias) {
      console.log('Alias not found:', aliasFull)
      return new Response('Alias not found', { status: 200 })
    }
    
    console.log(`Found alias for user: ${alias.user_id}`)
    
    // Get the user's real email address
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', alias.user_id)
      .single()
    
    if (userError || !user) {
      console.log('User not found for id:', alias.user_id)
      return new Response('User not found', { status: 200 })
    }
    
    console.log(`Forwarding to: ${user.email}`)
    
    // Forward the email
    const forwardResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `Redactxd <forward@redactxd.com>`,
        to: user.email,
        subject: `[Forwarded] ${subject}`,
        html: `
          <div style="font-family: monospace; padding: 20px;">
            <p><strong>From:</strong> ${fromAddress}</p>
            <p><strong>To:</strong> ${toAddress}</p>
            <hr/>
            ${htmlBody || `<pre style="white-space: pre-wrap;">${textBody}</pre>`}
          </div>
        `,
        text: `From: ${fromAddress}\nTo: ${toAddress}\n\n${textBody}`
      })
    })
    
    const responseText = await forwardResponse.text()
    console.log(`Forward response status: ${forwardResponse.status}`)
    console.log(`Forward response body: ${responseText}`)
    
    if (!forwardResponse.ok) {
      console.error('Failed to forward email:', responseText)
      return new Response(`Forward failed: ${responseText}`, { status: 500 })
    }
    
    console.log(`✅ Successfully forwarded to ${user.email}`)
    
    return new Response(JSON.stringify({ 
      success: true, 
      forwarded_to: user.email 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (err) {
    console.error('Error:', err.message)
    return new Response(`Error: ${err.message}`, { status: 500 })
  }
})