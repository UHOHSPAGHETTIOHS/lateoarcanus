import { useState, useEffect } from 'react'
import { supabase } from '../supabase'



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

  const sendRemovalEmails = async () => {
    if (!profile.full_name || !profile.email) {
      alert('Please fill in your name and email first')
      return
    }

    setLoading(true)
    setResults(null)

    try {
      await saveProfile()

      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-optout-emails`,
        {
          method: 'POST',
          headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${session.access_token}`,
  'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
},
          body: JSON.stringify({ profile })
        }
      )

      const data = await response.json()
      setResults(data)
    } catch (err) {
      alert('Something went wrong: ' + err.message)
    }

    setLoading(false)
  }

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
        <h2 style={{marginBottom: '8px'}}>
          🤖 Automated Removal
        </h2>
        <p style={{color: '#555', fontSize: '0.9rem'}}>
          We automatically send opt-out emails to data brokers
          that accept email removal requests
        </p>
      </div>

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

      <div style={{
        background: '#0a0f1a',
        border: '1px solid #1a2a3a',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{
          fontSize: '0.85rem',
          color: '#4a9eff',
          marginBottom: '12px'
        }}>
          Will automatically email:
        </h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          {[
            'Acxiom',
            'Epsilon',
            'Oracle Data Cloud',
            'LexisNexis',
            'CoreLogic'
          ].map(broker => (
            <span
              key={broker}
              style={{
                background: '#111',
                border: '1px solid #1a2a3a',
                color: '#4a9eff',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '0.8rem'
              }}
            >
              {broker}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={sendRemovalEmails}
        className="button"
        disabled={loading}
        style={{width: '100%'}}
      >
        {loading
          ? '📧 Sending Removal Requests...'
          : '🤖 Auto-Remove My Data'}
      </button>

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
            <div style={{
              color: '#4aff88',
              fontSize: '0.9rem'
            }}>
              Removal requests sent successfully
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
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
                <span style={{fontSize: '0.9rem'}}>
                  {result.broker}
                </span>
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