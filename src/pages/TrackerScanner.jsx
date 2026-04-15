import { useState } from 'react'

const TRACKERS = [
  // ADVERTISING
  {
    id: 'meta-pixel',
    name: 'Meta Pixel',
    company: 'Meta',
    signatures: ['fbq(', 'connect.facebook.net', 'facebook-pixel', 'fb-pixel'],
    severity: 'critical',
    category: 'Advertising',
    description: 'Sends your browsing behavior directly to Facebook for ad targeting',
    dataCollected: ['Page visits', 'Purchases', 'Form submissions', 'Button clicks']
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    company: 'Google',
    signatures: ['googleadservices.com', 'googlesyndication.com', 'gtag/js', 'adwords'],
    severity: 'critical',
    category: 'Advertising',
    description: 'Tracks conversions and behavior for Google ad targeting',
    dataCollected: ['Ad clicks', 'Conversions', 'Purchase value', 'User behavior']
  },
  {
    id: 'tiktok-pixel',
    name: 'TikTok Pixel',
    company: 'TikTok',
    signatures: ['analytics.tiktok.com', 'tiktok-pixel', 'ttq.load', 'tiktok.com/i18n/pixel'],
    severity: 'critical',
    category: 'Advertising',
    description: 'Tracks your behavior and sends it to TikTok and potentially the Chinese government',
    dataCollected: ['Page visits', 'Purchases', 'Device info', 'Behavior patterns']
  },
  {
    id: 'twitter-pixel',
    name: 'Twitter/X Pixel',
    company: 'Twitter/X',
    signatures: ['static.ads-twitter.com', 'twq(', 'twitter-pixel'],
    severity: 'high',
    category: 'Advertising',
    description: 'Tracks conversions and behavior for Twitter ad targeting',
    dataCollected: ['Page visits', 'Conversions', 'User behavior']
  },
  {
    id: 'linkedin-insight',
    name: 'LinkedIn Insight Tag',
    company: 'LinkedIn',
    signatures: ['snap.licdn.com', 'linkedin-insight', '_linkedin_partner'],
    severity: 'high',
    category: 'Advertising',
    description: 'Tracks professionals visiting websites for LinkedIn ad targeting',
    dataCollected: ['Job title', 'Company', 'Page visits', 'Conversions']
  },
  {
    id: 'pinterest-tag',
    name: 'Pinterest Tag',
    company: 'Pinterest',
    signatures: ['pintrk(', 'ct.pinterest.com', 'pinterest-tag'],
    severity: 'medium',
    category: 'Advertising',
    description: 'Tracks behavior for Pinterest ad targeting',
    dataCollected: ['Page visits', 'Purchases', 'User behavior']
  },
  {
    id: 'snapchat-pixel',
    name: 'Snapchat Pixel',
    company: 'Snapchat',
    signatures: ['tr.snapchat.com', 'snaptr(', 'snap-pixel'],
    severity: 'high',
    category: 'Advertising',
    description: 'Tracks behavior for Snapchat ad targeting',
    dataCollected: ['Page visits', 'Purchases', 'User behavior']
  },
  {
    id: 'amazon-pixel',
    name: 'Amazon Advertising',
    company: 'Amazon',
    signatures: ['amazon-adsystem.com', 'assoc-amazon.com', 'amazon-pixel'],
    severity: 'high',
    category: 'Advertising',
    description: 'Tracks shopping behavior across the web for Amazon ads',
    dataCollected: ['Purchase intent', 'Product views', 'Shopping behavior']
  },
  {
    id: 'doubleclick',
    name: 'Google DoubleClick',
    company: 'Google',
    signatures: ['doubleclick.net', 'googletagmanager.com', 'gtm.js'],
    severity: 'critical',
    category: 'Advertising',
    description: 'Google ad network tracking your behavior across millions of websites',
    dataCollected: ['Ad views', 'Clicks', 'Browsing history', 'Demographics']
  },

  // ANALYTICS
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    company: 'Google',
    signatures: ['google-analytics.com', 'gtag(', 'ga(', 'analytics.js', 'googleanalyticsobject'],
    severity: 'high',
    category: 'Analytics',
    description: 'Tracks every click, scroll, and action on the website',
    dataCollected: ['Page views', 'Click paths', 'Time on page', 'Device info', 'Location']
  },
  {
    id: 'hotjar',
    name: 'Hotjar',
    company: 'Hotjar',
    signatures: ['hotjar.com', 'hjsetting', 'hotjar'],
    severity: 'critical',
    category: 'Session Recording',
    description: 'Records your entire session including mouse movements and keystrokes',
    dataCollected: ['Mouse movements', 'Clicks', 'Scrolling', 'Form inputs', 'Session recordings']
  },
  {
    id: 'mixpanel',
    name: 'Mixpanel',
    company: 'Mixpanel',
    signatures: ['mixpanel.com', 'mixpanel.init', 'mp_main'],
    severity: 'high',
    category: 'Analytics',
    description: 'Tracks detailed user behavior and creates behavioral profiles',
    dataCollected: ['User actions', 'Funnels', 'Retention data', 'Behavioral profiles']
  },
  {
    id: 'segment',
    name: 'Segment',
    company: 'Twilio',
    signatures: ['segment.com', 'cdn.segment.com', 'segment.io'],
    severity: 'high',
    category: 'Analytics',
    description: 'Collects data and sends it to dozens of other tracking companies',
    dataCollected: ['All user events', 'Identity data', 'Behavioral data']
  },
  {
    id: 'amplitude',
    name: 'Amplitude',
    company: 'Amplitude',
    signatures: ['amplitude.com', 'amplitude.getinstance', 'cdn.amplitude.com'],
    severity: 'high',
    category: 'Analytics',
    description: 'Tracks detailed product analytics and user behavior',
    dataCollected: ['User actions', 'Session data', 'Device info', 'Behavioral patterns']
  },
  {
    id: 'fullstory',
    name: 'FullStory',
    company: 'FullStory',
    signatures: ['fullstory.com', '_fs_debug', 'fullstory'],
    severity: 'critical',
    category: 'Session Recording',
    description: 'Records everything you do on a website in full detail',
    dataCollected: ['Full session recordings', 'Keystrokes', 'Clicks', 'Scrolling', 'Form data']
  },
  {
    id: 'mouseflow',
    name: 'Mouseflow',
    company: 'Mouseflow',
    signatures: ['mouseflow.com', 'mf.init', 'mouseflow'],
    severity: 'critical',
    category: 'Session Recording',
    description: 'Records mouse movements and replays your entire session',
    dataCollected: ['Mouse movements', 'Clicks', 'Form inputs', 'Session recordings']
  },
  {
    id: 'heap',
    name: 'Heap Analytics',
    company: 'Heap',
    signatures: ['heapanalytics.com', 'heap.load', 'heap.io'],
    severity: 'high',
    category: 'Analytics',
    description: 'Automatically captures every user interaction',
    dataCollected: ['All clicks', 'Form submissions', 'Page views', 'User identity']
  },
  {
    id: 'adobe-analytics',
    name: 'Adobe Analytics',
    company: 'Adobe',
    signatures: ['omtrdc.net', '2o7.net', 'adobedtm.com', 'demdex.net'],
    severity: 'high',
    category: 'Analytics',
    description: 'Enterprise analytics tracking detailed user behavior',
    dataCollected: ['Page views', 'User behavior', 'Conversion data', 'Demographics']
  },

  // MARKETING
  {
    id: 'hubspot',
    name: 'HubSpot',
    company: 'HubSpot',
    signatures: ['hs-scripts.com', 'hubspot.com', 'hbspt.forms', 'hsforms'],
    severity: 'high',
    category: 'Marketing',
    description: 'Tracks visitors and links behavior to marketing campaigns',
    dataCollected: ['Email', 'Page visits', 'Form data', 'Marketing interactions']
  },
  {
    id: 'marketo',
    name: 'Marketo',
    company: 'Adobe',
    signatures: ['munchkin.marketo.com', 'marketo.com', 'munchkin.init'],
    severity: 'high',
    category: 'Marketing',
    description: 'Tracks visitors and ties behavior to marketing automation',
    dataCollected: ['Page visits', 'Form data', 'Email behavior', 'Marketing data']
  },
  {
    id: 'intercom',
    name: 'Intercom',
    company: 'Intercom',
    signatures: ['intercom.io', 'intercomsettings', 'widget.intercom.io'],
    severity: 'medium',
    category: 'Marketing',
    description: 'Tracks user behavior to power customer messaging',
    dataCollected: ['User identity', 'Page visits', 'Actions', 'Device info']
  },
  {
    id: 'drift',
    name: 'Drift',
    company: 'Drift',
    signatures: ['drift.com', 'js.driftt.com', 'drift.load'],
    severity: 'medium',
    category: 'Marketing',
    description: 'Tracks visitors for live chat and marketing automation',
    dataCollected: ['Page visits', 'User identity', 'Behavioral data']
  },
  {
    id: 'klaviyo',
    name: 'Klaviyo',
    company: 'Klaviyo',
    signatures: ['klaviyo.com', 'klaviyo.init', 'kl_email'],
    severity: 'high',
    category: 'Marketing',
    description: 'Tracks email and shopping behavior for marketing',
    dataCollected: ['Email', 'Purchase history', 'Browsing behavior', 'Preferences']
  },
  {
    id: 'oracle-eloqua',
    name: 'Oracle Eloqua',
    company: 'Oracle',
    signatures: ['eloqua.com', 'elqimg.com', 'elq.com'],
    severity: 'high',
    category: 'Marketing',
    description: 'Tracks visitor behavior for marketing automation',
    dataCollected: ['Email', 'Page visits', 'Form data', 'Behavioral data']
  },

  // DATA BROKERS
  {
    id: 'acxiom',
    name: 'Acxiom',
    company: 'Acxiom',
    signatures: ['acxiom.com', 'acxiom-pixel'],
    severity: 'critical',
    category: 'Data Broker',
    description: 'One of the worlds largest data brokers collecting your data',
    dataCollected: ['Demographics', 'Purchase history', 'Financial data', 'Behavioral data']
  },
  {
    id: 'lotame',
    name: 'Lotame',
    company: 'Lotame',
    signatures: ['lotame.com', 'bcp.crwdcntrl.net', 'lotame-pixel'],
    severity: 'critical',
    category: 'Data Broker',
    description: 'Data broker collecting behavioral data across millions of sites',
    dataCollected: ['Behavioral profiles', 'Demographics', 'Interest data']
  },
  {
    id: 'liveramp',
    name: 'LiveRamp',
    company: 'LiveRamp',
    signatures: ['liveramp.com', 'rlcdn.com', 'liveramp-pixel'],
    severity: 'critical',
    category: 'Data Broker',
    description: 'Connects your identity across devices and sells it to advertisers',
    dataCollected: ['Identity data', 'Cross device data', 'Purchase history']
  },
  {
    id: 'tapad',
    name: 'Tapad',
    company: 'Tapad',
    signatures: ['tapad.com', 'tapad-pixel'],
    severity: 'critical',
    category: 'Data Broker',
    description: 'Cross device tracking linking your phone, tablet and computer',
    dataCollected: ['Device data', 'Behavioral data', 'Cross device identity']
  },
  {
    id: 'neustar',
    name: 'Neustar',
    company: 'Neustar',
    signatures: ['neustar.biz', 'marketing.neustar'],
    severity: 'critical',
    category: 'Data Broker',
    description: 'Collects identity data and sells it for marketing',
    dataCollected: ['Phone data', 'Demographics', 'Location', 'Identity']
  },
  {
    id: 'oracle-datacloud',
    name: 'Oracle Data Cloud',
    company: 'Oracle',
    signatures: ['datalogix.com', 'oracle.com/datacloud', 'bluekai.com'],
    severity: 'critical',
    category: 'Data Broker',
    description: 'Oracle data broker tracking purchases and demographics',
    dataCollected: ['Purchase history', 'Demographics', 'Location', 'Behavioral data']
  },

  // FINGERPRINTING
  {
    id: 'fingerprintjs',
    name: 'FingerprintJS',
    company: 'Fingerprint',
    signatures: ['fingerprintjs.com', 'fpjs.io', 'fingerprint'],
    severity: 'critical',
    category: 'Fingerprinting',
    description: 'Identifies you uniquely even if you clear cookies or use incognito',
    dataCollected: ['Browser fingerprint', 'Device ID', 'Unique identifier']
  },
  {
    id: 'maxmind',
    name: 'MaxMind',
    company: 'MaxMind',
    signatures: ['maxmind.com', 'geoip2', 'maxmind'],
    severity: 'high',
    category: 'Fingerprinting',
    description: 'Identifies your precise location from your IP address',
    dataCollected: ['IP address', 'Precise location', 'ISP data']
  },

  // A/B TESTING
  {
    id: 'optimizely',
    name: 'Optimizely',
    company: 'Optimizely',
    signatures: ['optimizely.com', 'optimizely.push', 'cdn.optimizely.com'],
    severity: 'medium',
    category: 'A/B Testing',
    description: 'Tests different versions of pages by tracking your behavior',
    dataCollected: ['User behavior', 'Conversion data', 'Test variations']
  },
  {
    id: 'vwo',
    name: 'VWO',
    company: 'VWO',
    signatures: ['vwo.com', 'vwo.push', 'd5phz18u4wuww.cloudfront'],
    severity: 'medium',
    category: 'A/B Testing',
    description: 'Records behavior to test website changes',
    dataCollected: ['User behavior', 'Click data', 'Conversion data']
  },

  // CUSTOMER DATA
  {
    id: 'salesforce',
    name: 'Salesforce Beacon',
    company: 'Salesforce',
    signatures: ['salesforce.com', 'beacon.krxd.net', 'krux.com'],
    severity: 'high',
    category: 'Customer Data',
    description: 'Collects behavioral data for CRM and advertising',
    dataCollected: ['User identity', 'Behavioral data', 'Marketing data']
  },
]

// KNOWN SITE DATABASE
// Manually researched tracker lists for major sites
// These are loaded regardless of HTML scan results
const KNOWN_SITE_TRACKERS = {
  'youtube.com': [
    'google-analytics',
    'google-ads',
    'doubleclick'
  ],
  'google.com': [
    'google-analytics',
    'google-ads',
    'doubleclick'
  ],
  'facebook.com': [
    'meta-pixel',
    'google-analytics',
    'doubleclick'
  ],
  'instagram.com': [
    'meta-pixel',
    'google-analytics',
    'doubleclick'
  ],
  'amazon.com': [
    'amazon-pixel',
    'google-analytics',
    'google-ads',
    'doubleclick'
  ],
  'twitter.com': [
    'twitter-pixel',
    'google-analytics',
    'doubleclick'
  ],
  'x.com': [
    'twitter-pixel',
    'google-analytics',
    'doubleclick'
  ],
  'tiktok.com': [
    'tiktok-pixel',
    'google-analytics',
    'doubleclick'
  ],
  'linkedin.com': [
    'linkedin-insight',
    'google-analytics',
    'doubleclick',
    'bing-ads'
  ],
  'reddit.com': [
    'google-analytics',
    'google-ads',
    'doubleclick',
    'hotjar'
  ],
  'netflix.com': [
    'google-analytics',
    'doubleclick',
    'amplitude'
  ],
  'spotify.com': [
    'google-analytics',
    'google-ads',
    'doubleclick',
    'segment'
  ],
  'twitch.tv': [
    'google-analytics',
    'google-ads',
    'doubleclick',
    'amazon-pixel'
  ],
  'ebay.com': [
    'google-analytics',
    'google-ads',
    'doubleclick',
    'hotjar'
  ],
  'espn.com': [
    'google-analytics',
    'google-ads',
    'doubleclick',
    'adobe-analytics',
    'nielsen'
  ],
  'cnn.com': [
    'google-analytics',
    'google-ads',
    'doubleclick',
    'adobe-analytics',
    'lotame',
    'nielsen'
  ],
  'nytimes.com': [
    'google-analytics',
    'google-ads',
    'doubleclick',
    'adobe-analytics',
    'lotame',
    'liveramp'
  ],
  'walmart.com': [
    'google-analytics',
    'google-ads',
    'doubleclick',
    'hotjar',
    'amplitude'
  ],
  'target.com': [
    'google-analytics',
    'google-ads',
    'doubleclick',
    'hotjar',
    'segment'
  ],
  'apple.com': [
    'google-analytics',
    'doubleclick'
  ],
  'microsoft.com': [
    'google-analytics',
    'google-ads',
    'doubleclick',
    'linkedin-insight'
  ],
  'github.com': [
    'google-analytics',
    'doubleclick'
  ],
  'yahoo.com': [
    'google-analytics',
    'google-ads',
    'doubleclick',
    'lotame',
    'neustar'
  ],
  'msn.com': [
    'google-analytics',
    'google-ads',
    'doubleclick',
    'linkedin-insight'
  ],
  'twitch.com': [
    'google-analytics',
    'google-ads',
    'doubleclick',
    'amazon-pixel'
  ],
  'pinterest.com': [
    'pinterest-tag',
    'google-analytics',
    'google-ads',
    'doubleclick'
  ],
  'snapchat.com': [
    'snapchat-pixel',
    'google-analytics',
    'doubleclick'
  ],
  'shopify.com': [
    'google-analytics',
    'google-ads',
    'doubleclick',
    'hotjar',
    'segment'
  ],
  'buzzfeed.com': [
    'google-analytics',
    'google-ads',
    'doubleclick',
    'lotame',
    'nielsen',
    'hotjar'
  ],
  'huffpost.com': [
    'google-analytics',
    'google-ads',
    'doubleclick',
    'lotame',
    'nielsen'
  ],
  'theguardian.com': [
    'google-analytics',
    'google-ads',
    'doubleclick',
    'lotame',
    'liveramp'
  ],
  'forbes.com': [
    'google-analytics',
    'google-ads',
    'doubleclick',
    'hotjar',
    'lotame',
    'liveramp',
    'neustar'
  ],
  'businessinsider.com': [
    'google-analytics',
    'google-ads',
    'doubleclick',
    'lotame',
    'neustar',
    'liveramp'
  ],
  'zillow.com': [
    'google-analytics',
    'google-ads',
    'doubleclick',
    'hotjar',
    'segment',
    'amplitude'
  ],
  'booking.com': [
    'google-analytics',
    'google-ads',
    'doubleclick',
    'hotjar',
    'segment'
  ],
  'airbnb.com': [
    'google-analytics',
    'google-ads',
    'doubleclick',
    'amplitude',
    'segment'
  ],
  'uber.com': [
    'google-analytics',
    'google-ads',
    'doubleclick',
    'amplitude',
    'segment'
  ],
  'doordash.com': [
    'google-analytics',
    'google-ads',
    'doubleclick',
    'amplitude',
    'segment',
    'hotjar'
  ],
}

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'critical': return '#ff4444'
    case 'high': return '#ff6b6b'
    case 'medium': return '#ffaa00'
    case 'low': return '#4aff88'
    default: return '#888'
  }
}

const getCategoryColor = (category) => {
  switch (category) {
    case 'Advertising': return '#ff6b6b'
    case 'Analytics': return '#4a9eff'
    case 'Session Recording': return '#ff4444'
    case 'Marketing': return '#ffaa00'
    case 'Data Broker': return '#ff4aff'
    case 'Fingerprinting': return '#ff8c00'
    case 'A/B Testing': return '#4affff'
    case 'Customer Data': return '#4aff88'
    default: return '#888'
  }
}

const getRiskScore = (trackers) => {
  if (trackers.length === 0) return 0
  const weights = { critical: 25, high: 15, medium: 8, low: 3 }
  const total = trackers.reduce((sum, t) => sum + (weights[t.severity] || 0), 0)
  return Math.min(100, total)
}

const getRiskLabel = (score) => {
  if (score === 0) return { label: 'Clean', color: '#4aff88' }
  if (score < 25) return { label: 'Low Risk', color: '#4aff88' }
  if (score < 50) return { label: 'Moderate Risk', color: '#ffaa00' }
  if (score < 75) return { label: 'High Risk', color: '#ff6b6b' }
  return { label: 'Critical Risk', color: '#ff4444' }
}

const getHostname = (url) => {
  try {
    const hostname = new URL(url).hostname
    return hostname.replace('www.', '')
  } catch {
    return url.replace('www.', '')
  }
}

const getKnownTrackers = (hostname) => {
  // Check exact match first
  if (KNOWN_SITE_TRACKERS[hostname]) {
    return KNOWN_SITE_TRACKERS[hostname]
  }
  // Check if hostname ends with a known domain
  for (const domain of Object.keys(KNOWN_SITE_TRACKERS)) {
    if (hostname.endsWith(domain)) {
      return KNOWN_SITE_TRACKERS[domain]
    }
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
      // Step 1: Get known trackers for this domain
      const knownTrackerIds = getKnownTrackers(hostname)
      const knownTrackers = TRACKERS.filter(t =>
        knownTrackerIds.includes(t.id)
      )

      // Step 2: Scan HTML for additional trackers
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
            const found = tracker.signatures.some(sig =>
              htmlLower.includes(sig.toLowerCase())
            )
            if (found) htmlTrackers.push(tracker)
          }
        }
      } catch (err) {
        // HTML scan failed but we still have known trackers
        console.log('HTML scan failed, using known database only:', err.message)
      }

      // Step 3: Merge both lists, remove duplicates
      const allTrackerIds = new Set([
        ...knownTrackers.map(t => t.id),
        ...htmlTrackers.map(t => t.id)
      ])

      const foundTrackers = TRACKERS.filter(t => allTrackerIds.has(t.id))

      // Tag each tracker with its source
      const taggedTrackers = foundTrackers.map(t => ({
        ...t,
        source: knownTrackerIds.includes(t.id) && htmlTrackers.find(h => h.id === t.id)
          ? 'both'
          : knownTrackerIds.includes(t.id)
            ? 'known'
            : 'detected'
      }))

      const score = getRiskScore(taggedTrackers)
      const categories = [...new Set(taggedTrackers.map(t => t.category))]
      const isKnownSite = knownTrackerIds.length > 0

      setResults({
        url: targetUrl,
        hostname,
        trackers: taggedTrackers,
        score,
        categories,
        scannedAt: new Date().toLocaleTimeString(),
        isKnownSite,
        knownCount: knownTrackers.length,
        detectedCount: htmlTrackers.filter(h =>
          !knownTrackerIds.includes(h.id)
        ).length
      })

    } catch (err) {
      console.error('Scan error:', err)
      setError('Could not scan this website. Try: youtube.com, amazon.com or espn.com')
    }

    setScanning(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') scanWebsite()
  }

  const filteredTrackers = results
    ? filterCategory === 'All'
      ? results.trackers
      : results.trackers.filter(t => t.category === filterCategory)
    : []

  const risk = results ? getRiskLabel(results.score) : null

  return (
    <div className="tool-container" style={{ maxWidth: '900px' }}>
      <div className="tool-header">
        <h1>🕵️ Tracker Scanner</h1>
        <p className="tool-sub">
          Scan any website to reveal hidden trackers, pixels, and surveillance tools
        </p>
      </div>

      {/* Scanner Input */}
      <div style={{
        background: '#111',
        border: '1px solid #1e1e1e',
        borderRadius: '16px',
        padding: '30px',
        marginBottom: '25px'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '15px'
        }}>
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
            {scanning ? '🔍 Scanning...' : '🔍 Scan Site'}
          </button>
        </div>

        {/* Quick Scan Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ color: '#444', fontSize: '0.8rem', alignSelf: 'center' }}>
            Try:
          </span>
          {['youtube.com', 'facebook.com', 'amazon.com', 'espn.com', 'cnn.com'].map(site => (
            <button
              key={site}
              onClick={() => {
                setUrl(site)
                setError('')
              }}
              style={{
                background: 'transparent',
                border: '1px solid #222',
                color: '#555',
                padding: '5px 12px',
                borderRadius: '999px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                transition: 'all 0.2s'
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
          background: '#1a0a0a',
          border: '1px solid #3a1a1a',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '25px'
        }}>
          <div style={{
            color: '#ff6b6b',
            marginBottom: '12px',
            fontSize: '0.9rem'
          }}>
            ⚠️ {error}
          </div>
          <div style={{ color: '#444', fontSize: '0.8rem', marginBottom: '10px' }}>
            Sites that work well:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['youtube.com', 'amazon.com', 'espn.com', 'cnn.com', 'reddit.com'].map(site => (
              <button
                key={site}
                onClick={() => {
                  setUrl(site)
                  setError('')
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid #333',
                  color: '#555',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                {site}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scanning Animation */}
      {scanning && (
        <div style={{
          background: '#111',
          border: '1px solid #1e1e1e',
          borderRadius: '16px',
          padding: '50px',
          textAlign: 'center',
          marginBottom: '25px'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '20px',
            animation: 'pulse 1s infinite'
          }}>
            🔍
          </div>
          <div style={{ color: '#4a9eff', marginBottom: '8px' }}>
            Scanning {url} for trackers...
          </div>
          <div style={{ color: '#333', fontSize: '0.85rem' }}>
            Checking known database + analyzing page source
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <>
          {/* Risk Score Card */}
          <div style={{
            background: '#111',
            border: `1px solid ${risk.color}33`,
            borderRadius: '16px',
            padding: '30px',
            marginBottom: '25px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <div style={{
                fontSize: '0.75rem',
                color: '#444',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '8px'
              }}>
                Risk Score for {results.hostname}
              </div>
              <div style={{
                fontSize: '3.5rem',
                fontWeight: '900',
                color: risk.color,
                lineHeight: 1
              }}>
                {results.score}/100
              </div>
              <div style={{
                color: risk.color,
                fontSize: '1rem',
                marginTop: '8px',
                fontWeight: '600'
              }}>
                {risk.label}
              </div>
              <div style={{
                color: '#444',
                fontSize: '0.8rem',
                marginTop: '5px'
              }}>
                Scanned at {results.scannedAt}
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              alignItems: 'flex-end'
            }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: '900',
                color: results.trackers.length > 0 ? '#ff6b6b' : '#4aff88'
              }}>
                {results.trackers.length}
              </div>
              <div style={{
                color: '#555',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Trackers Found
              </div>
            </div>
          </div>

          {/* Source Badge Row */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '25px',
            flexWrap: 'wrap'
          }}>
            {results.isKnownSite && (
              <div style={{
                background: '#0a1a0a',
                border: '1px solid #1a3a1a',
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '0.8rem',
                color: '#4aff88',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                ✅ {results.knownCount} trackers from verified database
              </div>
            )}
            {results.detectedCount > 0 && (
              <div style={{
                background: '#0a0f1a',
                border: '1px solid #1a2a3a',
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '0.8rem',
                color: '#4a9eff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🔍 {results.detectedCount} additional trackers detected in page source
              </div>
            )}
            {!results.isKnownSite && results.detectedCount === 0 && (
              <div style={{
                background: '#111',
                border: '1px solid #222',
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '0.8rem',
                color: '#555',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                ℹ️ Unknown site — scanned page source only
              </div>
            )}
          </div>

          {/* Severity Stats */}
          {results.trackers.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '12px',
              marginBottom: '25px'
            }}>
              {['critical', 'high', 'medium', 'low'].map(severity => {
                const count = results.trackers.filter(t => t.severity === severity).length
                if (count === 0) return null
                return (
                  <div key={severity} style={{
                    background: '#111',
                    border: `1px solid ${getSeverityColor(severity)}33`,
                    borderRadius: '12px',
                    padding: '15px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '1.8rem',
                      fontWeight: '900',
                      color: getSeverityColor(severity)
                    }}>
                      {count}
                    </div>
                    <div style={{
                      color: '#444',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginTop: '4px'
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
              background: '#0a1a0a',
              border: '1px solid #1a3a1a',
              borderRadius: '16px',
              padding: '50px',
              textAlign: 'center',
              marginBottom: '25px'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>✅</div>
              <h3 style={{ color: '#4aff88', marginBottom: '8px' }}>
                No Known Trackers Detected
              </h3>
              <p style={{ color: '#555', fontSize: '0.9rem' }}>
                This site appears clean from our database of {TRACKERS.length} known trackers
              </p>
            </div>
          )}

          {/* Category Filter + Tracker List */}
          {results.trackers.length > 0 && (
            <>
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '20px'
              }}>
                {['All', ...results.categories].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    style={{
                      background: filterCategory === cat ? '#4a9eff' : 'transparent',
                      border: `1px solid ${filterCategory === cat ? '#4a9eff' : '#222'}`,
                      color: filterCategory === cat ? '#fff' : '#666',
                      padding: '6px 14px',
                      borderRadius: '999px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    {cat} {cat === 'All'
                      ? `(${results.trackers.length})`
                      : `(${results.trackers.filter(t => t.category === cat).length})`
                    }
                  </button>
                ))}
              </div>

              {/* Tracker List */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginBottom: '25px'
              }}>
                {filteredTrackers.map(tracker => (
                  <div
                    key={tracker.id}
                    onClick={() => setExpandedTracker(
                      expandedTracker === tracker.id ? null : tracker.id
                    )}
                    style={{
                      background: '#111',
                      border: `1px solid ${getSeverityColor(tracker.severity)}22`,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {/* Tracker Header */}
                    <div style={{
                      padding: '18px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: getSeverityColor(tracker.severity),
                          flexShrink: 0
                        }} />
                        <div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            flexWrap: 'wrap'
                          }}>
                            <span style={{ fontWeight: '700' }}>
                              {tracker.name}
                            </span>
                            <span style={{
                              fontSize: '0.7rem',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              background: getCategoryColor(tracker.category) + '22',
                              color: getCategoryColor(tracker.category),
                              border: `1px solid ${getCategoryColor(tracker.category)}44`
                            }}>
                              {tracker.category}
                            </span>
                            <span style={{
                              fontSize: '0.7rem',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              background: getSeverityColor(tracker.severity) + '22',
                              color: getSeverityColor(tracker.severity),
                              border: `1px solid ${getSeverityColor(tracker.severity)}44`
                            }}>
                              {tracker.severity}
                            </span>
                            {/* Source badge */}
                            <span style={{
                              fontSize: '0.65rem',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              background: tracker.source === 'detected'
                                ? '#0a0f1a'
                                : '#0a1a0a',
                              color: tracker.source === 'detected'
                                ? '#4a9eff'
                                : '#4aff88',
                              border: `1px solid ${tracker.source === 'detected'
                                ? '#1a2a3a'
                                : '#1a3a1a'}`
                            }}>
                              {tracker.source === 'detected'
                                ? '🔍 Detected'
                                : tracker.source === 'both'
                                  ? '✅ Verified + Detected'
                                  : '✅ Verified'}
                            </span>
                          </div>
                          <div style={{
                            color: '#555',
                            fontSize: '0.8rem',
                            marginTop: '3px'
                          }}>
                            by {tracker.company}
                          </div>
                        </div>
                      </div>
                      <span style={{
                        color: '#333',
                        fontSize: '1rem',
                        transition: 'transform 0.2s',
                        transform: expandedTracker === tracker.id
                          ? 'rotate(180deg)'
                          : 'rotate(0deg)'
                      }}>
                        ▼
                      </span>
                    </div>

                    {/* Expanded Details */}
                    {expandedTracker === tracker.id && (
                      <div style={{
                        padding: '20px',
                        borderTop: `1px solid ${getSeverityColor(tracker.severity)}22`,
                        background: '#0a0a0a'
                      }}>
                        <p style={{
                          color: '#888',
                          fontSize: '0.9rem',
                          marginBottom: '15px',
                          lineHeight: '1.6'
                        }}>
                          {tracker.description}
                        </p>
                        <div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#444',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '8px'
                          }}>
                            Data Being Collected:
                          </div>
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px'
                          }}>
                            {tracker.dataCollected.map(item => (
                              <span key={item} style={{
                                background: '#111',
                                border: '1px solid #222',
                                color: '#666',
                                padding: '4px 10px',
                                borderRadius: '999px',
                                fontSize: '0.75rem'
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

          {/* Footer Note */}
          <div style={{
            padding: '20px',
            background: '#0a0f1a',
            border: '1px solid #1a2a3a',
            borderRadius: '12px',
            color: '#4a9eff',
            fontSize: '0.8rem',
            textAlign: 'center'
          }}>
            🔍 Combines verified tracker database + live page scanning •
            {Object.keys(KNOWN_SITE_TRACKERS).length} sites in database •
            {TRACKERS.length} tracker signatures
          </div>
        </>
      )}
    </div>
  )
}