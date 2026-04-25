// src/components/MFASetup.jsx
import { useState } from 'react'
import { supabase } from '../supabase'

export default function MFASetup({ onClose }) {
  const [phase, setPhase]             = useState('start')
  const [qrCode, setQrCode]           = useState('')
  const [secret, setSecret]           = useState('')
  const [factorId, setFactorId]       = useState('')
  const [challengeId, setChallengeId] = useState('')
  const [code, setCode]               = useState('')
  const [error, setError]             = useState('')
  const [loading, setLoading]         = useState(false)
  const [factors, setFactors]         = useState([])

  const mono = { fontFamily: "'Share Tech Mono', monospace" }

  // ── Enroll a new TOTP factor ────────────────────────────────────────────────
  const startEnrollment = async () => {
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' })
    if (error) { setError(error.message); setLoading(false); return }
    setQrCode(data.totp.qr_code)
    setSecret(data.totp.secret)
    setFactorId(data.id)
    setPhase('scan')
    setLoading(false)
  }

  // ── Create a challenge so we can verify the code ────────────────────────────
  const startChallenge = async () => {
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.mfa.challenge({ factorId })
    if (error) { setError(error.message); setLoading(false); return }
    setChallengeId(data.id)
    setPhase('verify')
    setLoading(false)
  }

  // ── Verify the TOTP code entered by the user ────────────────────────────────
  const verifyCode = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.mfa.verify({ factorId, challengeId, code })
    if (error) { setError(error.message); setLoading(false); return }
    setPhase('done')
    setLoading(false)
  }

  // ── List all existing TOTP factors ─────────────────────────────────────────
  const loadFactors = async () => {
    setLoading(true)
    const { data, error } = await supabase.auth.mfa.listFactors()
    if (error) { setError(error.message); setLoading(false); return }
    setFactors(data?.totp || [])
    setPhase('manage')
    setLoading(false)
  }

  // ── Remove a factor ─────────────────────────────────────────────────────────
  const unenroll = async (id) => {
    setLoading(true)
    const { error } = await supabase.auth.mfa.unenroll({ factorId: id })
    if (error) { setError(error.message); setLoading(false); return }
    await loadFactors()
  }

  // ── Shared overlay wrapper ──────────────────────────────────────────────────
  return (
    <div style={{
      position:        'fixed',
      inset:           0,
      background:      'rgba(0,0,0,0.95)',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      zIndex:          9000,
      padding:         '20px',
    }}>
      <div style={{
        background:  '#000',
        border:      '1px solid #333',
        padding:     '40px',
        maxWidth:    '480px',
        width:       '100%',
      }}>

        {/* ── Header ── */}
        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          marginBottom:   '25px',
        }}>
          <div style={{ color: '#fff', fontSize: '0.9rem', letterSpacing: '3px', ...mono }}>
            TWO-FACTOR AUTH
          </div>
          <span
            onClick={onClose}
            style={{ color: '#444', cursor: 'pointer', fontSize: '0.8rem', ...mono }}
          >
            [ CLOSE ]
          </span>
        </div>

        {/* ── Error ── */}
        {error && (
          <div
            className="error-box"
            style={{ marginBottom: '20px' }}
          >
            {error}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            PHASE: start
        ══════════════════════════════════════════════════════════════════════ */}
        {phase === 'start' && (
          <div>
            <p style={{
              color: '#444', fontSize: '0.85rem',
              marginBottom: '25px', lineHeight: '1.8', ...mono,
            }}>
              Add an extra layer of security to your account.
              You will need an authenticator app such as Google Authenticator or Authy.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="button"
                onClick={startEnrollment}
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? 'Loading...' : 'Enable 2FA'}
              </button>
              <button
                onClick={loadFactors}
                disabled={loading}
                style={{
                  flex:        1,
                  background:  'transparent',
                  border:      '1px solid #333',
                  color:       '#444',
                  padding:     '14px',
                  cursor:      'pointer',
                  fontSize:    '0.8rem',
                  letterSpacing: '1px',
                  borderRadius: 0,
                  ...mono,
                }}
              >
                {loading ? 'Loading...' : 'Manage Existing'}
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            PHASE: scan  (show QR + manual secret)
        ══════════════════════════════════════════════════════════════════════ */}
        {phase === 'scan' && (
          <div>
            <p style={{ color: '#444', fontSize: '0.85rem', marginBottom: '20px', ...mono }}>
              Scan this QR code with your authenticator app
            </p>

            <div style={{
              background:    '#fff',
              padding:       '16px',
              display:       'inline-block',
              marginBottom:  '20px',
            }}>
              <img
                src={qrCode}
                alt="2FA QR Code"
                style={{ width: '160px', height: '160px', display: 'block' }}
              />
            </div>

            <p style={{ color: '#333', fontSize: '0.75rem', marginBottom: '8px', ...mono }}>
              Or enter manually:
            </p>

            {/* BUG FIXED: was '0.75px', corrected to '0.75rem' */}
            <div style={{
              background:    '#111',
              border:        '1px solid #222',
              padding:       '10px 14px',
              color:         '#fff',
              fontSize:      '0.75rem',
              letterSpacing: '2px',
              marginBottom:  '20px',
              wordBreak:     'break-all',
              ...mono,
            }}>
              {secret}
            </div>

            <button
              className="button"
              onClick={startChallenge}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Next — Enter Code'}
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            PHASE: verify  (enter the 6-digit TOTP)
        ══════════════════════════════════════════════════════════════════════ */}
        {phase === 'verify' && (
          <form onSubmit={verifyCode}>
            <p style={{
              color: '#444', fontSize: '0.85rem',
              marginBottom: '20px', lineHeight: '1.8', ...mono,
            }}>
              Enter the 6-digit code from your authenticator app to confirm setup
            </p>

            <div className="field" style={{ marginBottom: '20px' }}>
              <label style={{ ...mono, color: '#444', fontSize: '0.75rem', letterSpacing: '2px' }}>
                Verification Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="input"
                maxLength={6}
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              className="button"
              disabled={loading || code.length !== 6}
            >
              {loading ? 'Verifying...' : 'Confirm and Enable 2FA'}
            </button>
          </form>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            PHASE: done
        ══════════════════════════════════════════════════════════════════════ */}
        {phase === 'done' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              color:         '#fff',
              fontSize:      '1.2rem',
              marginBottom:  '15px',
              letterSpacing: '4px',
              ...mono,
            }}>
              2FA ENABLED
            </div>
            <p style={{
              color: '#444', fontSize: '0.85rem',
              marginBottom: '25px', lineHeight: '1.8', ...mono,
            }}>
              Your account is now protected with two-factor authentication.
              You will be prompted for a code on each login.
            </p>
            <button className="button" onClick={onClose}>
              Done
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            PHASE: manage  (list + remove factors)
        ══════════════════════════════════════════════════════════════════════ */}
        {phase === 'manage' && (
          <div>
            <p style={{ color: '#444', fontSize: '0.85rem', marginBottom: '20px', ...mono }}>
              {factors.length === 0
                ? 'No 2FA factors enrolled.'
                : `${factors.length} factor${factors.length > 1 ? 's' : ''} active`}
            </p>

            {factors.map(f => (
              <div key={f.id} style={{
                border:         '1px solid #1a1a1a',
                padding:        '15px',
                display:        'flex',
                justifyContent: 'space-between',
                alignItems:     'center',
                marginBottom:   '8px',
              }}>
                <div>
                  <div style={{ color: '#fff', fontSize: '0.85rem', ...mono }}>
                    {f.friendly_name || 'Authenticator App'}
                  </div>
                  <div style={{ color: '#444', fontSize: '0.7rem', marginTop: '4px', ...mono }}>
                    Status: {f.status} &nbsp;|&nbsp; Added {new Date(f.created_at).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => unenroll(f.id)}
                  disabled={loading}
                  style={{
                    background:    'transparent',
                    border:        '1px solid #333',
                    color:         '#fff',
                    padding:       '6px 12px',
                    cursor:        'pointer',
                    fontSize:      '0.75rem',
                    borderRadius:  0,
                    ...mono,
                  }}
                >
                  {loading ? '...' : 'Remove'}
                </button>
              </div>
            ))}

            <button
              className="button"
              onClick={startEnrollment}
              disabled={loading}
              style={{ marginTop: '15px' }}
            >
              {loading ? 'Loading...' : 'Add New Factor'}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}