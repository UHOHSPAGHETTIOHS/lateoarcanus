import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const googleClientId = Deno.env.get('GOOGLE_CLIENT_ID')!
const googleClientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET')!
const appUrl = Deno.env.get('APP_URL')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function getFunctionsBaseUrl(): string {
  const u = new URL(supabaseUrl)
  const host = u.hostname.endsWith('.supabase.co')
    ? u.hostname.replace('.supabase.co', '.functions.supabase.co')
    : u.hostname
  return `https://${host}`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')

  if (error) {
    console.error('Google OAuth error:', error)
    return Response.redirect(`${appUrl}/cleanup?error=auth_failed`, 302)
  }

  if (!code || !state) {
    return Response.redirect(`${appUrl}/cleanup?error=missing_params`, 302)
  }

  // Verify state matches (CSRF protection)
  const { data: stateRecord, error: stateError } = await supabase
    .from('oauth_states')
    .select('user_id')
    .eq('state', state)
    .single()

  if (stateError || !stateRecord) {
    console.error('Invalid state:', stateError)
    return Response.redirect(`${appUrl}/cleanup?error=invalid_state`, 302)
  }

  // Exchange code for tokens
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: googleClientId,
      client_secret: googleClientSecret,
      redirect_uri: `${getFunctionsBaseUrl()}/functions/v1/gmail-callback`,
      grant_type: 'authorization_code',
    }),
  })

  const tokens = await tokenResponse.json()

  if (!tokenResponse.ok) {
    console.error('Token exchange failed:', tokens)
    return Response.redirect(`${appUrl}/cleanup?error=token_exchange_failed`, 302)
  }

  // Store the access token for the user
  await supabase
    .from('user_gmail_tokens')
    .upsert({
      user_id: stateRecord.user_id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', stateRecord.user_id)

  // Clean up the used state
  await supabase.from('oauth_states').delete().eq('state', state)

  // FIXED: Simple redirect without any token in URL
  const redirectTo = `${appUrl}/cleanup?scan=start`
  console.log('Redirecting to:', redirectTo)
  
  return Response.redirect(redirectTo, 302)
})