import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const EMAIL_BROKERS = [
  // Major Data Brokers
  { id: 'acxiom', name: 'Acxiom', email: 'optout@acxiom.com' },
  { id: 'epsilon', name: 'Epsilon', email: 'privacy@epsilon.com' },
  { id: 'oracle', name: 'Oracle Data Cloud', email: 'datacloudoptout@oracle.com' },
  { id: 'lexisnexis', name: 'LexisNexis', email: 'optout@lexisnexis.com' },
  { id: 'corelogic', name: 'CoreLogic', email: 'privacy@corelogic.com' },
  { id: 'equifax', name: 'Equifax', email: 'privacy@equifax.com' },
  { id: 'experian', name: 'Experian', email: 'privacy@experian.com' },
  { id: 'transunion', name: 'TransUnion', email: 'privacy@transunion.com' },
  { id: 'thomsonreuters', name: 'Thomson Reuters', email: 'privacy.request@thomsonreuters.com' },
  { id: 'verisk', name: 'Verisk', email: 'privacy@verisk.com' },
  { id: 'nielsen', name: 'Nielsen', email: 'privacy@nielsen.com' },
  { id: 'comscore', name: 'comScore', email: 'privacy@comscore.com' },
  { id: 'neustar', name: 'Neustar', email: 'privacy@neustar.biz' },
  { id: 'liveramp', name: 'LiveRamp', email: 'optout@liveramp.com' },
  { id: 'lotame', name: 'Lotame', email: 'privacy@lotame.com' },
  { id: 'bluekai', name: 'BlueKai', email: 'privacy@bluekai.com' },
  { id: 'mediamath', name: 'MediaMath', email: 'privacy@mediamath.com' },
  { id: 'quantcast', name: 'Quantcast', email: 'privacy@quantcast.com' },
  { id: 'tapad', name: 'Tapad', email: 'privacy@tapad.com' },
  { id: 'iqvia', name: 'IQVIA', email: 'privacy@iqvia.com' },
  { id: 'alliant', name: 'Alliant', email: 'privacy@alliantdata.com' },
  { id: 'cardlytics', name: 'Cardlytics', email: 'privacy@cardlytics.com' },
  { id: 'crossix', name: 'Crossix', email: 'privacy@crossix.com' },
  { id: 'datalogix', name: 'Datalogix', email: 'privacy@datalogix.com' },
  { id: 'drawbridge', name: 'Drawbridge', email: 'privacy@drawbridge.com' },
  { id: 'krux', name: 'Krux Digital', email: 'privacy@krux.com' },
  { id: 'addthis', name: 'AddThis', email: 'privacy@addthis.com' },
  { id: 'adsquare', name: 'Adsquare', email: 'privacy@adsquare.com' },
  { id: 'exelate', name: 'eXelate', email: 'privacy@exelate.com' },
  // People Search Sites
  { id: 'spokeo', name: 'Spokeo', email: 'privacy@spokeo.com' },
  { id: 'whitepages', name: 'WhitePages', email: 'support@whitepages.com' },
  { id: 'beenverified', name: 'BeenVerified', email: 'privacy@beenverified.com' },
  { id: 'intelius', name: 'Intelius', email: 'privacy@intelius.com' },
  { id: 'radaris', name: 'Radaris', email: 'privacy@radaris.com' },
  { id: 'peoplefinder', name: 'PeopleFinder', email: 'privacy@peoplefinders.com' },
  { id: 'instantcheckmate', name: 'Instant Checkmate', email: 'support@instantcheckmate.com' },
  { id: 'truthfinder', name: 'TruthFinder', email: 'support@truthfinder.com' },
  { id: 'familytreenow', name: 'FamilyTreeNow', email: 'support@familytreenow.com' },
  { id: 'peekyou', name: 'PeekYou', email: 'optout@peekyou.com' },
  { id: 'pipl', name: 'Pipl', email: 'privacy@pipl.com' },
  { id: 'mylife', name: 'MyLife', email: 'privacy@mylife.com' },
  { id: 'usphonebook', name: 'US Phone Book', email: 'support@usphonebook.com' },
  { id: 'zabasearch', name: 'ZabaSearch', email: 'privacy@zabasearch.com' },
  { id: 'peoplesmart', name: 'PeopleSmart', email: 'privacy@peoplesmart.com' },
  { id: 'anywho', name: 'AnyWho', email: 'privacy@anywho.com' },
  { id: 'publicrecordsnow', name: 'Public Records Now', email: 'privacy@publicrecordsnow.com' },
  { id: 'backgroundalert', name: 'Background Alert', email: 'privacy@backgroundalert.com' },
  { id: 'clustrmaps', name: 'ClustrMaps', email: 'privacy@clustrmaps.com' },
  { id: 'dataveria', name: 'Dataveria', email: 'privacy@dataveria.com' },
  { id: 'dobsearch', name: 'DOBSearch', email: 'privacy@dobsearch.com' },
  { id: 'fastpeoplesearch', name: 'Fast People Search', email: 'privacy@fastpeoplesearch.com' },
  { id: 'gladiknow', name: 'Glad I Know', email: 'privacy@gladiknow.com' },
  { id: 'idtrue', name: 'IDTrue', email: 'privacy@idtrue.com' },
  { id: 'infotracer', name: 'InfoTracer', email: 'privacy@infotracer.com' },
  { id: 'iverify', name: 'iVerify', email: 'privacy@iverify.com' },
  { id: 'locateplus', name: 'LocatePlus', email: 'privacy@locateplus.com' },
  { id: 'nuwber', name: 'Nuwber', email: 'privacy@nuwber.com' },
  { id: 'officialusa', name: 'OfficialUSA', email: 'privacy@officialusa.com' },
  { id: 'peoplefindfast', name: 'People Find Fast', email: 'privacy@peoplefindfast.com' },
  { id: 'peoplelooker', name: 'PeopleLooker', email: 'privacy@peoplelooker.com' },
  { id: 'persopo', name: 'Persopo', email: 'privacy@persopo.com' },
  { id: 'privaterecords', name: 'Private Records', email: 'privacy@privaterecords.net' },
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
  { id: 'zoominfo', name: 'ZoomInfo', email: 'privacy@zoominfo.com' },
  // Marketing Data Brokers
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
  { id: 'throtle', name: 'Throtle', email: 'privacy@throtle.io' },
  { id: 'towerdata', name: 'TowerData', email: 'privacy@towerdata.com' },
  { id: 'tradedesk', name: 'The Trade Desk', email: 'privacy@thetradedesk.com' },
  { id: 'truoptik', name: 'TruOptik', email: 'privacy@truoptik.com' },
  { id: 'twilio', name: 'Twilio Segment', email: 'privacy@twilio.com' },
  { id: 'viant', name: 'Viant', email: 'privacy@viantinc.com' },
  { id: 'weborama', name: 'Weborama', email: 'privacy@weborama.com' },
  { id: 'windfall', name: 'Windfall', email: 'privacy@windfall.com' },
  { id: 'xandr', name: 'Xandr', email: 'privacy@xandr.com' },
  { id: 'yodlee', name: 'Yodlee', email: 'privacy@yodlee.com' },
  // Big Tech
  { id: 'google', name: 'Google', email: 'privacy@google.com' },
  { id: 'meta', name: 'Meta / Facebook', email: 'privacy@fb.com' },
  { id: 'amazon', name: 'Amazon', email: 'privacy@amazon.com' },
  { id: 'microsoft', name: 'Microsoft', email: 'privacy@microsoft.com' },
  { id: 'apple', name: 'Apple', email: 'privacy@apple.com' },
  { id: 'twitter', name: 'Twitter / X', email: 'privacy@twitter.com' },
  { id: 'tiktok', name: 'TikTok', email: 'privacy@tiktok.com' },
  { id: 'spotify', name: 'Spotify', email: 'privacy@spotify.com' },
  { id: 'linkedin', name: 'LinkedIn', email: 'privacy@linkedin.com' },
  { id: 'snapchat', name: 'Snapchat', email: 'privacy@snap.com' },
  { id: 'netflix', name: 'Netflix', email: 'privacy@netflix.com' },
  { id: 'uber', name: 'Uber', email: 'privacy@uber.com' },
  { id: 'airbnb', name: 'Airbnb', email: 'privacy@airbnb.com' },
  { id: 'pinterest', name: 'Pinterest', email: 'privacy@pinterest.com' },
  { id: 'reddit', name: 'Reddit', email: 'privacy@reddit.com' },
  { id: 'adobe', name: 'Adobe', email: 'privacy@adobe.com' },
  { id: 'samsung', name: 'Samsung', email: 'privacy@samsung.com' },
]

const generateStandardEmail = (brokerName: string, profile: any) => {
  return `To Whom It May Concern,

I am writing to formally request the immediate removal of my personal information from ${brokerName} and any affiliated databases.

My information is as follows:
Full Name: ${profile.full_name}
Email: ${profile.email}
City: ${profile.city}
State/Region: ${profile.state}
Country: ${profile.country}

Under the California Consumer Privacy Act (CCPA), General Data Protection Regulation (GDPR), and other applicable privacy laws, I have the right to request deletion of my personal data.

I request that you:
1. Remove all personal information associated with me immediately
2. Confirm deletion within 30 days
3. Ensure my data is not re-added in the future
4. Forward this request to any third parties you have shared my data with

Failure to comply may result in a formal complaint to the relevant data protection authority.

Please confirm receipt of this request and provide a timeline for removal.

Sincerely,
${profile.full_name}
${profile.city}, ${profile.state}
${profile.country}`
}

const generateBigTechEmail = (brokerName: string, profile: any) => {
  return `To The Privacy Team At ${brokerName},

I am formally invoking my rights under:
- California Consumer Privacy Act (CCPA)
- General Data Protection Regulation (GDPR)
- Virginia Consumer Data Protection Act (VCDPA)
- Colorado Privacy Act (CPA)

I hereby request:

1. DELETION: Immediate deletion of ALL personal data
   associated with my account and any shadow profiles

2. RESTRICTION: Cease all processing of my personal data
   for advertising, analytics, or third party sharing

3. PORTABILITY: Export of all data you hold about me

4. CONFIRMATION: Written confirmation of compliance
   within 30 days as required by law

My identifying information:
Full Name: ${profile.full_name}
Email: ${profile.email}
City: ${profile.city}
State: ${profile.state}
Country: ${profile.country}

Non-compliance may result in:
- Complaint to FTC
- Complaint to State Attorney General
- Complaint to EU Data Protection Authority
- Legal action

I expect written confirmation within 30 days.

Sincerely,
${profile.full_name}`
}

const BIG_TECH_IDS = [
  'google', 'meta', 'amazon', 'microsoft', 'apple',
  'twitter', 'tiktok', 'spotify', 'linkedin', 'snapchat',
  'netflix', 'uber', 'airbnb', 'pinterest', 'reddit',
  'adobe', 'samsung'
]

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
    const { profile, selectedBrokers } = await req.json()

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

    const brokersToContact = selectedBrokers
  ? EMAIL_BROKERS.filter(b => selectedBrokers.includes(b.id))
  : EMAIL_BROKERS

for (const broker of brokersToContact) {
      try {
        const isBigTech = BIG_TECH_IDS.includes(broker.id)
        const emailBody = isBigTech
          ? generateBigTechEmail(broker.name, profile)
          : generateStandardEmail(broker.name, profile)

        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'onboarding@resend.dev',
            to: 'dawsonmsmith@protonmail.com',
            subject: isBigTech
              ? `FORMAL PRIVACY REQUEST - ${broker.name} - ${profile.full_name}`
              : `Personal Data Removal Request - ${profile.full_name}`,
            text: emailBody
          })
        })

        const data = await response.json()

        results.push({
          broker: broker.name,
          type: isBigTech ? 'Big Tech' : 'Data Broker',
          success: response.ok,
          id: data.id || null
        })

      } catch (err: any) {
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
    total: brokersToContact.length,
    sent: results.filter(r => r.success).length
  }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (err: any) {
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