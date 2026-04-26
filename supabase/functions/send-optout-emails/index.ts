import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// FULL broker list matching AutoRemoval.jsx ALL_BROKERS
const BROKER_CONTACTS = [
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
  
  // Marketing
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
  { id: 'yodlee', name: 'Yodlee', email: 'privacy@yodlee.com' },
  
  // People Search
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
    // NEW People Search additions
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
  
  // Big Tech - no email opt-outs
  { id: 'google', name: 'Google', email: null },
  { id: 'meta', name: 'Meta / Facebook', email: null },
  { id: 'amazon', name: 'Amazon', email: null },
  { id: 'microsoft', name: 'Microsoft', email: null },
  { id: 'apple', name: 'Apple', email: null },
  { id: 'twitter', name: 'Twitter / X', email: null },
  { id: 'tiktok', name: 'TikTok', email: null },
  { id: 'spotify', name: 'Spotify', email: null },
  { id: 'linkedin', name: 'LinkedIn', email: null },
  { id: 'snapchat', name: 'Snapchat', email: null },
  { id: 'netflix', name: 'Netflix', email: null },
  { id: 'uber', name: 'Uber', email: null },
  { id: 'airbnb', name: 'Airbnb', email: null },
  { id: 'pinterest', name: 'Pinterest', email: null },
  { id: 'reddit', name: 'Reddit', email: null },
  { id: 'adobe', name: 'Adobe', email: null },
  { id: 'samsung', name: 'Samsung', email: null },
]

const YOUR_EMAIL = 'dawsonmsmith@protonmail.com'

const generateCCPARequest = (brokerName: string, profile: any) => {
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

LEGAL BASIS FOR THIS REQUEST:

1. Under the California Consumer Privacy Act (CCPA) Section 1798.105, consumers have the right to request deletion of their personal information.

2. Under the General Data Protection Regulation (GDPR) Article 17, data subjects have the "right to erasure."

3. As stated in your own privacy policy, you are committed to protecting consumer privacy and complying with applicable data protection laws. This request aligns directly with the privacy commitments you make to your users.

REQUESTED ACTIONS:
1. Delete all personal information associated with the above identifiers
2. Notify any third parties who received this data of the deletion request
3. Cease all sale or sharing of my personal information
4. Provide confirmation of deletion within 30 days as required by law
5. Ensure my data is not re-collected or re-added in the future

If you do not have a published privacy policy, please be advised that this is itself a violation of CCPA Section 1798.130(a)(5) and GDPR Article 13, and will be noted in any formal complaint.

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

    const { profile, selectedBrokers, user_id } = await req.json()

    if (!profile?.full_name || !profile?.email) {
      return new Response(
        JSON.stringify({ success: false, error: 'Profile incomplete' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!user_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing user_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Filter to brokers that have email addresses (for logging purposes)
    // But send ALL emails to YOUR_EMAIL instead
    const brokersToProcess = BROKER_CONTACTS.filter(b =>
      selectedBrokers.includes(b.id) && b.email
    )

    const results = []
    let sent = 0
    let failed = 0
    let skipped = 0

    for (const broker of brokersToProcess) {
      try {
        // Check if we already sent to this broker in last 14 days
                // Check if we already have a successful/pending attempt for this broker
        const { data: recent } = await supabase
          .from('removal_attempts')
          .select('id, status')
          .eq('user_id', user_id)
          .eq('broker_id', broker.id)
          .in('status', ['sent', 'delivered', 'opened', 'responded', 'completed'])
          .gte('sent_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
          .maybeSingle()

        if (recent) {
          skipped++
          results.push({ broker: broker.name, success: false, type: 'skipped', reason: recent.status === 'completed' ? 'already_removed' : 'recently_sent' })
          continue
        }

        // Clean up old failed attempts for this broker before resending
        await supabase
          .from('removal_attempts')
          .delete()
          .eq('user_id', user_id)
          .eq('broker_id', broker.id)
          .eq('status', 'failed')

        // Send to YOUR email instead of broker's email
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
                    body: JSON.stringify({
            from: 'onboarding@resend.dev',
            to: YOUR_EMAIL,
            subject: `[${broker.name}] CCPA/GDPR Data Deletion Request - ${profile.full_name}`,
            html: `<div style="font-family: 'Courier New', monospace; background: #f5f5f5; padding: 20px; max-width: 600px; margin: 0 auto;">
<pre style="font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.5; color: #222; white-space: pre-wrap; word-wrap: break-word; background: #fff; padding: 20px; border: 1px solid #ccc;">${generateCCPARequest(broker.name, profile)}</pre>
<p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">This email was sent by redactxd on behalf of ${profile.full_name}</p>
</div>`,
            text: generateCCPARequest(broker.name, profile),
            reply_to: profile.email
          })
        })

        const emailData = await response.json()

        if (response.ok) {
          sent++
          await supabase.from('removal_attempts').insert({
            user_id,
            broker_id: broker.id,
            broker_name: broker.name,
            method: 'email',
            status: 'sent',
            email_id: emailData.id,
            sent_at: new Date().toISOString(),
            next_follow_up: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
          results.push({ broker: broker.name, success: true, type: 'email', email_id: emailData.id })
        } else {
          failed++
          await supabase.from('removal_attempts').insert({
            user_id,
            broker_id: broker.id,
            broker_name: broker.name,
            method: 'email',
            status: 'failed',
            error: emailData.message || 'send_failed',
            sent_at: new Date().toISOString()
          })
          results.push({ broker: broker.name, success: false, type: 'email', error: emailData.message })
        }

        await new Promise(resolve => setTimeout(resolve, 100))

      } catch (err: any) {
        failed++
        results.push({ broker: broker.name, success: false, type: 'error', error: err.message })
      }
    }

    // Handle Big Tech / no-email brokers
    const manualBrokers = selectedBrokers.filter((id: string) => {
      const broker = BROKER_CONTACTS.find(b => b.id === id)
      return broker && !broker.email
    })

    for (const brokerId of manualBrokers) {
      const broker = BROKER_CONTACTS.find(b => b.id === brokerId)
      if (broker) {
        results.push({ 
          broker: broker.name, 
          success: false, 
          type: 'manual', 
          reason: 'requires_manual_opt_out' 
        })
      }
    }

    const nextRemoval = new Date()
    nextRemoval.setDate(nextRemoval.getDate() + 30)

    await supabase.from('profiles').update({
      last_removal_date: new Date().toISOString(),
      next_removal_date: nextRemoval.toISOString()
    }).eq('id', user_id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent, 
        failed, 
        skipped,
        manual: manualBrokers.length,
        total: brokersToProcess.length + manualBrokers.length, 
        results,
        next_removal: nextRemoval.toISOString()
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
