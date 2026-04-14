import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const EMAIL_BROKERS = [
  {
    id: 'acxiom',
    name: 'Acxiom',
    email: 'optout@acxiom.com'
  },
  {
    id: 'epsilon',
    name: 'Epsilon',
    email: 'privacy@epsilon.com'
  },
  {
    id: 'oracle',
    name: 'Oracle Data Cloud',
    email: 'datacloudoptout@oracle.com'
  },
  {
    id: 'lexisnexis',
    name: 'LexisNexis',
    email: 'optout@lexisnexis.com'
  },
  {
    id: 'corelogic',
    name: 'CoreLogic',
    email: 'privacy@corelogic.com'
  }
]

const generateEmailBody = (brokerName: string, profile: any) => {
  return `To Whom It May Concern,

I am writing to formally request the immediate removal of my personal information from ${brokerName}'s database and any affiliated databases.

My information is as follows:
Full Name: ${profile.full_name}
City: ${profile.city}
State/Region: ${profile.state}
Country: ${profile.country}
Email: ${profile.email}

Under the California Consumer Privacy Act (CCPA), General Data Protection Regulation (GDPR), and other applicable privacy laws, I have the right to request deletion of my personal data.

I request that you:
1. Remove all personal information associated with me
2. Confirm deletion within 30 days
3. Ensure my data is not re-added in the future
4. Forward this request to any third parties you have shared my data with

Failure to comply may result in a formal complaint to the relevant data protection authority.

Please confirm receipt of this request and provide a timeline for removal.

Thank you for your prompt attention to this matter.

Sincerely,
${profile.full_name}
${profile.city}, ${profile.state}
${profile.country}`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }

  try {
    const { profile } = await req.json()

    if (!profile.full_name || !profile.email) {
      return new Response(
        JSON.stringify({ error: 'Name and email are required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    const results = []

    for (const broker of EMAIL_BROKERS) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
  from: 'onboarding@resend.dev',
  to: 'dawsonmsmith@protonmail.com',
  subject: `Personal Data Removal Request to ${broker.name} - ${profile.full_name}`,
  text: generateEmailBody(broker.name, profile)
})
        })

        const data = await response.json()

        results.push({
          broker: broker.name,
          success: response.ok,
          id: data.id || null
        })
      } catch (err) {
        results.push({
          broker: broker.name,
          success: false,
          error: err.message
        })
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        results,
        total: EMAIL_BROKERS.length,
        sent: results.filter(r => r.success).length
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
})