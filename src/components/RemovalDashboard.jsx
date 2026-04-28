import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import TypewriterText from './TypewriterText'

const STATUS_COLORS = {
  sent: '#666',
  delivered: '#888',
  opened: '#aaa',
  responded: '#ccc',
  completed: '#fff',
  failed: '#444',
  expired: '#333'
}

const STATUS_LABELS = {
  sent: 'PENDING',
  delivered: 'DELIVERED',
  opened: 'OPENED',
  responded: 'RESPONDED',
  completed: 'REMOVED',
  failed: 'FAILED',
  expired: 'EXPIRED'
}

const VERIFY_URLS = {
  // Data Brokers (30)
  acxiom: 'https://www.acxiom.com/optout/',
  epsilon: 'https://www.epsilon.com/us/privacy-policy/privacy-request',
  oracle: 'https://www.oracle.com/legal/privacy/marketing-cloud-data-cloud-privacy-policy.html',
  lexisnexis: 'https://optout.lexisnexis.com/',
  corelogic: 'https://www.corelogic.com/privacy-center/',
  equifax: 'https://www.equifax.com/personal/privacy/',
  experian: 'https://www.experian.com/privacy/center.html',
  transunion: 'https://www.transunion.com/legal/privacy-center',
  thomsonreuters: 'https://www.thomsonreuters.com/en/privacy-statement.html',
  verisk: 'https://www.verisk.com/privacy/',
  nielsen: 'https://www.nielsen.com/us/en/legal/privacy-statement/nielsen-us-opt-out/',
  comscore: 'https://www.comscore.com/About/Privacy-Policy',
  neustar: 'https://www.home.neustar/privacy',
  liveramp: 'https://liveramp.com/opt_out/',
  lotame: 'https://www.lotame.com/about-lotame/privacy/lotames-products-privacy-policy/opt-out/',
  bluekai: 'https://www.oracle.com/legal/privacy/marketing-cloud-data-cloud-privacy-policy.html',
  mediamath: 'https://www.mediamath.com/privacy-policy/',
  quantcast: 'https://www.quantcast.com/opt-out/',
  tapad: 'https://www.tapad.com/privacy-policy',
  iqvia: 'https://www.iqvia.com/about-us/privacy/individual-rights-request',
  alliant: 'https://www.alliantdata.com/privacy-policy/',
  cardlytics: 'https://www.cardlytics.com/consumer-opt-out/',
  crossix: 'https://www.veeva.com/privacy/',
  drawbridge: 'https://www.drawbridge.com/privacy',
  krux: 'https://www.salesforce.com/products/marketing-cloud/sfmc/audience-studio-consumer-choice/',
  addthis: 'https://www.oracle.com/legal/privacy/addthis-privacy-policy.html',
  adsquare: 'https://www.adsquare.com/privacy-policy/',
  exelate: 'https://www.nielsen.com/us/en/legal/privacy-statement/exelate-privacy-policy/',
  zoominfo: 'https://www.zoominfo.com/about/privacy/privacy-controls',
  yodlee: 'https://www.yodlee.com/legal/privacy-notice',

  // Marketing (22)
  'harte-hanks': 'https://www.harte-hanks.com/privacy-policy/',
  merkle: 'https://www.merkleinc.com/privacy-policy',
  conversant: 'https://www.conversantmedia.com/legal/privacy',
  dataxu: 'https://www.roku.com/en-us/about/privacy-policy',
  'dun-bradstreet': 'https://www.dnb.com/utility-pages/privacy-policy.html',
  inmarket: 'https://inmarket.com/privacy/',
  kochava: 'https://www.kochava.com/privacy/',
  placed: 'https://www.placed.com/privacy',
  'salesforce-dmp': 'https://www.salesforce.com/products/marketing-cloud/sfmc/audience-studio-consumer-choice/',
  semcasting: 'https://semcasting.com/privacy-policy/',
  sharethrough: 'https://www.sharethrough.com/privacy-center',
  stirista: 'https://www.stirista.com/privacy-policy',
  taboola: 'https://www.taboola.com/privacy-policy#optout',
  throtle: 'https://throtle.com/privacy-policy/',
  towerdata: 'https://www.towerdata.com/privacy-policy',
  tradedesk: 'https://www.thetradedesk.com/us/privacy',
  truoptik: 'https://www.truoptik.com/privacy-policy',
  twilio: 'https://segment.com/legal/privacy/',
  viant: 'https://www.viantinc.com/privacy-policy/',
  weborama: 'https://www.weborama.com/privacy-policy/',
  windfall: 'https://www.windfalldata.com/privacy-policy',
  xandr: 'https://www.xandr.com/privacy/',

  // People Search (64)
  spokeo: 'https://www.spokeo.com/',
  whitepages: 'https://www.whitepages.com/',
  beenverified: 'https://www.beenverified.com/',
  intelius: 'https://www.intelius.com/',
  radaris: 'https://radaris.com/',
  peoplefinder: 'https://www.peoplefinders.com/',
  instantcheckmate: 'https://www.instantcheckmate.com/',
  truthfinder: 'https://www.truthfinder.com/',
  familytreenow: 'https://www.familytreenow.com/',
  peekyou: 'https://www.peekyou.com/',
  pipl: 'https://pipl.com/',
  mylife: 'https://www.mylife.com/',
  usphonebook: 'https://www.usphonebook.com/',
  zabasearch: 'https://www.zabasearch.com/',
  peoplesmart: 'https://www.peoplesmart.com/',
  anywho: 'https://www.anywho.com/',
  publicrecordsnow: 'https://www.publicrecordsnow.com/',
  backgroundalert: 'https://www.backgroundalert.com/',
  fastpeoplesearch: 'https://www.fastpeoplesearch.com/',
  gladiknow: 'https://gladiknow.com/',
  idtrue: 'https://www.idtrue.com/',
  infotracer: 'https://infotracer.com/',
  locateplus: 'https://www.locateplus.com/',
  nuwber: 'https://nuwber.com/',
  officialusa: 'https://www.officialusa.com/',
  peoplefindfast: 'https://peoplefindfast.com/',
  peoplelooker: 'https://www.peoplelooker.com/',
  persopo: 'https://persopo.com/',
  privaterecords: 'https://www.privaterecords.net/',
  propeoplesearch: 'https://www.propeoplesearch.com/',
  quickpeopletrace: 'https://www.quickpeopletrace.com/',
  rehold: 'https://rehold.com/',
  reversephonecheck: 'https://www.reversephonecheck.com/',
  searchpeoplefree: 'https://www.searchpeoplefree.com/',
  smartbackgroundchecks: 'https://www.smartbackgroundchecks.com/',
  spyfly: 'https://www.spyfly.com/',
  staterecords: 'https://staterecords.org/',
  thatsthem: 'https://thatsthem.com/',
  truepeoplesearch: 'https://www.truepeoplesearch.com/',
  verecor: 'https://verecor.com/',
  veripages: 'https://veripages.com/',
  voterrecords: 'https://voterrecords.com/',
  xlek: 'https://xlek.com/',
  yellowpages: 'https://www.yellowpages.com/',
  '411': 'https://www.411.com/',
  addresssearch: 'https://www.addresssearch.com/',
  advancedbackgroundchecks: 'https://www.advancedbackgroundchecks.com/',
  americaphonebook: 'https://www.americaphonebook.com/',
  archives: 'https://www.archives.com/',
  arrestfacts: 'https://arrestfacts.com/',
  backgroundcheckers: 'https://www.backgroundcheckers.net/',
  checkpeople: 'https://www.checkpeople.com/',
  clustrmaps: 'https://clustrmaps.com/',
  cocofinder: 'https://cocofinder.com/',
  cyberbackgroundchecks: 'https://www.cyberbackgroundchecks.com/',
  dataveria: 'https://dataveria.com/',
  easybackgroundchecks: 'https://www.easybackgroundchecks.com/',
  findpeoplesearch: 'https://www.findpeoplesearch.com/',
  freepeopledirectory: 'https://www.freepeopledirectory.com/',
  homemetry: 'https://homemetry.com/',
  houseforyou: 'https://houseforyou.com/',
  kiwisearches: 'https://kiwisearches.com/',
  neighborwho: 'https://neighborwho.com/',
  newenglandfacts: 'https://newenglandfacts.com/',
}

export default function RemovalDashboard() {
  const [attempts, setAttempts] = useState([])
  const [grouped, setGrouped] = useState([])
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, failed: 0 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [expandedBroker, setExpandedBroker] = useState(null)
  const [retrying, setRetrying] = useState(false)
  const [retryResults, setRetryResults] = useState(null)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data, error } = await supabase
      .from('removal_attempts')
      .select('*')
      .eq('user_id', user.id)
      .order('sent_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch removal attempts:', error)
      setLoading(false)
      return
    }

    if (data && data.length > 0) {
      setAttempts(data)

      const brokerMap = {}
      data.forEach(a => {
        if (!brokerMap[a.broker_id]) {
          brokerMap[a.broker_id] = {
            broker_id: a.broker_id,
            broker_name: a.broker_name,
            latest: a,
            history: [a],
            totalAttempts: 1
          }
        } else {
          brokerMap[a.broker_id].history.push(a)
          brokerMap[a.broker_id].totalAttempts++
          if (new Date(a.sent_at) > new Date(brokerMap[a.broker_id].latest.sent_at)) {
            brokerMap[a.broker_id].latest = a
          }
        }
      })

      const brokerList = Object.values(brokerMap).sort((a, b) =>
        new Date(b.latest.sent_at) - new Date(a.latest.sent_at)
      )
      setGrouped(brokerList)

      const completed = brokerList.filter(b => b.latest.status === 'completed').length
      const failed = brokerList.filter(b => b.latest.status === 'failed').length
      const pending = brokerList.filter(b =>
        ['sent', 'delivered', 'opened', 'responded'].includes(b.latest.status)
      ).length

      setStats({ total: brokerList.length, completed, pending, failed })
    } else {
      setAttempts([])
      setGrouped([])
      setStats({ total: 0, completed: 0, pending: 0, failed: 0 })
    }
    setLoading(false)
  }

  const markStatus = async (attemptId, brokerId, newStatus, verificationMethod) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const updateData = { status: newStatus }

    if (newStatus === 'completed') {
      updateData.completed_at = new Date().toISOString()
      if (verificationMethod) {
        updateData.verified_at = new Date().toISOString()
        updateData.verification_method = verificationMethod
      }
    }

    const { error } = await supabase
      .from('removal_attempts')
      .update(updateData)
      .eq('id', attemptId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Failed to update status:', error)
      return
    }

    if (newStatus === 'completed') {
      const { data: existing } = await supabase
        .from('broker_removals')
        .select('id')
        .eq('user_id', user.id)
        .eq('broker_id', brokerId)
        .maybeSingle()

      if (!existing) {
        await supabase.from('broker_removals').insert({
          user_id: user.id,
          broker_id: brokerId
        })
      }
    }

    if (newStatus === 'sent') {
      await supabase
        .from('broker_removals')
        .delete()
        .eq('user_id', user.id)
        .eq('broker_id', brokerId)
    }

    await fetchData()
  }

  const retryAllFailed = async () => {
    const failedBrokers = grouped.filter(b => b.latest.status === 'failed')
    if (failedBrokers.length === 0) return

    setRetrying(true)
    setRetryResults(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setRetrying(false); return }

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Session expired. Please log in again.')
        setRetrying(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profile || !profile.full_name || !profile.email) {
        alert('Please fill in your profile information first.')
        setRetrying(false)
        return
      }

      const failedIds = failedBrokers.map(b => b.broker_id)

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-optout-emails`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
          },
          body: JSON.stringify({
            profile: {
              full_name: profile.full_name,
              email: profile.email,
              address: profile.address || '',
              city: profile.city || '',
              state: profile.state || '',
              zip: profile.zip || '',
              country: profile.country || '',
              phone: profile.phone || ''
            },
            selectedBrokers: failedIds,
            user_id: user.id
          })
        }
      )

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`)

      setRetryResults(data)
      await fetchData()
    } catch (err) {
      console.error('Retry failed:', err)
      alert('Retry failed: ' + err.message)
    }

    setRetrying(false)
  }

  const getFilteredBrokers = () => {
    if (filter === 'all') return grouped
    if (filter === 'pending') return grouped.filter(b =>
      ['sent', 'delivered', 'opened', 'responded'].includes(b.latest.status)
    )
    if (filter === 'completed') return grouped.filter(b => b.latest.status === 'completed')
    if (filter === 'failed') return grouped.filter(b => b.latest.status === 'failed')
    return grouped
  }

  const getDaysSince = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  const getDaysUntil = (dateStr) => {
    if (!dateStr) return null
    const diff = new Date(dateStr).getTime() - Date.now()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  const getTimelineProgress = (attempt) => {
    const daysSince = getDaysSince(attempt.sent_at)
    const percent = Math.min((daysSince / 30) * 100, 100)
    return { daysSince, percent }
  }

  const filtered = getFilteredBrokers()

  if (loading) return (
    <div style={{ color: '#444', textAlign: 'center', padding: '40px', fontFamily: "'Share Tech Mono', monospace" }}>
      Loading removal data...
    </div>
  )

  return (
    <div style={{ background: '#000', border: '1px solid #1a1a1a', padding: '35px', marginBottom: '25px' }}>

      {/* Header with Refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <TypewriterText
          text="REMOVAL_DASHBOARD"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        />
        <button
          onClick={fetchData}
          disabled={loading}
          style={{
            background: 'transparent',
            border: '1px solid #333',
            color: '#555',
            padding: '6px 14px',
            cursor: loading ? 'default' : 'pointer',
            fontSize: '0.7rem',
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: '2px',
            transition: 'all 0.2s'
          }}
        >
          {loading ? 'LOADING...' : 'REFRESH'}
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px',
        marginBottom: '30px'
      }}>
        {[
          { label: 'BROKERS TARGETED', value: stats.total, color: '#fff' },
          { label: 'CONFIRMED REMOVED', value: stats.completed, color: '#fff' },
          { label: 'PENDING REMOVAL', value: stats.pending, color: '#888' },
          { label: 'FAILED', value: stats.failed, color: '#444' }
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#050505',
            border: '1px solid #1a1a1a',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: '900',
              color: stat.color,
              fontFamily: "'Share Tech Mono', monospace",
              marginBottom: '8px'
            }}>
              {stat.value}
            </div>
            <div style={{
              color: '#444',
              fontSize: '0.65rem',
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: '2px'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      {stats.total > 0 && (
        <div style={{ marginBottom: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#444', fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px' }}>
              REMOVAL PROGRESS
            </span>
            <span style={{ color: '#666', fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace" }}>
              {Math.round(((stats.completed + stats.pending) / stats.total) * 100)}% ADDRESSED
            </span>
          </div>
          <div style={{ background: '#111', height: '6px', overflow: 'hidden' }}>
            <div style={{ height: '100%', display: 'flex' }}>
              <div style={{ width: `${(stats.completed / stats.total) * 100}%`, background: '#fff', transition: 'width 0.5s ease' }} />
              <div style={{ width: `${(stats.pending / stats.total) * 100}%`, background: '#444', transition: 'width 0.5s ease' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
            <span style={{ color: '#555', fontSize: '0.6rem', fontFamily: "'Share Tech Mono', monospace", display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', background: '#fff', display: 'inline-block' }} /> Removed
            </span>
            <span style={{ color: '#555', fontSize: '0.6rem', fontFamily: "'Share Tech Mono', monospace", display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', background: '#444', display: 'inline-block' }} /> Pending
            </span>
            <span style={{ color: '#555', fontSize: '0.6rem', fontFamily: "'Share Tech Mono', monospace", display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', background: '#111', display: 'inline-block', border: '1px solid #333' }} /> Remaining
            </span>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      {stats.total > 0 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: `All (${grouped.length})` },
            { key: 'pending', label: `Pending (${stats.pending})` },
            { key: 'completed', label: `Removed (${stats.completed})` },
            { key: 'failed', label: `Failed (${stats.failed})` }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setRetryResults(null) }}
              style={{
                background: filter === f.key ? '#fff' : 'transparent',
                border: '1px solid #333',
                color: filter === f.key ? '#000' : '#555',
                padding: '6px 14px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: '1px',
                textTransform: 'uppercase',
                transition: 'all 0.2s'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Retry All Failed Button */}
      {filter === 'failed' && stats.failed > 0 && (
        <div style={{
          background: '#050505',
          border: '1px solid #222',
          padding: '18px',
          marginBottom: '15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ color: '#fff', fontSize: '0.8rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px', marginBottom: '4px' }}>
              {stats.failed} BROKER{stats.failed !== 1 ? 'S' : ''} FAILED
            </div>
            <div style={{ color: '#444', fontSize: '0.65rem', fontFamily: "'Share Tech Mono', monospace" }}>
              Resend CCPA/GDPR opt-out emails to all failed brokers at once
            </div>
          </div>
          <button
            onClick={retryAllFailed}
            disabled={retrying}
            style={{
              background: retrying ? '#111' : '#fff',
              border: '1px solid #444',
              color: retrying ? '#555' : '#000',
              padding: '10px 24px',
              cursor: retrying ? 'default' : 'pointer',
              fontSize: '0.75rem',
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: '2px',
              fontWeight: '700',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            {retrying ? 'RETRYING...' : `RETRY ALL ${stats.failed} FAILED`}
          </button>
        </div>
      )}

      {/* Retry Results */}
      {retryResults && filter === 'failed' && (
        <div style={{ background: '#050505', border: '1px solid #1a1a1a', padding: '18px', marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#fff', fontSize: '0.8rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px' }}>
              RETRY RESULTS
            </span>
            <button
              onClick={() => setRetryResults(null)}
              style={{ background: 'transparent', border: '1px solid #222', color: '#444', padding: '4px 10px', cursor: 'pointer', fontSize: '0.65rem', fontFamily: "'Share Tech Mono', monospace" }}
            >
              DISMISS
            </button>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '12px' }}>
            {[
              { label: 'Sent', value: retryResults.sent || 0, color: '#fff' },
              { label: 'Failed', value: retryResults.failed || 0, color: '#555' },
              { label: 'Skipped', value: retryResults.skipped || 0, color: '#333' }
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '900', color: s.color, fontFamily: "'Share Tech Mono', monospace" }}>{s.value}</div>
                <div style={{ color: '#444', fontSize: '0.6rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px' }}>{s.label}</div>
              </div>
            ))}
          </div>
          {retryResults.results && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxHeight: '150px', overflowY: 'auto' }}>
              {retryResults.results.map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#000', border: '1px solid #111' }}>
                  <span style={{ color: '#666', fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace" }}>{r.broker}</span>
                  <span style={{ color: r.success ? '#fff' : '#444', fontSize: '0.65rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px' }}>
                    {r.success ? 'SENT' : r.reason === 'recently_sent' || r.reason === 'already_removed' ? 'SKIPPED' : 'FAILED'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Broker List */}
      {filtered.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '600px', overflowY: 'auto' }}>
          {filtered.map(broker => {
            const a = broker.latest
            const isExpanded = expandedBroker === broker.broker_id
            const daysSince = getDaysSince(a.sent_at)
            const daysUntilFollowUp = getDaysUntil(a.next_follow_up)
            const isPending = ['sent', 'delivered', 'opened', 'responded'].includes(a.status)
            const timeline = getTimelineProgress(a)
            const hasVerifyUrl = VERIFY_URLS[broker.broker_id]

            return (
              <div key={broker.broker_id}>
                <div
                  onClick={() => setExpandedBroker(isExpanded ? null : broker.broker_id)}
                  style={{
                    background: a.status === 'completed' ? '#050505' : a.status === 'failed' ? '#0a0000' : '#0a0a0a',
                    border: `1px solid ${a.status === 'completed' ? '#1a1a1a' : isPending ? '#222' : '#1a1a1a'}`,
                    padding: '16px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontWeight: '700',
                        fontFamily: "'Share Tech Mono', monospace",
                        color: a.status === 'completed' ? '#666' : a.status === 'failed' ? '#555' : '#fff'
                      }}>
                        {broker.broker_name}
                      </span>
                      <span style={{
                        fontSize: '0.65rem',
                        color: STATUS_COLORS[a.status] || '#333',
                        fontFamily: "'Share Tech Mono', monospace",
                        letterSpacing: '2px',
                        border: `1px solid ${STATUS_COLORS[a.status] || '#333'}`,
                        padding: '2px 8px'
                      }}>
                        {STATUS_LABELS[a.status] || a.status?.toUpperCase()}
                      </span>
                      {a.verification_method && (
                        <span style={{ fontSize: '0.6rem', color: '#555', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px' }}>
                          {a.verification_method === 'auto_30day' ? 'AUTO-VERIFIED'
                            : a.verification_method === 'manual_check' ? 'USER VERIFIED'
                            : a.verification_method === 'webhook' ? 'EMAIL CONFIRMED'
                            : 'VERIFIED'}
                        </span>
                      )}
                      {broker.totalAttempts > 1 && (
                        <span style={{ fontSize: '0.6rem', color: '#444', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px' }}>
                          {broker.totalAttempts} ATTEMPTS
                        </span>
                      )}
                    </div>
                    <div style={{ color: '#333', fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace", display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                      <span>Sent {daysSince === 0 ? 'today' : `${daysSince}d ago`}</span>
                      {isPending && daysUntilFollowUp !== null && (
                        <span>Auto re-send in {daysUntilFollowUp}d</span>
                      )}
                      {isPending && <span>{30 - Math.min(daysSince, 30)}d until auto-verified</span>}
                      {a.method && <span>Via {a.method}</span>}
                    </div>
                    {isPending && (
                      <div style={{ marginTop: '8px', background: '#111', height: '2px', maxWidth: '200px' }}>
                        <div style={{
                          height: '100%',
                          width: `${timeline.percent}%`,
                          background: timeline.percent >= 100 ? '#fff' : '#444',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                    <span style={{
                      color: '#333',
                      fontSize: '0.8rem',
                      fontFamily: "'Share Tech Mono', monospace",
                      transition: 'transform 0.2s',
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
                    }}>
                      ▶
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ background: '#050505', border: '1px solid #1a1a1a', borderTop: 'none', padding: '20px' }}>

                    {isPending && (
                      <>
                        <div style={{ marginBottom: '20px' }}>
                          <div style={{ color: '#444', fontSize: '0.65rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '2px', marginBottom: '10px' }}>
                            UPDATE STATUS
                          </div>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {hasVerifyUrl && (
                              <a
                                href={hasVerifyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  background: '#111',
                                  border: '1px solid #444',
                                  color: '#fff',
                                  padding: '6px 14px',
                                  cursor: 'pointer',
                                  fontSize: '0.7rem',
                                  fontFamily: "'Share Tech Mono', monospace",
                                  letterSpacing: '1px',
                                  textDecoration: 'none',
                                  transition: 'all 0.2s'
                                }}
                                title="Some brokers paywall their data. The legal request has been sent regardless."
                              >
                                VIEW BROKER SITE (may require payment)
                              </a>
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); markStatus(a.id, broker.broker_id, 'completed', 'manual_check') }}
                              style={{ background: 'transparent', border: '1px solid #444', color: '#fff', padding: '6px 14px', cursor: 'pointer', fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px', transition: 'all 0.2s' }}
                            >
                              CONFIRM REMOVED
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); markStatus(a.id, broker.broker_id, 'responded') }}
                              style={{ background: 'transparent', border: '1px solid #333', color: '#888', padding: '6px 14px', cursor: 'pointer', fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px', transition: 'all 0.2s' }}
                            >
                              GOT RESPONSE
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); markStatus(a.id, broker.broker_id, 'failed') }}
                              style={{ background: 'transparent', border: '1px solid #222', color: '#555', padding: '6px 14px', cursor: 'pointer', fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px', transition: 'all 0.2s' }}
                            >
                              MARK FAILED
                            </button>
                          </div>
                        </div>

                        {/* Explanatory note about paywalls */}
                        <div style={{
                          marginBottom: '20px',
                          padding: '12px',
                          background: '#000',
                          border: '1px solid #111',
                          borderRadius: '0px'
                        }}>
                          <div style={{
                            color: '#333',
                            fontSize: '0.6rem',
                            fontFamily: "'Share Tech Mono', monospace",
                            letterSpacing: '2px',
                            marginBottom: '6px'
                          }}>
                            ⓘ ABOUT VERIFICATION
                          </div>
                          <div style={{
                            color: '#444',
                            fontSize: '0.7rem',
                            fontFamily: "'Share Tech Mono', monospace",
                            lineHeight: '1.4'
                          }}>
                            Some brokers paywall search results. <strong>You are not required to pay</strong> — the legal opt-out request has already been sent. 
                            Brokers are legally obligated to comply within 30 days under CCPA/GDPR. This site is provided for optional manual verification.
                          </div>
                        </div>
                      </>
                    )}

                    {a.status === 'completed' && (
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                          {hasVerifyUrl && (
                            <a
                              href={hasVerifyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              style={{ background: 'transparent', border: '1px solid #333', color: '#666', padding: '6px 14px', cursor: 'pointer', fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px', textDecoration: 'none' }}
                              title="Some brokers paywall their data. The legal request has been sent regardless."
                            >
                              RE-VERIFY ON SITE (may require payment)
                            </a>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); markStatus(a.id, broker.broker_id, 'sent') }}
                            style={{ background: 'transparent', border: '1px solid #222', color: '#444', padding: '6px 14px', cursor: 'pointer', fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px' }}
                          >
                            REVERT TO PENDING
                          </button>
                        </div>
                        {a.broker_response && (
                          <div style={{ marginTop: '10px', padding: '10px', background: '#000', border: '1px solid #111' }}>
                            <div style={{ color: '#333', fontSize: '0.6rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '2px', marginBottom: '4px' }}>
                              REMOVAL NOTE
                            </div>
                            <div style={{ color: '#555', fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace", fontStyle: 'italic' }}>
                              {a.broker_response}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {a.status === 'failed' && (
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); markStatus(a.id, broker.broker_id, 'sent') }}
                            style={{ background: 'transparent', border: '1px solid #333', color: '#555', padding: '6px 14px', cursor: 'pointer', fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px' }}
                          >
                            RETRY — MARK PENDING
                          </button>
                        </div>
                        {(a.error || a.broker_response) && (
                          <div style={{ marginTop: '10px', padding: '10px', background: '#000', border: '1px solid #111' }}>
                            <div style={{ color: '#333', fontSize: '0.6rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '2px', marginBottom: '4px' }}>
                              FAILURE REASON
                            </div>
                            <div style={{ color: '#555', fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace" }}>
                              {a.broker_response || a.error || 'Unknown error'}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 30-Day Timeline */}
                    {isPending && (
                      <div style={{ marginBottom: '20px', padding: '12px', background: '#000', border: '1px solid #111' }}>
                        <div style={{ color: '#333', fontSize: '0.6rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '2px', marginBottom: '8px' }}>
                          CCPA/GDPR 30-DAY COMPLIANCE TIMELINE
                        </div>
                        <div style={{ background: '#111', height: '4px', marginBottom: '8px' }}>
                          <div style={{
                            height: '100%',
                            width: `${timeline.percent}%`,
                            background: timeline.percent >= 100 ? '#fff' : '#666',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#444', fontSize: '0.6rem', fontFamily: "'Share Tech Mono', monospace" }}>
                            Day {Math.min(timeline.daysSince, 30)} of 30
                          </span>
                          <span style={{ color: '#444', fontSize: '0.6rem', fontFamily: "'Share Tech Mono', monospace" }}>
                            {timeline.percent >= 100
                              ? 'Will be auto-verified by next cron run'
                              : `${30 - timeline.daysSince} days remaining`}
                          </span>
                        </div>
                        <div style={{ color: '#333', fontSize: '0.6rem', fontFamily: "'Share Tech Mono', monospace", marginTop: '8px' }}>
                          Brokers must respond within 30 days. If no objection, deletion is presumed.
                        </div>
                      </div>
                    )}

                    {/* Detail Info */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      marginBottom: broker.history.length > 1 ? '20px' : '0'
                    }}>
                      {[
                        { label: 'Broker ID', value: broker.broker_id },
                        { label: 'Method', value: a.method || 'email' },
                        { label: 'Date Sent', value: new Date(a.sent_at).toLocaleString() },
                        { label: 'Delivered', value: a.delivered_at ? new Date(a.delivered_at).toLocaleString() : 'Awaiting...' },
                        { label: 'Opened', value: a.opened_at ? new Date(a.opened_at).toLocaleString() : 'Unknown' },
                        { label: 'Next Follow-up', value: a.next_follow_up ? new Date(a.next_follow_up).toLocaleDateString() : 'N/A' },
                        { label: 'Follow-up Count', value: a.follow_up_count || 0 },
                        { label: 'Email ID', value: a.email_id ? a.email_id.substring(0, 16) + '...' : 'N/A' },
                        ...(a.verified_at ? [{ label: 'Verified At', value: new Date(a.verified_at).toLocaleString() }] : []),
                        ...(a.verification_method ? [{ label: 'Verification', value: a.verification_method.replace(/_/g, ' ').toUpperCase() }] : []),
                      ].map(item => (
                        <div key={item.label}>
                          <div style={{ color: '#333', fontSize: '0.6rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '2px', marginBottom: '4px' }}>
                            {item.label}
                          </div>
                          <div style={{ color: '#666', fontSize: '0.75rem', fontFamily: "'Share Tech Mono', monospace" }}>
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Attempt History */}
                    {broker.history.length > 1 && (
                      <div>
                        <div style={{ color: '#333', fontSize: '0.6rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '2px', marginBottom: '10px' }}>
                          ATTEMPT HISTORY
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {broker.history.map((h, i) => (
                            <div key={h.id} style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              padding: '8px 12px',
                              background: '#000',
                              border: '1px solid #111'
                            }}>
                              <span style={{ color: '#444', fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace" }}>
                                #{broker.history.length - i} — {new Date(h.sent_at).toLocaleDateString()}
                              </span>
                              <span style={{
                                color: STATUS_COLORS[h.status] || '#333',
                                fontSize: '0.65rem',
                                fontFamily: "'Share Tech Mono', monospace",
                                letterSpacing: '1px'
                              }}>
                                {STATUS_LABELS[h.status] || h.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#333',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '0.8rem'
        }}>
          {filter === 'all'
            ? 'NO REMOVALS FOUND. INITIATE REMOVAL TO BEGIN TRACKING.'
            : `NO ${filter.toUpperCase()} REMOVALS FOUND.`}
        </div>
      )}

      {grouped.length > 0 && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#050505',
          border: '1px solid #1a1a1a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <span style={{ color: '#333', fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace" }}>
            Total emails sent: {attempts.length} | Unique brokers: {grouped.length}
          </span>
          <span style={{ color: '#333', fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace" }}>
            Auto-verified after 30 days under CCPA/GDPR compliance
          </span>
        </div>
      )}
    </div>
  )
}