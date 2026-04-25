import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

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

    // Log full payload so we can see what Resend sends
    console.log('=== WEBHOOK RECEIVED ===')
    console.log('Type:', payload.type)
    console.log('Full payload:', JSON.stringify(payload, null, 2))

    const eventType = payload.type
    // Resend sends email_id in different places depending on event
    const emailId = payload.data?.email_id || payload.data?.id || payload.email_id

    console.log('Extracted email_id:', emailId)

    if (!emailId) {
      console.log('SKIPPED: No email_id found in payload')
      return new Response(JSON.stringify({ received: true, skipped: 'no_email_id' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Look up the attempt
    const { data: attempt, error: lookupError } = await supabase
      .from('removal_attempts')
      .select('id, status, broker_name')
      .eq('email_id', emailId)
      .maybeSingle()

    console.log('Lookup result:', attempt)
    console.log('Lookup error:', lookupError)

    if (!attempt) {
      // Try partial match in case of ID format differences
      const { data: allAttempts } = await supabase
        .from('removal_attempts')
        .select('id, email_id, broker_name')
        .order('sent_at', { ascending: false })
        .limit(5)

      console.log('Recent attempts for debugging:', allAttempts)
      console.log('SKIPPED: No matching attempt for email_id:', emailId)

      return new Response(JSON.stringify({ received: true, skipped: 'no_matching_attempt', searched_for: emailId }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    let newStatus: string | null = null
    let extraFields: any = {}

    switch (eventType) {
      case 'email.delivered':
        newStatus = 'delivered'
        extraFields.delivered_at = new Date().toISOString()
        break
      case 'email.opened':
        newStatus = 'opened'
        extraFields.opened_at = new Date().toISOString()
        break
      case 'email.bounced':
        newStatus = 'failed'
        extraFields.error = 'email_bounced'
        extraFields.broker_response = `Bounced: ${payload.data?.bounce_type || 'unknown'}`
        break
      case 'email.complained':
        newStatus = 'failed'
        extraFields.error = 'spam_complaint'
        extraFields.broker_response = 'Marked as spam by recipient'
        break
      case 'email.delivery_delayed':
        extraFields.broker_response = 'Delivery delayed'
        break
      default:
        console.log('SKIPPED: Unhandled event type:', eventType)
        return new Response(JSON.stringify({ received: true, skipped: 'unhandled_event' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }

    // Only escalate status forward, never backward
    const STATUS_ORDER = ['failed', 'sent', 'delivered', 'opened', 'responded', 'completed']
    const currentIndex = STATUS_ORDER.indexOf(attempt.status)
    const newIndex = newStatus ? STATUS_ORDER.indexOf(newStatus) : -1

    console.log(`Status check: current=${attempt.status}(${currentIndex}) -> new=${newStatus}(${newIndex})`)

    if (newStatus && newIndex > currentIndex) {
      const { error: updateError } = await supabase
        .from('removal_attempts')
        .update({ status: newStatus, ...extraFields })
        .eq('id', attempt.id)

      console.log(`UPDATED ${attempt.broker_name}: ${attempt.status} -> ${newStatus}`)
      if (updateError) console.log('Update error:', updateError)
    } else if (Object.keys(extraFields).length > 0) {
      await supabase
        .from('removal_attempts')
        .update(extraFields)
        .eq('id', attempt.id)

      console.log(`EXTRA FIELDS updated for ${attempt.broker_name}:`, extraFields)
    } else {
      console.log(`NO UPDATE: Status ${newStatus} is not ahead of ${attempt.status}`)
    }

    return new Response(
      JSON.stringify({ received: true, event: eventType, broker: attempt.broker_name, updated: newStatus }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err: any) {
    console.error('WEBHOOK ERROR:', err.message)
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})