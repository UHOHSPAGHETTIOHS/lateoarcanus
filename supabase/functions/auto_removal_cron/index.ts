import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Full broker list matching send-optout-emails (116 brokers, no Big Tech)
const BROKER_CONTACTS = [
  // Data Brokers (30)
  { id: 'acxiom', name: 'Acxiom', email: 'optout@acxiom.com' },
  { id: 'epsilon', name: 'Epsilon', email: 'privacy@epsilon.com' },
  { id: 'oracle', name: 'Oracle Data Cloud', email: 'datacloudoptout@oracle.com' },
  { id: 'lexisnexis', name: 'LexisNexis', email: 'optout@lexisnexis.com' },
  { id: 'corelogic', name: 'CoreLogic', email: 'privacy@corelogic.com' },
  { id: 'equifax', name: 'Equifax', email: 'consumer.support@equifax.com' },
  { id: 'experian', name: 'Experian', email: 'consumer.support@experian.com' },
  { id: 'transunion', name: 'TransUnion', email: 'transunion@transunion.com' },
  { id: 'thomsonreuters', name: 'Thomson Reuters', email: 'privacy@thomsonreuters.com' },
  { id: 'verisk', name: 'Verisk', email: 'privacy@verisk.com' },
  { id: 'nielsen', name: 'Nielsen', email: 'privacy@nielsen.com' },
  { id: 'comscore', name: 'comScore', email: 'privacy@comscore.com' },
  { id: 'neustar', name: 'Neustar', email: 'privacy@neustar.biz' },
  { id: 'liveramp', name: 'LiveRamp', email: 'optout@liveramp.com' },
  { id: 'lotame', name: 'Lotame', email: 'privacy@lotame.com' },
  { id: 'bluekai', name: 'BlueKai', email: 'privacy@oracle.com' },
  { id: 'mediamath', name: 'MediaMath', email: 'privacy@mediamath.com' },
  { id: 'quantcast', name: 'Quantcast', email: 'privacy@quantcast.com' },
  { id: 'tapad', name: 'Tapad', email: 'privacy@tapad.com' },
  { id: 'iqvia', name: 'IQVIA', email: 'privacy@iqvia.com' },
  { id: 'alliant', name: 'Alliant', email: 'privacy@alliantdata.com' },
  { id: 'cardlytics', name: 'Cardlytics', email: 'privacy@cardlytics.com' },
  { id: 'crossix', name: 'Crossix', email: 'privacy@crossix.com' },
  { id: 'drawbridge', name: 'Drawbridge', email: 'privacy@drawbridge.com' },
  { id: 'krux', name: 'Krux Digital', email: 'privacy@salesforce.com' },
  { id: 'addthis', name: 'AddThis', email: 'privacy@oracle.com' },
  { id: 'adsquare', name: 'Adsquare', email: 'privacy@adsquare.com' },
  { id: 'exelate', name: 'eXelate', email: 'privacy@nielsen.com' },
  { id: 'zoominfo', name: 'ZoomInfo', email: 'privacy@zoominfo.com' },
  { id: 'yodlee', name: 'Yodlee', email: 'privacy@yodlee.com' },

  // Marketing (22)
  { id: 'harte-hanks', name: 'Harte-Hanks', email: 'privacy@harte-hanks.com' },
  { id: 'merkle', name: 'Merkle', email: 'privacy@merkleinc.com' },
  { id: 'conversant', name: 'Conversant', email: 'privacy@conversantmedia.com' },
  { id: 'dataxu', name: 'DataXu', email: 'privacy@dataxu.com' },
  { id: 'dun-bradstreet', name: 'Dun and Bradstreet', email: 'privacy@dnb.com' },
  { id: 'inmarket', name: 'InMarket', email: 'privacy@inmarket.com' },
  { id: 'kochava', name: 'Kochava', email: 'privacy@kochava.com' },
  { id: 'placed', name: 'Placed', email: 'privacy@placed.com' },
  { id: 'salesforce-dmp', name: 'Salesforce DMP', email: 'privacy@salesforce.com' },
  { id: 'semcasting', name: 'Semcasting', email: 'privacy@semcasting.com' },
  { id: 'sharethrough', name: 'Sharethrough', email: 'privacy@sharethrough.com' },
  { id: 'stirista', name: 'Stirista', email: 'privacy@stirista.com' },
  { id: 'taboola', name: 'Taboola', email: 'privacy@taboola.com' },
  { id: 'throtle', name: 'Throtle', email: 'privacy@throtle.com' },
  { id: 'towerdata', name: 'TowerData', email: 'privacy@towerdata.com' },
  { id: 'tradedesk', name: 'The Trade Desk', email: 'privacy@thetradedesk.com' },
  { id: 'truoptik', name: 'TruOptik', email: 'privacy@truoptik.com' },
  { id: 'twilio', name: 'Twilio Segment', email: 'privacy@segment.com' },
  { id: 'viant', name: 'Viant', email: 'privacy@viantinc.com' },
  { id: 'weborama', name: 'Weborama', email: 'privacy@weborama.com' },
  { id: 'windfall', name: 'Windfall', email: 'privacy@windfalldata.com' },
  { id: 'xandr', name: 'Xandr', email: 'privacy@xandr.com' },

  // People Search (64)
  { id: 'spokeo', name: 'Spokeo', email: 'privacy@spokeo.com' },
  { id: 'whitepages', name: 'WhitePages', email: 'privacy@whitepages.com' },
  { id: 'beenverified', name: 'BeenVerified', email: 'privacy@beenverified.com' },
  { id: 'intelius', name: 'Intelius', email: 'privacy@intelius.com' },
  { id: 'radaris', name: 'Radaris', email: 'privacy@radaris.com' },
  { id: 'peoplefinder', name: 'PeopleFinder', email: 'privacy@peoplefinders.com' },
  { id: 'instantcheckmate', name: 'Instant Checkmate', email: 'support@instantcheckmate.com' },
  { id: 'truthfinder', name: 'TruthFinder', email: 'support@truthfinder.com' },
  { id: 'familytreenow', name: 'FamilyTreeNow', email: 'privacy@familytreenow.com' },
  { id: 'peekyou', name: 'PeekYou', email: 'privacy@peekyou.com' },
  { id: 'pipl', name: 'Pipl', email: 'privacy@pipl.com' },
  { id: 'mylife', name: 'MyLife', email: 'privacy@mylife.com' },
  { id: 'usphonebook', name: 'US Phone Book', email: 'privacy@usphonebook.com' },
  { id: 'zabasearch', name: 'ZabaSearch', email: 'privacy@zabasearch.com' },
  { id: 'peoplesmart', name: 'PeopleSmart', email: 'privacy@peoplesmart.com' },
  { id: 'anywho', name: 'AnyWho', email: 'privacy@anywho.com' },
  { id: 'publicrecordsnow', name: 'Public Records Now', email: 'privacy@publicrecordsnow.com' },
  { id: 'backgroundalert', name: 'Background Alert', email: 'privacy@backgroundalert.com' },
  { id: 'fastpeoplesearch', name: 'Fast People Search', email: 'privacy@fastpeoplesearch.com' },
  { id: 'gladiknow', name: 'Glad I Know', email: 'privacy@gladiknow.com' },
  { id: 'idtrue', name: 'IDTrue', email: 'privacy@idtrue.com' },
  { id: 'infotracer', name: 'InfoTracer', email: 'privacy@infotracer.com' },
  { id: 'locateplus', name: 'LocatePlus', email: 'privacy@locateplus.com' },
  { id: 'nuwber', name: 'Nuwber', email: 'privacy@nuwber.com' },
  { id: 'officialusa', name: 'OfficialUSA', email: 'privacy@officialusa.com' },
  { id: 'peoplefindfast', name: 'People Find Fast', email: 'privacy@peoplefindfast.com' },
  { id: 'peoplelooker', name: 'PeopleLooker', email: 'privacy@peoplelooker.com' },
  { id: 'persopo', name: 'Persopo', email: 'privacy@persopo.com' },
  { id: 'privaterecords', name: 'Private Records', email: 'privacy@privaterecords.com' },
  { id: 'propeoplesearch', name: 'Pro People Search', email: 'privacy@propeoplesearch.com' },
  { id: 'quickpeopletrace', name: 'Quick People Trace', email: 'privacy@quickpeopletrace.com' },
  { id: 'rehold', name: 'Rehold', email: 'privacy@rehold.com' },
  { id: 'reversephonecheck', name: 'Reverse Phone Check', email: 'privacy@reversephonecheck.com' },
  { id: 'searchpeoplefree', name: 'Search People Free', email: 'privacy@searchpeoplefree.com' },
  { id: 'smartbackgroundchecks', name: 'Smart Background Checks', email: 'privacy@smartbackgroundchecks.com' },
  { id: 'spyfly', name: 'SpyFly', email: 'privacy@spyfly.com' },
  { id: 'staterecords', name: 'State Records', email: 'privacy@staterecords.org' },
  { id: 'thatsthem', name: 'ThatsThem', email: 'privacy@thatsthem.com' },
  { id: 'truepeoplesearch', name: 'True People Search', email: 'privacy@truepeoplesearch.com' },
  { id: 'verecor', name: 'Verecor', email: 'privacy@verecor.com' },
  { id: 'veripages', name: 'VeriPages', email: 'privacy@veripages.com' },
  { id: 'voterrecords', name: 'Voter Records', email: 'privacy@voterrecords.com' },
  { id: 'xlek', name: 'Xlek', email: 'privacy@xlek.com' },
  { id: 'yellowpages', name: 'Yellow Pages', email: 'privacy@yellowpages.com' },
  { id: '411', name: '411.com', email: 'privacy@411.com' },
  { id: 'addresssearch', name: 'AddressSearch', email: 'privacy@addresssearch.com' },
  { id: 'advancedbackgroundchecks', name: 'Advanced Background Checks', email: 'privacy@advancedbackgroundchecks.com' },
  { id: 'americaphonebook', name: 'AmericaPhoneBook', email: 'privacy@americaphonebook.com' },
  { id: 'archives', name: 'Archives.com', email: 'privacy@archives.com' },
  { id: 'arrestfacts', name: 'ArrestFacts', email: 'privacy@arrestfacts.com' },
  { id: 'backgroundcheckers', name: 'BackgroundCheckers', email: 'privacy@backgroundcheckers.net' },
  { id: 'checkpeople', name: 'CheckPeople', email: 'privacy@checkpeople.com' },
  { id: 'clustrmaps', name: 'ClustrMaps', email: 'privacy@clustrmaps.com' },
  { id: 'cocofinder', name: 'CocoFinder', email: 'privacy@cocofinder.com' },
  { id: 'cyberbackgroundchecks', name: 'Cyber Background Checks', email: 'privacy@cyberbackgroundchecks.com' },
  { id: 'dataveria', name: 'Dataveria', email: 'privacy@dataveria.com' },
  { id: 'easybackgroundchecks', name: 'EasyBackgroundChecks', email: 'privacy@easybackgroundchecks.com' },
  { id: 'findpeoplesearch', name: 'FindPeopleSearch', email: 'privacy@findpeoplesearch.com' },
  { id: 'freepeopledirectory', name: 'FreePeopleDirectory', email: 'privacy@freepeopledirectory.com' },
  { id: 'homemetry', name: 'Homemetry', email: 'privacy@homemetry.com' },
  { id: 'houseforyou', name: 'HouseForYou', email: 'privacy@houseforyou.com' },
  { id: 'kiwisearches', name: 'Kiwi Searches', email: 'privacy@kiwisearches.com' },
  { id: 'neighborwho', name: 'NeighborWho', email: 'privacy@neighborwho.com' },
  { id: 'newenglandfacts', name: 'NewEnglandFacts', email: 'privacy@newenglandfacts.com' },
]

const generateCCPARequest = (brokerName: string, profile: any, isFollowUp: boolean) => {
  if (isFollowUp) {
    return `To Whom It May Concern,

FOLLOW-UP: CCPA/GDPR Data Deletion Request

This is a follow-up to our data deletion request previously sent regarding ${profile.full_name}.

We have not received confirmation that personal information has been deleted from ${brokerName}.

CONSUMER INFORMATION:
Full Legal Name: ${profile.full_name}
Email: ${profile.email}
Mailing Address: ${profile.address || 'Not provided'}
City: ${profile.city || 'Not provided'}
State: ${profile.state || 'Not provided'}
ZIP Code: ${profile.zip || 'Not provided'}
Country: ${profile.country || 'United States'}
Phone: ${profile.phone || 'Not provided'}

Under CCPA Section 1798.105 and GDPR Article 17, you are required to:
1. Delete all personal information associated with the above identifiers
2. Confirm deletion within 30 days
3. Notify any third parties who received this data

Failure to comply may result in formal complaints to the California Attorney General and relevant EU Data Protection Authorities.

I authorize redactxd to act as my authorized agent in submitting and following up on this request.

Sincerely,
${profile.full_name}
Date: ${new Date().toLocaleDateString()}`
  }

  return `To Whom It May Concern,

DATA DELETION REQUEST UNDER CCPA / GDPR

I am writing to formally request the complete deletion of all my personal information from ${brokerName} and any affiliated databases, subsidiaries, or partner organizations.

CONSUMER INFORMATION:
Full Legal Name: ${profile.full_name}
Email Address: ${profile.email}
Mailing Address: ${profile.address || 'Not provided'}
City: ${profile.city || 'Not provided'}
State: ${profile.state || 'Not provided'}
ZIP Code: ${profile.zip || 'Not provided'}
Country: ${profile.country || 'United States'}
Phone: ${profile.phone || 'Not provided'}

This request is made under:
- California Consumer Privacy Act (CCPA) Section 1798.105
- General Data Protection Regulation (GDPR) Article 17 (Right to Erasure)

REQUESTED ACTIONS:
1. Delete all personal information associated with the above identifiers
2. Notify any third parties who received this data of the deletion request
3. Cease all sale or sharing of my personal information
4. Provide confirmation of deletion within 30 days as required by law
5. Ensure my data is not re-collected or re-added in the future

I authorize redactxd to act as my authorized agent in submitting and following up on this request.

Sincerely,
${profile.full_name}
Date: ${new Date().toLocaleDateString()}`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!)

    // ══════════════════════════════════════════════════════════
    // PHASE 1: AUTO-ESCALATION — Mark 30+ day pending as removed
    // ══════════════════════════════════════════════════════════
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const { data: staleAttempts } = await supabase
      .from('removal_attempts')
      .select('id, user_id, broker_id')
      .in('status', ['sent', 'delivered', 'opened'])
      .lte('sent_at', thirtyDaysAgo)

    let autoCompleted = 0

    if (staleAttempts && staleAttempts.length > 0) {
      for (const attempt of staleAttempts) {
        await supabase
          .from('removal_attempts')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            verification_method: 'auto_30day',
            broker_response: 'Auto-completed: 30 days elapsed with no rejection (CCPA compliance presumed)'
          })
          .eq('id', attempt.id)

        // Also add to broker_removals
        const { data: existing } = await supabase
          .from('broker_removals')
          .select('id')
          .eq('user_id', attempt.user_id)
          .eq('broker_id', attempt.broker_id)
          .maybeSingle()

        if (!existing) {
          await supabase.from('broker_removals').insert({
            user_id: attempt.user_id,
            broker_id: attempt.broker_id
          })
        }

        autoCompleted++
      }
    }

    // ══════════════════════════════════════════════════════════
    // PHASE 2: RE-REMOVAL — Resend to users due for 30-day cycle
    // ══════════════════════════════════════════════════════════
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('auto_removal_enabled', true)
      .eq('authorization_signed', true)
      .lte('next_removal_date', new Date().toISOString())

    if (error) throw error

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No users due for re-removal',
          auto_completed: autoCompleted
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const results = []

    for (const profile of profiles) {
      if (!profile.full_name || !profile.email) continue

      // Get all current attempts for this user
      const { data: currentAttempts } = await supabase
        .from('removal_attempts')
        .select('broker_id, status')
        .eq('user_id', profile.id)

      const attemptMap: Record<string, string> = {}
      currentAttempts?.forEach(a => { attemptMap[a.broker_id] = a.status })

      // Determine which brokers to send to:
      // - Skip: completed (already removed)
      // - Resend: failed, or pending that hit next_follow_up
      // - New: never attempted
      const brokersToSend: typeof BROKER_CONTACTS = []

      for (const broker of BROKER_CONTACTS) {
        const currentStatus = attemptMap[broker.id]

        if (currentStatus === 'completed') {
          // Already removed, skip
          continue
        }

        if (!currentStatus) {
          // Never attempted, send fresh
          brokersToSend.push(broker)
          continue
        }

        if (currentStatus === 'failed') {
          // Failed, retry
          brokersToSend.push(broker)
          continue
        }

        // For sent/delivered/opened/responded — check if follow-up is due
        const { data: attempt } = await supabase
          .from('removal_attempts')
          .select('next_follow_up')
          .eq('user_id', profile.id)
          .eq('broker_id', broker.id)
          .maybeSingle()

        if (attempt?.next_follow_up && new Date(attempt.next_follow_up) <= new Date()) {
          brokersToSend.push(broker)
        }
      }

      let sent = 0
      let failed = 0
      let skipped = 0

      for (const broker of brokersToSend) {
        try {
          const currentStatus = attemptMap[broker.id]
          const isFollowUp = !!currentStatus && currentStatus !== 'failed'

          // Clean up failed attempts before resending
          if (currentStatus === 'failed') {
            await supabase
              .from('removal_attempts')
              .delete()
              .eq('user_id', profile.id)
              .eq('broker_id', broker.id)
              .eq('status', 'failed')
          }

          const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json'
            },
                        body: JSON.stringify({
              from: 'removals@redactxd.com',
              to: broker.email,
              subject: `${isFollowUp ? 'FOLLOW-UP: ' : ''}CCPA/GDPR Data Deletion Request - ${profile.full_name}`,
              html: `<pre style="font-family: monospace; white-space: pre-wrap;">${generateCCPARequest(broker.name, profile, isFollowUp)}</pre>`,
              text: generateCCPARequest(broker.name, profile, isFollowUp),
              reply_to: profile.email
            })
          })

          const emailData = await response.json()

          if (response.ok) {
            sent++

            // Check for existing attempt to update vs insert
            const { data: existing } = await supabase
              .from('removal_attempts')
              .select('id, follow_up_count')
              .eq('user_id', profile.id)
              .eq('broker_id', broker.id)
              .maybeSingle()

            if (existing) {
              await supabase.from('removal_attempts').update({
                status: 'sent',
                sent_at: new Date().toISOString(),
                email_id: emailData.id,
                next_follow_up: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                follow_up_count: (existing.follow_up_count || 0) + 1,
                error: null,
                broker_response: null
              }).eq('id', existing.id)
            } else {
              await supabase.from('removal_attempts').insert({
                user_id: profile.id,
                broker_id: broker.id,
                broker_name: broker.name,
                method: 'email',
                status: 'sent',
                email_id: emailData.id,
                sent_at: new Date().toISOString(),
                next_follow_up: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                follow_up_count: 1
              })
            }
          } else {
            failed++

            // Log the failure
            const { data: existing } = await supabase
              .from('removal_attempts')
              .select('id')
              .eq('user_id', profile.id)
              .eq('broker_id', broker.id)
              .maybeSingle()

            if (existing) {
              await supabase.from('removal_attempts').update({
                status: 'failed',
                error: emailData.message || 'send_failed',
                sent_at: new Date().toISOString()
              }).eq('id', existing.id)
            } else {
              await supabase.from('removal_attempts').insert({
                user_id: profile.id,
                broker_id: broker.id,
                broker_name: broker.name,
                method: 'email',
                status: 'failed',
                error: emailData.message || 'send_failed',
                sent_at: new Date().toISOString()
              })
            }
          }

          // Rate limit
          await new Promise(resolve => setTimeout(resolve, 100))
        } catch (err) {
          failed++
        }
      }

      // Update next removal date
      const nextRemoval = new Date()
      nextRemoval.setDate(nextRemoval.getDate() + 30)
      await supabase.from('profiles').update({
        last_removal_date: new Date().toISOString(),
        next_removal_date: nextRemoval.toISOString()
      }).eq('id', profile.id)

      results.push({
        user: profile.email,
        sent,
        failed,
        skipped: BROKER_CONTACTS.length - brokersToSend.length,
        total_targeted: brokersToSend.length
      })
    }

    return new Response(
      JSON.stringify({
        success: true,
        auto_completed: autoCompleted,
        users_processed: results.length,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})