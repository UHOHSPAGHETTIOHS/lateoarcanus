import { useState } from 'react'
import { supabase } from '../supabase'
import TypewriterText from './TypewriterText'

export default function AuthorizationForm({ onComplete }) {
  const [agreed, setAgreed] = useState(false)
  const [signed, setSigned] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSign = async () => {
    if (!agreed) return
    
    setSaving(true)
    setError(null)
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        setError('Not authenticated')
        setSaving(false)
        return
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          authorization_signed: true,
          authorization_signed_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) {
        console.error('Update error:', updateError)
        setError(updateError.message)
        setSaving(false)
        return
      }

      // Verify it saved
      const { data: verify } = await supabase
        .from('profiles')
        .select('authorization_signed')
        .eq('id', user.id)
        .single()

      if (!verify?.authorization_signed) {
        setError('Save failed - check RLS policies')
        setSaving(false)
        return
      }

      setSigned(true)
      setSaving(false)
      
      if (onComplete) onComplete()
      
    } catch (err) {
      console.error('Sign error:', err)
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div style={{ 
      background: '#000', 
      border: '1px solid #333', 
      padding: '35px',
      maxWidth: '700px',
      margin: '0 auto 30px'
    }}>
      <TypewriterText 
        text="AUTHORIZATION_REQUIRED" 
        style={{ fontFamily: "'Share Tech Mono', monospace", marginBottom: '20px' }}
      />
      
      <div style={{ 
        background: '#050505', 
        border: '1px solid #1a1a1a', 
        padding: '25px',
        marginBottom: '25px',
        maxHeight: '300px',
        overflowY: 'auto'
      }}>
        <pre style={{ 
          color: '#666', 
          fontSize: '0.75rem', 
          fontFamily: "'Share Tech Mono', monospace",
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap'
        }}>
{`CONSUMER DATA PRIVACY AUTHORIZATION

I, the undersigned consumer, hereby authorize LateoArcanus 
("Authorized Agent") to act on my behalf to:

1. Submit requests to delete my personal information from data 
   brokers, people search sites, and marketing databases
2. Receive responses and follow up on pending requests
3. Submit recurring removal requests as required by law

This authorization is granted under:
- California Consumer Privacy Act (CCPA) Section 1798.140(v)
- California Privacy Rights Act (CPRA)
- General Data Protection Regulation (GDPR) Article 17

SCOPE:
- All personal information including name, address, phone, email, 
  date of birth, and associated records
- All data brokers and people search sites identified by the service
- Initial removal plus recurring re-removal every 30 days

TERM:
This authorization remains in effect until revoked in writing.

CONSUMER RIGHTS:
You may revoke this authorization at any time by contacting 
privacy@lateoarcanus.com. Revocation does not affect actions 
already taken.`}
        </pre>
      </div>

      <label style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        marginBottom: '25px',
        cursor: 'pointer'
      }}>
        <div style={{
          width: '18px',
          height: '18px',
          border: `1px solid ${agreed ? '#fff' : '#333'}`,
          background: agreed ? '#fff' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {agreed && <span style={{ color: '#000', fontSize: '12px', fontWeight: '900' }}>x</span>}
        </div>
        <input 
          type="checkbox" 
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          style={{ display: 'none' }}
        />
        <span style={{ 
          color: agreed ? '#fff' : '#555', 
          fontSize: '0.8rem',
          fontFamily: "'Share Tech Mono', monospace"
        }}>
          I AUTHORIZE LATEOARCANUS TO ACT AS MY AGENT
        </span>
      </label>

      {error && (
        <div style={{
          background: '#1a0000',
          border: '1px solid #330000',
          padding: '12px',
          marginBottom: '20px',
          color: '#ff4444',
          fontSize: '0.75rem',
          fontFamily: "'Share Tech Mono', monospace"
        }}>
          ERROR: {error}
        </div>
      )}

      <button
        onClick={handleSign}
        disabled={!agreed || saving || signed}
        style={{
          width: '100%',
          background: signed ? '#111' : 'transparent',
          border: `1px solid ${signed ? '#333' : '#555'}`,
          color: signed ? '#fff' : agreed ? '#fff' : '#333',
          padding: '15px',
          cursor: agreed && !signed ? 'pointer' : 'default',
          fontSize: '0.85rem',
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: '2px',
          transition: 'all 0.2s'
        }}
      >
        {signed ? '[ AUTHORIZATION ON FILE ]' : saving ? '[ PROCESSING... ]' : '[ DIGITALLY SIGN ]'}
      </button>

      {signed && (
        <p style={{ 
          color: '#444', 
          fontSize: '0.7rem', 
          marginTop: '15px',
          textAlign: 'center',
          fontFamily: "'Share Tech Mono', monospace"
        }}>
          AUTHORIZATION RECORDED. YOU MAY NOW INITIATE REMOVALS.
        </p>
      )}
    </div>
  )
}