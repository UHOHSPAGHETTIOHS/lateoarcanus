import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const googleClientId = Deno.env.get('GOOGLE_CLIENT_ID')!

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

function generateState(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: userError } = await supabase.auth.getUser(token)

  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid user' }), { status: 401, headers: corsHeaders })
  }

  const state = generateState()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

  await supabase.from('oauth_states').insert({
    state,
    user_id: user.id,
    expires_at: expiresAt,
  })

 // Inside gmail-auth-start/index.ts
const redirectUri = `${getFunctionsBaseUrl()}/functions/v1/gmail-callback`
  const scope = 'https://www.googleapis.com/auth/gmail.readonly'

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', googleClientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('access_type', 'offline')
  authUrl.searchParams.set('prompt', 'consent')
  authUrl.searchParams.set('scope', scope)
  authUrl.searchParams.set('state', state)

  return new Response(JSON.stringify({ url: authUrl.toString() }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})