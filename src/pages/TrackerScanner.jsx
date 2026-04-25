import { useState } from 'react'

const TRACKERS = [
  { id: 'meta-pixel',       name: 'Meta Pixel',           company: 'Meta',        signatures: ['fbq(', 'connect.facebook.net', 'facebook-pixel'],          severity: 'critical', category: 'Advertising',       description: 'Sends your browsing behavior directly to Facebook for ad targeting',               dataCollected: ['Page visits', 'Purchases', 'Form submissions', 'Button clicks'] },
  { id: 'google-ads',       name: 'Google Ads',           company: 'Google',      signatures: ['googleadservices.com', 'googlesyndication.com', 'adwords'], severity: 'critical', category: 'Advertising',       description: 'Tracks conversions and behavior for Google ad targeting',                          dataCollected: ['Ad clicks', 'Conversions', 'Purchase value', 'User behavior'] },
  { id: 'tiktok-pixel',     name: 'TikTok Pixel',         company: 'TikTok',      signatures: ['analytics.tiktok.com', 'ttq.load'],                         severity: 'critical', category: 'Advertising',       description: 'Tracks your behavior and sends it to TikTok',                                      dataCollected: ['Page visits', 'Purchases', 'Device info', 'Behavior patterns'] },
  { id: 'twitter-pixel',    name: 'Twitter/X Pixel',      company: 'Twitter/X',   signatures: ['static.ads-twitter.com', 'twq('],                           severity: 'high',     category: 'Advertising',       description: 'Tracks conversions and behavior for Twitter ad targeting',                         dataCollected: ['Page visits', 'Conversions', 'User behavior'] },
  { id: 'linkedin-insight', name: 'LinkedIn Insight Tag', company: 'LinkedIn',    signatures: ['snap.licdn.com', '_linkedin_partner'],                      severity: 'high',     category: 'Advertising',       description: 'Tracks professionals visiting websites for LinkedIn ad targeting',                  dataCollected: ['Job title', 'Company', 'Page visits', 'Conversions'] },
  { id: 'pinterest-tag',    name: 'Pinterest Tag',        company: 'Pinterest',   signatures: ['pintrk(', 'ct.pinterest.com'],                              severity: 'medium',   category: 'Advertising',       description: 'Tracks behavior for Pinterest ad targeting',                                       dataCollected: ['Page visits', 'Purchases', 'User behavior'] },
  { id: 'snapchat-pixel',   name: 'Snapchat Pixel',       company: 'Snapchat',    signatures: ['tr.snapchat.com', 'snaptr('],                               severity: 'high',     category: 'Advertising',       description: 'Tracks behavior for Snapchat ad targeting',                                        dataCollected: ['Page visits', 'Purchases', 'User behavior'] },
  { id: 'amazon-pixel',     name: 'Amazon Advertising',   company: 'Amazon',      signatures: ['amazon-adsystem.com', 'assoc-amazon.com'],                  severity: 'high',     category: 'Advertising',       description: 'Tracks shopping behavior across the web for Amazon ads',                           dataCollected: ['Purchase intent', 'Product views', 'Shopping behavior'] },
  { id: 'doubleclick',      name: 'Google DoubleClick',   company: 'Google',      signatures: ['doubleclick.net', 'googletagmanager.com'],                  severity: 'critical', category: 'Advertising',       description: 'Google ad network tracking your behavior across millions of websites',             dataCollected: ['Ad views', 'Clicks', 'Browsing history', 'Demographics'] },
  { id: 'google-analytics', name: 'Google Analytics',     company: 'Google',      signatures: ['google-analytics.com', 'gtag(', 'analytics.js'],            severity: 'high',     category: 'Analytics',         description: 'Tracks every click, scroll, and action on the website',                            dataCollected: ['Page views', 'Click paths', 'Time on page', 'Device info', 'Location'] },
  { id: 'hotjar',           name: 'Hotjar',               company: 'Hotjar',      signatures: ['hotjar.com', 'hjsetting'],                                  severity: 'critical', category: 'Session Recording', description: 'Records your entire session including mouse movements and keystrokes',            dataCollected: ['Mouse movements', 'Clicks', 'Scrolling', 'Form inputs', 'Session recordings'] },
  { id: 'mixpanel',         name: 'Mixpanel',             company: 'Mixpanel',    signatures: ['mixpanel.com', 'mixpanel.init'],                            severity: 'high',     category: 'Analytics',         description: 'Tracks detailed user behavior and creates behavioral profiles',                    dataCollected: ['User actions', 'Funnels', 'Retention data', 'Behavioral profiles'] },
  { id: 'segment',          name: 'Segment',              company: 'Twilio',      signatures: ['segment.com', 'cdn.segment.com'],                           severity: 'high',     category: 'Analytics',         description: 'Collects data and sends it to dozens of other tracking companies',                 dataCollected: ['All user events', 'Identity data', 'Behavioral data'] },
  { id: 'amplitude',        name: 'Amplitude',            company: 'Amplitude',   signatures: ['amplitude.com', 'cdn.amplitude.com'],                       severity: 'high',     category: 'Analytics',         description: 'Tracks detailed product analytics and user behavior',                              dataCollected: ['User actions', 'Session data', 'Device info', 'Behavioral patterns'] },
  { id: 'fullstory',        name: 'FullStory',            company: 'FullStory',   signatures: ['fullstory.com', '_fs_debug'],                               severity: 'critical', category: 'Session Recording', description: 'Records everything you do on a website in full detail',                           dataCollected: ['Full session recordings', 'Keystrokes', 'Clicks', 'Scrolling', 'Form data'] },
  { id: 'mouseflow',        name: 'Mouseflow',            company: 'Mouseflow',   signatures: ['mouseflow.com', 'mf.init'],                                 severity: 'critical', category: 'Session Recording', description: 'Records mouse movements and replays your entire session',                         dataCollected: ['Mouse movements', 'Clicks', 'Form inputs', 'Session recordings'] },
  { id: 'heap',             name: 'Heap Analytics',       company: 'Heap',        signatures: ['heapanalytics.com', 'heap.load'],                           severity: 'high',     category: 'Analytics',         description: 'Automatically captures every user interaction',                                    dataCollected: ['All clicks', 'Form submissions', 'Page views', 'User identity'] },
  { id: 'adobe-analytics',  name: 'Adobe Analytics',      company: 'Adobe',       signatures: ['omtrdc.net', '2o7.net', 'adobedtm.com'],                   severity: 'high',     category: 'Analytics',         description: 'Enterprise analytics tracking detailed user behavior',                             dataCollected: ['Page views', 'User behavior', 'Conversion data', 'Demographics'] },
  { id: 'hubspot',          name: 'HubSpot',              company: 'HubSpot',     signatures: ['hs-scripts.com', 'hubspot.com'],                            severity: 'high',     category: 'Marketing',         description: 'Tracks visitors and links behavior to marketing campaigns',                        dataCollected: ['Email', 'Page visits', 'Form data', 'Marketing interactions'] },
  { id: 'marketo',          name: 'Marketo',              company: 'Adobe',       signatures: ['munchkin.marketo.com', 'marketo.com'],                      severity: 'high',     category: 'Marketing',         description: 'Tracks visitors and ties behavior to marketing automation',                        dataCollected: ['Page visits', 'Form data', 'Email behavior', 'Marketing data'] },
  { id: 'intercom',         name: 'Intercom',             company: 'Intercom',    signatures: ['intercom.io', 'intercomsettings'],                          severity: 'medium',   category: 'Marketing',         description: 'Tracks user behavior to power customer messaging',                                 dataCollected: ['User identity', 'Page visits', 'Actions', 'Device info'] },
  { id: 'drift',            name: 'Drift',                company: 'Drift',       signatures: ['drift.com', 'js.driftt.com'],                               severity: 'medium',   category: 'Marketing',         description: 'Tracks visitors for live chat and marketing automation',                           dataCollected: ['Page visits', 'User identity', 'Behavioral data'] },
  { id: 'klaviyo',          name: 'Klaviyo',              company: 'Klaviyo',     signatures: ['klaviyo.com', 'klaviyo.init'],                              severity: 'high',     category: 'Marketing',         description: 'Tracks email and shopping behavior for marketing',                                 dataCollected: ['Email', 'Purchase history', 'Browsing behavior', 'Preferences'] },
  { id: 'acxiom',           name: 'Acxiom',               company: 'Acxiom',      signatures: ['acxiom.com'],                                               severity: 'critical', category: 'Data Broker',       description: 'One of the worlds largest data brokers collecting your data',                      dataCollected: ['Demographics', 'Purchase history', 'Financial data', 'Behavioral data'] },
  { id: 'lotame',           name: 'Lotame',               company: 'Lotame',      signatures: ['lotame.com', 'bcp.crwdcntrl.net'],                          severity: 'critical', category: 'Data Broker',       description: 'Data broker collecting behavioral data across millions of sites',                  dataCollected: ['Behavioral profiles', 'Demographics', 'Interest data'] },
  { id: 'liveramp',         name: 'LiveRamp',             company: 'LiveRamp',    signatures: ['liveramp.com', 'rlcdn.com'],                                severity: 'critical', category: 'Data Broker',       description: 'Connects your identity across devices and sells it to advertisers',                dataCollected: ['Identity data', 'Cross device data', 'Purchase history'] },
  { id: 'tapad',            name: 'Tapad',                company: 'Tapad',       signatures: ['tapad.com'],                                                severity: 'critical', category: 'Data Broker',       description: 'Cross device tracking linking your phone, tablet and computer',                    dataCollected: ['Device data', 'Behavioral data', 'Cross device identity'] },
  { id: 'fingerprintjs',    name: 'FingerprintJS',        company: 'Fingerprint', signatures: ['fingerprintjs.com', 'fpjs.io'],                             severity: 'critical', category: 'Fingerprinting',    description: 'Identifies you uniquely even if you clear cookies or use incognito',               dataCollected: ['Browser fingerprint', 'Device ID', 'Unique identifier'] },
  { id: 'maxmind',          name: 'MaxMind',              company: 'MaxMind',     signatures: ['maxmind.com', 'geoip2'],                                    severity: 'high',     category: 'Fingerprinting',    description: 'Identifies your precise location from your IP address',                            dataCollected: ['IP address', 'Precise location', 'ISP data'] },
  { id: 'optimizely',       name: 'Optimizely',           company: 'Optimizely',  signatures: ['optimizely.com', 'cdn.optimizely.com'],                     severity: 'medium',   category: 'A/B Testing',       description: 'Tests different versions of pages by tracking your behavior',                      dataCollected: ['User behavior', 'Conversion data', 'Test variations'] },
  { id: 'vwo',              name: 'VWO',                  company: 'VWO',         signatures: ['vwo.com', 'd5phz18u4wuww.cloudfront'],                      severity: 'medium',   category: 'A/B Testing',       description: 'Records behavior to test website changes',                                         dataCollected: ['User behavior', 'Click data', 'Conversion data'] },
  { id: 'salesforce',       name: 'Salesforce Beacon',    company: 'Salesforce',  signatures: ['beacon.krxd.net', 'krux.com'],                              severity: 'high',     category: 'Customer Data',     description: 'Collects behavioral data for CRM and advertising',                                 dataCollected: ['User identity', 'Behavioral data', 'Marketing data'] },
]

const KNOWN_SITE_TRACKERS = {
  'youtube.com':   ['google-analytics', 'google-ads', 'doubleclick'],
  'google.com':    ['google-analytics', 'google-ads', 'doubleclick'],
  'facebook.com':  ['meta-pixel', 'google-analytics', 'doubleclick'],
  'instagram.com': ['meta-pixel', 'google-analytics', 'doubleclick'],
  'amazon.com':    ['amazon-pixel', 'google-analytics', 'google-ads', 'doubleclick'],
  'twitter.com':   ['twitter-pixel', 'google-analytics', 'doubleclick'],
  'x.com':         ['twitter-pixel', 'google-analytics', 'doubleclick'],
  'tiktok.com':    ['tiktok-pixel', 'google-analytics', 'doubleclick'],
  'linkedin.com':  ['linkedin-insight', 'google-analytics', 'doubleclick'],
  'reddit.com':    ['google-analytics', 'google-ads', 'doubleclick', 'hotjar'],
  'netflix.com':   ['google-analytics', 'doubleclick', 'amplitude'],
  'spotify.com':   ['google-analytics', 'google-ads', 'doubleclick', 'segment'],
  'twitch.tv':     ['google-analytics', 'google-ads', 'doubleclick', 'amazon-pixel'],
  'ebay.com':      ['google-analytics', 'google-ads', 'doubleclick', 'hotjar'],
  'espn.com':      ['google-analytics', 'google-ads', 'doubleclick', 'adobe-analytics'],
  'cnn.com':       ['google-analytics', 'google-ads', 'doubleclick', 'adobe-analytics', 'lotame'],
  'nytimes.com':   ['google-analytics', 'google-ads', 'doubleclick', 'adobe-analytics', 'lotame', 'liveramp'],
  'walmart.com':   ['google-analytics', 'google-ads', 'doubleclick', 'hotjar', 'amplitude'],
  'target.com':    ['google-analytics', 'google-ads', 'doubleclick', 'hotjar', 'segment'],
  'apple.com':     ['google-analytics', 'doubleclick'],
  'microsoft.com': ['google-analytics', 'google-ads', 'doubleclick', 'linkedin-insight'],
  'github.com':    ['google-analytics', 'doubleclick'],
  'yahoo.com':     ['google-analytics', 'google-ads', 'doubleclick', 'lotame'],
  'pinterest.com': ['pinterest-tag', 'google-analytics', 'google-ads', 'doubleclick'],
  'snapchat.com':  ['snapchat-pixel', 'google-analytics', 'doubleclick'],
  'shopify.com':   ['google-analytics', 'google-ads', 'doubleclick', 'hotjar', 'segment'],
  'forbes.com':    ['google-analytics', 'google-ads', 'doubleclick', 'hotjar', 'lotame', 'liveramp'],
  'zillow.com':    ['google-analytics', 'google-ads', 'doubleclick', 'hotjar', 'segment', 'amplitude'],
  'booking.com':   ['google-analytics', 'google-ads', 'doubleclick', 'hotjar', 'segment'],
  'airbnb.com':    ['google-analytics', 'google-ads', 'doubleclick', 'amplitude', 'segment'],
  'uber.com':      ['google-analytics', 'google-ads', 'doubleclick', 'amplitude', 'segment'],
  'doordash.com':  ['google-analytics', 'google-ads', 'doubleclick', 'amplitude', 'segment', 'hotjar'],
}

const getSeverityLabel = (severity) => {
  switch (severity) {
    case 'critical': return '[ CRITICAL ]'
    case 'high':     return '[ HIGH ]'
    case 'medium':   return '[ MEDIUM ]'
    case 'low':      return '[ LOW ]'
    default:         return '[ UNKNOWN ]'
  }
}

const getRiskScore = (trackers) => {
  if (trackers.length === 0) return 0
  const weights = { critical: 25, high: 15, medium: 8, low: 3 }
  const total = trackers.reduce((sum, t) => sum + (weights[t.severity] || 0), 0)
  return Math.min(100, total)
}

const getRiskLabel = (score) => {
  if (score === 0)  return 'CLEAN'
  if (score < 25)   return 'LOW RISK'
  if (score < 50)   return 'MODERATE RISK'
  if (score < 75)   return 'HIGH RISK'
  return 'CRITICAL RISK'
}

const getHostname = (url) => {
  try { return new URL(url).hostname.replace('www.', '') }
  catch { return url.replace('www.', '') }
}

const getKnownTrackers = (hostname) => {
  if (KNOWN_SITE_TRACKERS[hostname]) return KNOWN_SITE_TRACKERS[hostname]
  for (const domain of Object.keys(KNOWN_SITE_TRACKERS)) {
    if (hostname.endsWith(domain)) return KNOWN_SITE_TRACKERS[domain]
  }
  return []
}

export default function TrackerScanner() {
  const [url, setUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [expandedTracker, setExpandedTracker] = useState(null)
  const [filterCategory, setFilterCategory] = useState('All')

  const normalizeUrl = (input) => {
    let cleaned = input.trim()
    if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
      cleaned = 'https://' + cleaned
    }
    return cleaned
  }

  const scanWebsite = async () => {
    if (!url.trim()) return
    setScanning(true)
    setResults(null)
    setError('')
    setFilterCategory('All')

    const targetUrl = normalizeUrl(url)
    const hostname = getHostname(targetUrl)

    try {
      const knownTrackerIds = getKnownTrackers(hostname)
      const knownTrackers = TRACKERS.filter(t => knownTrackerIds.includes(t.id))

      let htmlTrackers = []
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scan-website`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({ url: targetUrl })
          }
        )
        const data = await response.json()
        if (data.success && data.html) {
          const htmlLower = data.html.toLowerCase()
          for (const tracker of TRACKERS) {
            if (tracker.signatures.some(sig => htmlLower.includes(sig.toLowerCase()))) {
              htmlTrackers.push(tracker)
            }
          }
        }
      } catch (err) {
        console.log('HTML scan failed:', err.message)
      }

      const allTrackerIds = new Set([
        ...knownTrackers.map(t => t.id),
        ...htmlTrackers.map(t => t.id)
      ])
      const foundTrackers = TRACKERS.filter(t => allTrackerIds.has(t.id))
      const taggedTrackers = foundTrackers.map(t => ({
        ...t,
        source: knownTrackerIds.includes(t.id) && htmlTrackers.find(h => h.id === t.id)
          ? 'both'
          : knownTrackerIds.includes(t.id) ? 'known' : 'detected'
      }))

      const score = getRiskScore(taggedTrackers)
      const categories = [...new Set(taggedTrackers.map(t => t.category))]

      setResults({
        url: targetUrl,
        hostname,
        trackers: taggedTrackers,
        score,
        categories,
        scannedAt: new Date().toLocaleTimeString(),
        isKnownSite: knownTrackerIds.length > 0,
        knownCount: knownTrackers.length,
        detectedCount: htmlTrackers.filter(h => !knownTrackerIds.includes(h.id)).length
      })

    } catch (err) {
      console.error('Scan error:', err)
      setError('Could not scan this website. Try: youtube.com, amazon.com or espn.com')
    }

    setScanning(false)
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter') scanWebsite() }

  const filteredTrackers = results
    ? filterCategory === 'All'
      ? results.trackers
      : results.trackers.filter(t => t.category === filterCategory)
    : []

  const mono = { fontFamily: "'Share Tech Mono', monospace" }

  return (
    <div className="tool-container" style={{ maxWidth: '900px' }}>
      <div className="tool-header">
        <h1>Tracker Scanner</h1>
        <p className="tool-sub">
          Scan any website to reveal hidden trackers, pixels, and surveillance tools
        </p>
      </div>

      {/* Input */}
      <div style={{
        background: '#000',
        border: '1px solid #1a1a1a',
        padding: '25px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Enter any website (e.g. youtube.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input"
            style={{ flex: 1 }}
          />
          <button
            onClick={scanWebsite}
            className="button"
            disabled={scanning || !url.trim()}
            style={{ whiteSpace: 'nowrap', marginTop: 0 }}
          >
            {scanning ? 'Scanning...' : 'Scan Site'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ color: '#333', fontSize: '0.75rem', ...mono }}>Try:</span>
          {['youtube.com', 'facebook.com', 'amazon.com', 'espn.com', 'cnn.com'].map(site => (
            <button
              key={site}
              onClick={() => { setUrl(site); setError('') }}
              style={{
                background: 'transparent',
                border: '1px solid #222',
                color: '#444',
                padding: '4px 12px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                ...mono
              }}
            >
              {site}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: '#000',
          border: '1px solid #333',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ color: '#fff', marginBottom: '12px', fontSize: '0.85rem', ...mono }}>
            {error}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['youtube.com', 'amazon.com', 'espn.com', 'cnn.com', 'reddit.com'].map(site => (
              <button
                key={site}
                onClick={() => { setUrl(site); setError('') }}
                style={{
                  background: 'transparent',
                  border: '1px solid #333',
                  color: '#555',
                  padding: '4px 12px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  ...mono
                }}
              >
                {site}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scanning */}
      {scanning && (
        <div style={{
          background: '#000',
          border: '1px solid #1a1a1a',
          padding: '50px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <div style={{
            fontSize: '0.9rem',
            color: '#fff',
            marginBottom: '8px',
            animation: 'pulse 1s infinite',
            ...mono
          }}>
            Scanning {url}...
          </div>
          <div style={{ color: '#333', fontSize: '0.8rem', ...mono }}>
            Checking known database and analyzing page source
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <>
          {/* Risk Score */}
          <div style={{
            background: '#000',
            border: '1px solid #1a1a1a',
            padding: '30px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <div style={{
                fontSize: '0.7rem',
                color: '#444',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '8px',
                ...mono
              }}>
                Risk Score — {results.hostname}
              </div>
              <div style={{
                fontSize: '3.5rem',
                fontWeight: '900',
                color: '#fff',
                lineHeight: 1,
                ...mono
              }}>
                {results.score}/100
              </div>
              <div style={{
                color: '#fff',
                fontSize: '0.85rem',
                marginTop: '8px',
                letterSpacing: '2px',
                ...mono
              }}>
                {getRiskLabel(results.score)}
              </div>
              <div style={{ color: '#333', fontSize: '0.75rem', marginTop: '5px', ...mono }}>
                Scanned at {results.scannedAt}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '3.5rem',
                fontWeight: '900',
                color: '#fff',
                ...mono
              }}>
                {results.trackers.length}
              </div>
              <div style={{
                color: '#555',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                ...mono
              }}>
                Trackers Found
              </div>
            </div>
          </div>

          {/* Source badges */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {results.isKnownSite && (
              <div style={{
                background: '#000',
                border: '1px solid #333',
                padding: '8px 14px',
                fontSize: '0.75rem',
                color: '#fff',
                ...mono
              }}>
                {results.knownCount} trackers from verified database
              </div>
            )}
            {results.detectedCount > 0 && (
              <div style={{
                background: '#000',
                border: '1px solid #333',
                padding: '8px 14px',
                fontSize: '0.75rem',
                color: '#fff',
                ...mono
              }}>
                {results.detectedCount} additional trackers detected in page source
              </div>
            )}
            {!results.isKnownSite && results.detectedCount === 0 && (
              <div style={{
                background: '#000',
                border: '1px solid #222',
                padding: '8px 14px',
                fontSize: '0.75rem',
                color: '#444',
                ...mono
              }}>
                Unknown site — scanned page source only
              </div>
            )}
          </div>

          {/* Severity Stats */}
          {results.trackers.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '8px',
              marginBottom: '20px'
            }}>
              {['critical', 'high', 'medium', 'low'].map(severity => {
                const count = results.trackers.filter(t => t.severity === severity).length
                if (count === 0) return null
                return (
                  <div key={severity} style={{
                    background: '#000',
                    border: '1px solid #1a1a1a',
                    padding: '15px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '1.8rem',
                      fontWeight: '900',
                      color: '#fff',
                      ...mono
                    }}>
                      {count}
                    </div>
                    <div style={{
                      color: '#444',
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginTop: '4px',
                      ...mono
                    }}>
                      {severity}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Clean Result */}
          {results.trackers.length === 0 && (
            <div style={{
              background: '#000',
              border: '1px solid #1a1a1a',
              padding: '50px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#fff', marginBottom: '8px', ...mono }}>
                No Known Trackers Detected
              </h3>
              <p style={{ color: '#444', fontSize: '0.85rem', ...mono }}>
                This site appears clean from our database of {TRACKERS.length} known trackers
              </p>
            </div>
          )}

          {/* Category Filter */}
          {results.trackers.length > 0 && (
            <>
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '15px'
              }}>
                {['All', ...results.categories].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    style={{
                      background: filterCategory === cat ? '#fff' : 'transparent',
                      border: '1px solid #333',
                      color: filterCategory === cat ? '#000' : '#555',
                      padding: '5px 14px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      transition: 'all 0.2s',
                      ...mono
                    }}
                  >
                    {cat} ({cat === 'All'
                      ? results.trackers.length
                      : results.trackers.filter(t => t.category === cat).length})
                  </button>
                ))}
              </div>

              {/* Tracker List */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                marginBottom: '20px'
              }}>
                {filteredTrackers.map(tracker => (
                  <div
                    key={tracker.id}
                    onClick={() => setExpandedTracker(
                      expandedTracker === tracker.id ? null : tracker.id
                    )}
                    style={{
                      background: '#000',
                      border: '1px solid #1a1a1a',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {/* Tracker Header */}
                    <div style={{
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#fff',
                          flexShrink: 0
                        }} />
                        <div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            flexWrap: 'wrap'
                          }}>
                            <span style={{
                              fontWeight: '700',
                              color: '#fff',
                              ...mono
                            }}>
                              {tracker.name}
                            </span>
                            <span style={{
                              fontSize: '0.7rem',
                              color: '#555',
                              letterSpacing: '1px',
                              ...mono
                            }}>
                              {tracker.category}
                            </span>
                            <span style={{
                              fontSize: '0.7rem',
                              color: '#555',
                              letterSpacing: '1px',
                              ...mono
                            }}>
                              {getSeverityLabel(tracker.severity)}
                            </span>
                            <span style={{
                              fontSize: '0.65rem',
                              color: '#333',
                              border: '1px solid #222',
                              padding: '1px 6px',
                              ...mono
                            }}>
                              {tracker.source === 'detected'
                                ? 'detected'
                                : tracker.source === 'both'
                                ? 'verified + detected'
                                : 'verified'}
                            </span>
                          </div>
                          <div style={{
                            color: '#444',
                            fontSize: '0.75rem',
                            marginTop: '3px',
                            ...mono
                          }}>
                            by {tracker.company}
                          </div>
                        </div>
                      </div>
                      <span style={{
                        color: '#333',
                        fontSize: '0.75rem',
                        transition: 'transform 0.2s',
                        transform: expandedTracker === tracker.id
                          ? 'rotate(180deg)' : 'rotate(0deg)',
                        ...mono
                      }}>
                        ▼
                      </span>
                    </div>

                    {/* Expanded */}
                    {expandedTracker === tracker.id && (
                      <div style={{
                        padding: '20px',
                        borderTop: '1px solid #1a1a1a',
                        background: '#050505'
                      }}>
                        <p style={{
                          color: '#666',
                          fontSize: '0.85rem',
                          marginBottom: '15px',
                          lineHeight: '1.6',
                          ...mono
                        }}>
                          {tracker.description}
                        </p>
                        <div>
                          <div style={{
                            fontSize: '0.7rem',
                            color: '#333',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            marginBottom: '8px',
                            ...mono
                          }}>
                            Data Being Collected:
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {tracker.dataCollected.map(item => (
                              <span key={item} style={{
                                background: '#000',
                                border: '1px solid #222',
                                color: '#555',
                                padding: '3px 10px',
                                fontSize: '0.75rem',
                                ...mono
                              }}>
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Footer */}
          <div style={{
            padding: '20px',
            background: '#000',
            border: '1px solid #1a1a1a',
            color: '#333',
            fontSize: '0.75rem',
            textAlign: 'center',
            ...mono
          }}>
            Combines verified tracker database and live page scanning —
            {Object.keys(KNOWN_SITE_TRACKERS).length} sites in database —
            {TRACKERS.length} tracker signatures
          </div>
        </>
      )}
    </div>
  )
}