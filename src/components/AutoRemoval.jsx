import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const ALL_BROKERS = [
  // Data Brokers (30)
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
  { id: 'drawbridge', name: 'Drawbridge', category: 'Data Broker' },
  { id: 'krux', name: 'Krux Digital', category: 'Data Broker' },
  { id: 'addthis', name: 'AddThis', category: 'Data Broker' },
  { id: 'adsquare', name: 'Adsquare', category: 'Data Broker' },
  { id: 'exelate', name: 'eXelate', category: 'Data Broker' },
  { id: 'zoominfo', name: 'ZoomInfo', category: 'Data Broker' },
  { id: 'yodlee', name: 'Yodlee', category: 'Data Broker' },

  // Marketing (22)
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

  // People Search (64)
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
  { id: 'fastpeoplesearch', name: 'Fast People Search', category: 'People Search' },
  { id: 'gladiknow', name: 'Glad I Know', category: 'People Search' },
  { id: 'idtrue', name: 'IDTrue', category: 'People Search' },
  { id: 'infotracer', name: 'InfoTracer', category: 'People Search' },
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
  { id: '411', name: '411.com', category: 'People Search' },
  { id: 'addresssearch', name: 'AddressSearch', category: 'People Search' },
  { id: 'advancedbackgroundchecks', name: 'Advanced Background Checks', category: 'People Search' },
  { id: 'americaphonebook', name: 'AmericaPhoneBook', category: 'People Search' },
  { id: 'archives', name: 'Archives.com', category: 'People Search' },
  { id: 'arrestfacts', name: 'ArrestFacts', category: 'People Search' },
  { id: 'backgroundcheckers', name: 'BackgroundCheckers', category: 'People Search' },
  { id: 'checkpeople', name: 'CheckPeople', category: 'People Search' },
  { id: 'clustrmaps', name: 'ClustrMaps', category: 'People Search' },
  { id: 'cocofinder', name: 'CocoFinder', category: 'People Search' },
  { id: 'cyberbackgroundchecks', name: 'Cyber Background Checks', category: 'People Search' },
  { id: 'dataveria', name: 'Dataveria', category: 'People Search' },
  { id: 'easybackgroundchecks', name: 'EasyBackgroundChecks', category: 'People Search' },
  { id: 'findpeoplesearch', name: 'FindPeopleSearch', category: 'People Search' },
  { id: 'freepeopledirectory', name: 'FreePeopleDirectory', category: 'People Search' },
  { id: 'homemetry', name: 'Homemetry', category: 'People Search' },
  { id: 'houseforyou', name: 'HouseForYou', category: 'People Search' },
  { id: 'kiwisearches', name: 'Kiwi Searches', category: 'People Search' },
  { id: 'neighborwho', name: 'NeighborWho', category: 'People Search' },
  { id: 'newenglandfacts', name: 'NewEnglandFacts', category: 'People Search' },
]

const CATEGORIES = ['All', 'People Search', 'Data Broker', 'Marketing']

export default function AutoRemoval({ onRemovalSent }) {
  const [profile, setProfile] = useState({ 
    full_name: '', 
    email: '', 
    city: '', 
    state: '', 
    country: '',
    address: '',
    zip: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [selected, setSelected] = useState(new Set(ALL_BROKERS.map(b => b.id)))
  const [activeCategory, setActiveCategory] = useState('All')
  const [authComplete, setAuthComplete] = useState(false)

  useEffect(() => { 
    fetchProfile() 
  }, [])

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setProfileLoading(false)
      return
    }
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
    
    if (data) {
      setProfile({
        full_name: data.full_name || '',
        email: data.email || user.email || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || '',
        address: data.address || '',
        zip: data.zip || '',
        phone: data.phone || ''
      })
      setAuthComplete(data.authorization_signed || false)
    } else {
      setProfile(prev => ({ ...prev, email: user.email }))
    }
    
    setProfileLoading(false)
  }

  const saveProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        full_name: profile.full_name,
        email: profile.email,
        city: profile.city,
        state: profile.state,
        country: profile.country,
        address: profile.address,
        zip: profile.zip,
        phone: profile.phone
      })
      .eq('id', user.id)

    if (error) {
      console.error('Profile update error:', error)
    }
    
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleBroker = (id) => {
    const newSelected = new Set(selected)
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id)
    setSelected(newSelected)
  }

  const selectCategory = (category) => {
    setActiveCategory(category)
    if (category === 'All') {
      setSelected(new Set(ALL_BROKERS.map(b => b.id)))
    } else {
      setSelected(new Set(ALL_BROKERS.filter(b => b.category === category).map(b => b.id)))
    }
  }

  const deselectAll = () => setSelected(new Set())
  const selectAll = () => setSelected(new Set(ALL_BROKERS.map(b => b.id)))

  const sendRemovalEmails = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      alert('Please log in first')
      return
    }

    if (!authComplete) {
      alert('Please sign the authorization form before initiating removals')
      return
    }

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
      
      if (!session) {
        alert('Session expired. Please log in again.')
        setLoading(false)
        return
      }

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
            selectedBrokers: selectedBrokers.map(b => b.id),
            user_id: user.id
          })
        }
      )
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }
      
      setResults(data)
      
      if (data.sent > 0) {
        const nextRemoval = new Date()
        nextRemoval.setDate(nextRemoval.getDate() + 30)
        
        await supabase.from('profiles').update({
          last_removal_date: new Date().toISOString(),
          next_removal_date: nextRemoval.toISOString()
        }).eq('id', user.id)
        
        if (onRemovalSent) onRemovalSent()
      }
    } catch (err) {
      console.error('Send error:', err)
      alert('Something went wrong: ' + err.message)
    }
    
    setLoading(false)
  }

  const filteredBrokers = activeCategory === 'All'
    ? ALL_BROKERS
    : ALL_BROKERS.filter(b => b.category === activeCategory)

  if (profileLoading) return (
    <div style={{ color: '#444', textAlign: 'center', padding: '40px', fontFamily: "'Share Tech Mono', monospace" }}>
      Loading...
    </div>
  )

  return (
    <div style={{ background: '#000', border: '1px solid #1a1a1a', padding: '35px', marginBottom: '25px' }}>
      <div style={{ marginBottom: '25px' }}>
        <h2 style={{ marginBottom: '8px', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '2px', color: '#fff' }}>
          Automated Removal
        </h2>
        <p style={{ color: '#444', fontSize: '0.85rem' }}>
          Select which companies to send opt-out requests to
        </p>
      </div>

      {!authComplete && (
        <div style={{ 
          background: '#050505', 
          border: '1px solid #333', 
          padding: '20px', 
          marginBottom: '20px',
          textAlign: 'center' 
        }}>
          <p style={{ color: '#666', fontSize: '0.8rem', fontFamily: "'Share Tech Mono', monospace", marginBottom: '15px' }}>
            AUTHORIZATION REQUIRED BEFORE AUTOMATED REMOVAL
          </p>
        </div>
      )}

      <div style={{ background: '#050505', border: '1px solid #1a1a1a', padding: '25px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '0.75rem', color: '#444', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px', fontFamily: "'Share Tech Mono', monospace" }}>
          Your Information
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          {[
            { key: 'full_name', label: 'Full Name', placeholder: 'John Doe' },
            { key: 'email', label: 'Email', placeholder: 'you@email.com' },
            { key: 'phone', label: 'Phone', placeholder: '(555) 123-4567' },
            { key: 'address', label: 'Street Address', placeholder: '123 Main St' },
            { key: 'city', label: 'City', placeholder: 'New York' },
            { key: 'state', label: 'State', placeholder: 'NY' },
            { key: 'zip', label: 'ZIP Code', placeholder: '10001' },
            { key: 'country', label: 'Country', placeholder: 'United States' },
          ].map(field => (
            <div key={field.key}>
              <label style={{ display: 'block', color: '#444', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', fontFamily: "'Share Tech Mono', monospace" }}>
                {field.label}
              </label>
              <input
                type="text"
                placeholder={field.placeholder}
                value={profile[field.key] || ''}
                onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                className="input"
                style={{ width: '100%' }}
              />
            </div>
          ))}
        </div>
        <button
          onClick={saveProfile}
          style={{ background: 'transparent', border: '1px solid #333', color: saved ? '#fff' : '#555', padding: '8px 20px', cursor: 'pointer', fontSize: '0.8rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px', transition: 'all 0.2s' }}
        >
          {saved ? 'Saved' : 'Save Info'}
        </button>
      </div>

      <div style={{ background: '#050505', border: '1px solid #1a1a1a', padding: '25px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ fontSize: '0.75rem', color: '#444', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: "'Share Tech Mono', monospace" }}>
            Select Companies ({selected.size} selected)
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={selectAll} style={{ background: 'transparent', border: '1px solid #333', color: '#fff', padding: '6px 14px', cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px' }}>
              Select All
            </button>
            <button onClick={deselectAll} style={{ background: 'transparent', border: '1px solid #333', color: '#555', padding: '6px 14px', cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px' }}>
              Deselect All
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => selectCategory(cat)}
              style={{ background: activeCategory === cat ? '#fff' : 'transparent', border: '1px solid #333', color: activeCategory === cat ? '#000' : '#555', padding: '6px 14px', cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '1px', transition: 'all 0.2s' }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '6px', maxHeight: '300px', overflowY: 'auto', padding: '4px' }}>
          {filteredBrokers.map(broker => (
            <div
              key={broker.id}
              onClick={() => toggleBroker(broker.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: selected.has(broker.id) ? '#111' : '#000', border: `1px solid ${selected.has(broker.id) ? '#444' : '#1a1a1a'}`, cursor: 'pointer', transition: 'all 0.15s' }}
            >
              <div style={{ width: '14px', height: '14px', border: `1px solid ${selected.has(broker.id) ? '#fff' : '#333'}`, background: selected.has(broker.id) ? '#fff' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                {selected.has(broker.id) && <span style={{ color: '#000', fontSize: '9px', fontWeight: '900' }}>x</span>}
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: selected.has(broker.id) ? '#fff' : '#555', fontFamily: "'Share Tech Mono', monospace" }}>
                  {broker.name}
                </div>
                <div style={{ fontSize: '0.6rem', color: '#333', fontFamily: "'Share Tech Mono', monospace" }}>
                  {broker.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={sendRemovalEmails}
        className="button"
        disabled={loading || selected.size === 0 || !authComplete}
        style={{ width: '100%', marginBottom: '15px', opacity: !authComplete ? 0.5 : 1 }}
      >
        {loading ? 'Sending Removal Requests...' : !authComplete ? 'Sign Authorization First' : `Send Opt-Out To ${selected.size} Companies`}
      </button>

      {results && (
        <div style={{ marginTop: '25px' }}>
          <div style={{ background: '#050505', border: '1px solid #333', padding: '25px', marginBottom: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: '900', color: '#fff', marginBottom: '8px', fontFamily: "'Share Tech Mono', monospace" }}>
              {results.sent}/{results.total}
            </div>
            <div style={{ color: '#fff', fontSize: '0.85rem', letterSpacing: '1px', fontFamily: "'Share Tech Mono', monospace" }}>
              Removal requests sent
            </div>
            {results.failed > 0 && (
              <div style={{ color: '#ff4444', fontSize: '0.75rem', marginTop: '8px', fontFamily: "'Share Tech Mono', monospace" }}>
                {results.failed} failed — manual send required below
              </div>
            )}
            {results.skipped > 0 && (
              <div style={{ color: '#444', fontSize: '0.75rem', marginTop: '8px', fontFamily: "'Share Tech Mono', monospace" }}>
                {results.skipped} skipped (recently sent)
              </div>
            )}
            <div style={{ color: '#444', fontSize: '0.8rem', marginTop: '8px', fontFamily: "'Share Tech Mono', monospace" }}>
              Auto re-removal scheduled for 30 days from now
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '400px', overflowY: 'auto' }}>
            {results.results?.map((result) => (
              <div key={result.broker} style={{ 
                display: 'flex', 
                flexDirection: 'column',
                padding: '12px 16px', 
                background: '#000', 
                border: '1px solid #1a1a1a',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', fontFamily: "'Share Tech Mono', monospace", color: '#fff' }}>
                      {result.broker}
                    </span>
                    {result.type && (
                      <span style={{ marginLeft: '8px', fontSize: '0.7rem', color: '#333', fontFamily: "'Share Tech Mono', monospace" }}>
                        {result.type}
                      </span>
                    )}
                  </div>
                  <span style={{ 
                    color: result.success ? '#fff' : result.manual_send ? '#ff4444' : '#444', 
                    fontSize: '0.75rem', 
                    fontFamily: "'Share Tech Mono', monospace", 
                    letterSpacing: '1px' 
                  }}>
                    {result.success ? 'SENT' : result.manual_send ? 'MANUAL REQUIRED' : 'FAILED'}
                  </span>
                </div>

                {result.manual_send && (
                  <div style={{ 
                    background: '#050505', 
                    border: '1px solid #222', 
                    padding: '12px',
                    marginTop: '4px'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <span style={{ color: '#666', fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace" }}>
                        COPY AND SEND MANUALLY
                      </span>
                      <button
                        onClick={() => {
                          const text = `To: ${result.manual_send.to}\nSubject: ${result.manual_send.subject}\n\n${result.manual_send.body}`
                          navigator.clipboard.writeText(text)
                        }}
                        style={{
                          background: 'transparent',
                          border: '1px solid #333',
                          color: '#888',
                          padding: '4px 10px',
                          cursor: 'pointer',
                          fontSize: '0.7rem',
                          fontFamily: "'Share Tech Mono', monospace"
                        }}
                      >
                        [ COPY ALL ]
                      </button>
                    </div>
                    <div style={{ color: '#444', fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace", marginBottom: '4px' }}>
                      To: {result.manual_send.to}
                    </div>
                    <div style={{ color: '#444', fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace", marginBottom: '4px' }}>
                      Subject: {result.manual_send.subject}
                    </div>
                    <pre style={{ 
                      color: '#555', 
                      fontSize: '0.65rem', 
                      fontFamily: "'Share Tech Mono', monospace",
                      whiteSpace: 'pre-wrap',
                      maxHeight: '100px',
                      overflowY: 'auto',
                      background: '#000',
                      padding: '8px',
                      border: '1px solid #1a1a1a'
                    }}>
                      {result.manual_send.body.substring(0, 300)}...
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '15px', padding: '15px', background: '#000', border: '1px solid #1a1a1a', color: '#444', fontSize: '0.75rem', textAlign: 'center', fontFamily: "'Share Tech Mono', monospace" }}>
            Brokers must respond within 30 days under CCPA/GDPR.
            Your data will be automatically re-removed every 30 days.
          </div>
        </div>
      )}
    </div>
  )
}