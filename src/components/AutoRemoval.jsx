import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const ALL_BROKERS = [
  { id: 'acxiom', name: 'Acxiom', category: 'Data Broker' },
  { id: 'epsilon', name: 'Epsilon', category: 'Data Broker' },
  { id: 'oracle', name: 'Oracle Data Cloud', category: 'Data Broker' },
  { id: 'lexisnexis', name: 'LexisNexis', category: 'Data Broker' },
  { id: 'corelogic', name: 'CoreLogic', category: 'Data Broker' },
  { id: 'equifax', name: 'Equifax', category: 'Data Broker' },
  { id: 'experian', name: 'Experian', category: 'Data Broker' },
  { id: 'transunion', name: 'TransUnion', category: 'Data Broker' },
  { id: 'thomsonreuters', name: 'Thomson Reuters', category: 'Data Broker' },
  { id: 'verisk', name: 'Verisk', category: 'Data Broker' },
  { id: 'nielsen', name: 'Nielsen', category: 'Data Broker' },
  { id: 'comscore', name: 'comScore', category: 'Data Broker' },
  { id: 'neustar', name: 'Neustar', category: 'Data Broker' },
  { id: 'liveramp', name: 'LiveRamp', category: 'Data Broker' },
  { id: 'lotame', name: 'Lotame', category: 'Data Broker' },
  { id: 'bluekai', name: 'BlueKai', category: 'Data Broker' },
  { id: 'mediamath', name: 'MediaMath', category: 'Data Broker' },
  { id: 'quantcast', name: 'Quantcast', category: 'Data Broker' },
  { id: 'tapad', name: 'Tapad', category: 'Data Broker' },
  { id: 'iqvia', name: 'IQVIA', category: 'Data Broker' },
  { id: 'alliant', name: 'Alliant', category: 'Data Broker' },
  { id: 'cardlytics', name: 'Cardlytics', category: 'Data Broker' },
  { id: 'crossix', name: 'Crossix', category: 'Data Broker' },
  { id: 'datalogix', name: 'Datalogix', category: 'Data Broker' },
  { id: 'drawbridge', name: 'Drawbridge', category: 'Data Broker' },
  { id: 'krux', name: 'Krux Digital', category: 'Data Broker' },
  { id: 'addthis', name: 'AddThis', category: 'Data Broker' },
  { id: 'adsquare', name: 'Adsquare', category: 'Data Broker' },
  { id: 'exelate', name: 'eXelate', category: 'Data Broker' },
  { id: 'zoominfo', name: 'ZoomInfo', category: 'Data Broker' },
  { id: 'harte-hanks', name: 'Harte-Hanks', category: 'Marketing' },
  { id: 'merkle', name: 'Merkle', category: 'Marketing' },
  { id: 'conversant', name: 'Conversant', category: 'Marketing' },
  { id: 'dataxu', name: 'DataXu', category: 'Marketing' },
  { id: 'dun-bradstreet', name: 'Dun and Bradstreet', category: 'Marketing' },
  { id: 'inmarket', name: 'InMarket', category: 'Marketing' },
  { id: 'kochava', name: 'Kochava', category: 'Marketing' },
  { id: 'placed', name: 'Placed', category: 'Marketing' },
  { id: 'salesforce-dmp', name: 'Salesforce DMP', category: 'Marketing' },
  { id: 'semcasting', name: 'Semcasting', category: 'Marketing' },
  { id: 'sharethrough', name: 'Sharethrough', category: 'Marketing' },
  { id: 'stirista', name: 'Stirista', category: 'Marketing' },
  { id: 'taboola', name: 'Taboola', category: 'Marketing' },
  { id: 'throtle', name: 'Throtle', category: 'Marketing' },
  { id: 'towerdata', name: 'TowerData', category: 'Marketing' },
  { id: 'tradedesk', name: 'The Trade Desk', category: 'Marketing' },
  { id: 'truoptik', name: 'TruOptik', category: 'Marketing' },
  { id: 'twilio', name: 'Twilio Segment', category: 'Marketing' },
  { id: 'viant', name: 'Viant', category: 'Marketing' },
  { id: 'weborama', name: 'Weborama', category: 'Marketing' },
  { id: 'windfall', name: 'Windfall', category: 'Marketing' },
  { id: 'xandr', name: 'Xandr', category: 'Marketing' },
  { id: 'yodlee', name: 'Yodlee', category: 'Marketing' },
  { id: 'spokeo', name: 'Spokeo', category: 'People Search' },
  { id: 'whitepages', name: 'WhitePages', category: 'People Search' },
  { id: 'beenverified', name: 'BeenVerified', category: 'People Search' },
  { id: 'intelius', name: 'Intelius', category: 'People Search' },
  { id: 'radaris', name: 'Radaris', category: 'People Search' },
  { id: 'peoplefinder', name: 'PeopleFinder', category: 'People Search' },
  { id: 'instantcheckmate', name: 'Instant Checkmate', category: 'People Search' },
  { id: 'truthfinder', name: 'TruthFinder', category: 'People Search' },
  { id: 'familytreenow', name: 'FamilyTreeNow', category: 'People Search' },
  { id: 'peekyou', name: 'PeekYou', category: 'People Search' },
  { id: 'pipl', name: 'Pipl', category: 'People Search' },
  { id: 'mylife', name: 'MyLife', category: 'People Search' },
  { id: 'usphonebook', name: 'US Phone Book', category: 'People Search' },
  { id: 'zabasearch', name: 'ZabaSearch', category: 'People Search' },
  { id: 'peoplesmart', name: 'PeopleSmart', category: 'People Search' },
  { id: 'anywho', name: 'AnyWho', category: 'People Search' },
  { id: 'publicrecordsnow', name: 'Public Records Now', category: 'People Search' },
  { id: 'backgroundalert', name: 'Background Alert', category: 'People Search' },
  { id: 'clustrmaps', name: 'ClustrMaps', category: 'People Search' },
  { id: 'dataveria', name: 'Dataveria', category: 'People Search' },
  { id: 'dobsearch', name: 'DOBSearch', category: 'People Search' },
  { id: 'fastpeoplesearch', name: 'Fast People Search', category: 'People Search' },
  { id: 'gladiknow', name: 'Glad I Know', category: 'People Search' },
  { id: 'idtrue', name: 'IDTrue', category: 'People Search' },
  { id: 'infotracer', name: 'InfoTracer', category: 'People Search' },
  { id: 'iverify', name: 'iVerify', category: 'People Search' },
  { id: 'locateplus', name: 'LocatePlus', category: 'People Search' },
  { id: 'nuwber', name: 'Nuwber', category: 'People Search' },
  { id: 'officialusa', name: 'OfficialUSA', category: 'People Search' },
  { id: 'peoplefindfast', name: 'People Find Fast', category: 'People Search' },
  { id: 'peoplelooker', name: 'PeopleLooker', category: 'People Search' },
  { id: 'persopo', name: 'Persopo', category: 'People Search' },
  { id: 'privaterecords', name: 'Private Records', category: 'People Search' },
  { id: 'propeoplesearch', name: 'Pro People Search', category: 'People Search' },
  { id: 'quickpeopletrace', name: 'Quick People Trace', category: 'People Search' },
  { id: 'rehold', name: 'Rehold', category: 'People Search' },
  { id: 'reversephonecheck', name: 'Reverse Phone Check', category: 'People Search' },
  { id: 'searchpeoplefree', name: 'Search People Free', category: 'People Search' },
  { id: 'smartbackgroundchecks', name: 'Smart Background Checks', category: 'People Search' },
  { id: 'spyfly', name: 'SpyFly', category: 'People Search' },
  { id: 'staterecords', name: 'State Records', category: 'People Search' },
  { id: 'thatsthem', name: 'ThatsThem', category: 'People Search' },
  { id: 'truepeoplesearch', name: 'True People Search', category: 'People Search' },
  { id: 'verecor', name: 'Verecor', category: 'People Search' },
  { id: 'veripages', name: 'VeriPages', category: 'People Search' },
  { id: 'voterrecords', name: 'Voter Records', category: 'People Search' },
  { id: 'xlek', name: 'Xlek', category: 'People Search' },
  { id: 'yellowpages', name: 'Yellow Pages', category: 'People Search' },
  { id: 'google', name: 'Google', category: 'Big Tech' },
  { id: 'meta', name: 'Meta / Facebook', category: 'Big Tech' },
  { id: 'amazon', name: 'Amazon', category: 'Big Tech' },
  { id: 'microsoft', name: 'Microsoft', category: 'Big Tech' },
  { id: 'apple', name: 'Apple', category: 'Big Tech' },
  { id: 'twitter', name: 'Twitter / X', category: 'Big Tech' },
  { id: 'tiktok', name: 'TikTok', category: 'Big Tech' },
  { id: 'spotify', name: 'Spotify', category: 'Big Tech' },
  { id: 'linkedin', name: 'LinkedIn', category: 'Big Tech' },
  { id: 'snapchat', name: 'Snapchat', category: 'Big Tech' },
  { id: 'netflix', name: 'Netflix', category: 'Big Tech' },
  { id: 'uber', name: 'Uber', category: 'Big Tech' },
  { id: 'airbnb', name: 'Airbnb', category: 'Big Tech' },
  { id: 'pinterest', name: 'Pinterest', category: 'Big Tech' },
  { id: 'reddit', name: 'Reddit', category: 'Big Tech' },
  { id: 'adobe', name: 'Adobe', category: 'Big Tech' },
  { id: 'samsung', name: 'Samsung', category: 'Big Tech' },
]

const CATEGORIES = ['All', 'Big Tech', 'People Search', 'Data Broker', 'Marketing']

const getCategoryColor = (category) => {
  switch(category) {
    case 'Big Tech': return '#4a9eff'
    case 'People Search': return '#ff6b6b'
    case 'Data Broker': return '#ffaa00'
    case 'Marketing': return '#4aff88'
    default: return '#888'
  }
}
export default function AutoRemoval() {
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    city: '',
    state: '',
    country: ''
  })
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [selected, setSelected] = useState(
    new Set(ALL_BROKERS.map(b => b.id))
  )
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
    if (data) {
      setProfile(data)
    } else {
      setProfile(prev => ({ ...prev, email: user.email }))
    }
    setProfileLoading(false)
  }

  const saveProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase
      .from('profiles')
      .upsert({ id: user.id, ...profile })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleBroker = (id) => {
    const newSelected = new Set(selected)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelected(newSelected)
  }

  const selectCategory = (category) => {
    setActiveCategory(category)
    if (category === 'All') {
      setSelected(new Set(ALL_BROKERS.map(b => b.id)))
    } else {
      const categoryIds = ALL_BROKERS
        .filter(b => b.category === category)
        .map(b => b.id)
      setSelected(new Set(categoryIds))
    }
  }

  const deselectAll = () => {
    setSelected(new Set())
  }

  const selectAll = () => {
    setSelected(new Set(ALL_BROKERS.map(b => b.id)))
  }

  const sendRemovalEmails = async () => {
    if (!profile.full_name || !profile.email) {
      alert('Please fill in your name and email first')
      return
    }
    if (selected.size === 0) {
      alert('Please select at least one company')
      return
    }
    setLoading(true)
    setResults(null)
    try {
      await saveProfile()
      const { data: { session } } = await supabase.auth.getSession()
      const selectedBrokers = ALL_BROKERS.filter(b => selected.has(b.id))
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
            profile,
            selectedBrokers: selectedBrokers.map(b => b.id)
          })
        }
      )
      const data = await response.json()
      setResults(data)
    } catch (err) {
      alert('Something went wrong: ' + err.message)
    }
    setLoading(false)
  }

  const filteredBrokers = activeCategory === 'All'
    ? ALL_BROKERS
    : ALL_BROKERS.filter(b => b.category === activeCategory)

  if (profileLoading) return (
    <div style={{color: '#888', textAlign: 'center', padding: '40px'}}>
      Loading...
    </div>
  )

  return (
    <div style={{
      background: '#111',
      border: '1px solid #1e1e1e',
      borderRadius: '16px',
      padding: '35px',
      marginBottom: '25px'
    }}>
      <div style={{marginBottom: '25px'}}>
        <h2 style={{marginBottom: '8px'}}>🤖 Automated Removal</h2>
        <p style={{color: '#555', fontSize: '0.9rem'}}>
          Select which companies to send opt-out requests to
        </p>
      </div>

      {/* Profile Section */}
      <div style={{
        background: '#0a0a0a',
        border: '1px solid #1e1e1e',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '20px'
      }}>
        <h3 style={{
          fontSize: '0.85rem',
          color: '#555',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '20px'
        }}>
          Your Information
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px',
          marginBottom: '15px'
        }}>
          {[
            { key: 'full_name', label: 'Full Name', placeholder: 'John Doe' },
            { key: 'email', label: 'Email', placeholder: 'you@email.com' },
            { key: 'city', label: 'City', placeholder: 'New York' },
            { key: 'state', label: 'State', placeholder: 'NY' },
            { key: 'country', label: 'Country', placeholder: 'United States' }
          ].map(field => (
            <div key={field.key}>
              <label style={{
                display: 'block',
                color: '#444',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px'
              }}>
                {field.label}
              </label>
              <input
                type="text"
                placeholder={field.placeholder}
                value={profile[field.key] || ''}
                onChange={(e) => setProfile({
                  ...profile,
                  [field.key]: e.target.value
                })}
                className="input"
                style={{width: '100%'}}
              />
            </div>
          ))}
        </div>
        <button
          onClick={saveProfile}
          style={{
            background: 'transparent',
            border: '1px solid #222',
            color: saved ? '#4aff88' : '#666',
            padding: '8px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          {saved ? '✓ Saved' : 'Save Info'}
        </button>
      </div>

      {/* Selection Controls */}
      <div style={{
        background: '#0a0a0a',
        border: '1px solid #1e1e1e',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <h3 style={{
            fontSize: '0.85rem',
            color: '#555',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Select Companies ({selected.size} selected)
          </h3>
          <div style={{display: 'flex', gap: '8px'}}>
            <button
              onClick={selectAll}
              style={{
                background: 'transparent',
                border: '1px solid #222',
                color: '#4a9eff',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Select All
            </button>
            <button
              onClick={deselectAll}
              style={{
                background: 'transparent',
                border: '1px solid #222',
                color: '#ff6b6b',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => selectCategory(cat)}
              style={{
                background: activeCategory === cat ? '#4a9eff' : 'transparent',
                border: `1px solid ${activeCategory === cat ? '#4a9eff' : '#222'}`,
                color: activeCategory === cat ? '#fff' : '#666',
                padding: '6px 14px',
                borderRadius: '999px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Broker Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '8px',
          maxHeight: '300px',
          overflowY: 'auto',
          padding: '5px'
        }}>
          {filteredBrokers.map(broker => (
            <div
              key={broker.id}
              onClick={() => toggleBroker(broker.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                background: selected.has(broker.id) ? '#0a1a0a' : '#111',
                border: `1px solid ${selected.has(broker.id)
                  ? getCategoryColor(broker.category) + '44'
                  : '#1e1e1e'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '4px',
                border: `2px solid ${selected.has(broker.id)
                  ? getCategoryColor(broker.category)
                  : '#333'}`,
                background: selected.has(broker.id)
                  ? getCategoryColor(broker.category)
                  : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.15s'
              }}>
                {selected.has(broker.id) && (
                  <span style={{
                    color: '#000',
                    fontSize: '10px',
                    fontWeight: '900'
                  }}>
                    ✓
                  </span>
                )}
              </div>
              <div>
                <div style={{
                  fontSize: '0.8rem',
                  color: selected.has(broker.id) ? '#fff' : '#666',
                  fontWeight: selected.has(broker.id) ? '600' : '400'
                }}>
                  {broker.name}
                </div>
                <div style={{
                  fontSize: '0.65rem',
                  color: getCategoryColor(broker.category),
                  opacity: 0.7
                }}>
                  {broker.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Send Button */}
      <button
        onClick={sendRemovalEmails}
        className="button"
        disabled={loading || selected.size === 0}
        style={{width: '100%', marginBottom: '15px'}}
      >
        {loading
          ? '📧 Sending Removal Requests...'
          : `🤖 Send Opt-Out To ${selected.size} Selected Companies`}
      </button>

      {/* Results */}
      {results && (
        <div style={{marginTop: '25px'}}>
          <div style={{
            background: '#0a1a0a',
            border: '1px solid #1a3a1a',
            borderRadius: '12px',
            padding: '25px',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: '900',
              color: '#4aff88',
              marginBottom: '8px'
            }}>
              {results.sent}/{results.total}
            </div>
            <div style={{color: '#4aff88', fontSize: '0.9rem'}}>
              Removal requests sent successfully
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {results.results?.map((result) => (
              <div
                key={result.broker}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: '#0a0a0a',
                  border: `1px solid ${result.success ? '#1a3a1a' : '#3a1a1a'}`,
                  borderRadius: '8px'
                }}
              >
                <div>
                  <span style={{fontSize: '0.9rem'}}>{result.broker}</span>
                  {result.type && (
                    <span style={{
                      marginLeft: '8px',
                      fontSize: '0.7rem',
                      color: '#444'
                    }}>
                      {result.type}
                    </span>
                  )}
                </div>
                <span style={{
                  color: result.success ? '#4aff88' : '#ff6b6b',
                  fontSize: '0.8rem'
                }}>
                  {result.success ? '✓ Sent' : '✗ Failed'}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '15px',
            padding: '15px',
            background: '#0a0f1a',
            border: '1px solid #1a2a3a',
            borderRadius: '8px',
            color: '#4a9eff',
            fontSize: '0.8rem',
            textAlign: 'center'
          }}>
            ℹ️ Brokers must respond within 30 days under CCPA/GDPR
          </div>
        </div>
      )}
    </div>
  )
}