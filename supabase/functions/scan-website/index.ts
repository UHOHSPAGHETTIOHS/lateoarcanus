import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
// Handle CORS preflight
if (req.method === 'OPTIONS') {
return new Response('ok', {
status: 200,
headers: corsHeaders
})
}

// Only allow POST
if (req.method !== 'POST') {
return new Response(
JSON.stringify({ success: false, error: 'Method not allowed' }),
{
status: 405,
headers: { ...corsHeaders, 'Content-Type': 'application/json' }
}
)
}

try {
// Read raw body safely
const rawBody = await req.text()

text
// Check if body is empty
if (!rawBody || rawBody.trim() === '') {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Request body is empty'
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

// Parse JSON safely
let parsed
try {
  parsed = JSON.parse(rawBody)
} catch (e) {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Invalid JSON: ' + e.message
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

const { url } = parsed

if (!url) {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'No URL provided in body'
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

// Fetch the target website
let response
try {
  response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(10000)
  })
} catch (e) {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Could not reach website: ' + e.message
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

// Read the HTML
let html
try {
  html = await response.text()
} catch (e) {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Could not read website response: ' + e.message
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

// Return success
return new Response(
  JSON.stringify({
    success: true,
    html: html.slice(0, 500000),
    status: response.status,
    htmlLength: html.length
  }),
  {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  }
)
} catch (err) {
return new Response(
JSON.stringify({
success: false,
error: err.message
}),
{
status: 200,
headers: { ...corsHeaders, 'Content-Type': 'application/json' }
}
)
}
})