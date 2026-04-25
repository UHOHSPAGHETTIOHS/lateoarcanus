import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const BOOT_LINES = [
  '> LATEOARCANUS IDENTITY CREATION SYSTEM',
  '> PREPARING SECURE ENVIRONMENT...',
  '> ANONYMIZATION PROTOCOLS READY',
  '> ENTER DETAILS TO CREATE YOUR HIDDEN IDENTITY',
]

export default function Signup({ onSwitch }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)

  const [bootDone, setBootDone]         = useState(false)
  const [visibleLines, setVisibleLines] = useState([])
  const [currentLine, setCurrentLine]   = useState('')
  const [lineIndex, setLineIndex]       = useState(0)
  const [charIndex, setCharIndex]       = useState(0)

  const mono = { fontFamily: "'Share Tech Mono', monospace" }

  useEffect(() => {
    if (bootDone) return
    if (lineIndex >= BOOT_LINES.length) {
      setTimeout(() => setBootDone(true), 400)
      return
    }

    const line = BOOT_LINES[lineIndex]
    if (charIndex < line.length) {
      const t = setTimeout(() => {
        setCurrentLine(prev => prev + line[charIndex])
        setCharIndex(c => c + 1)
      }, 22)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setVisibleLines(prev => [...prev, line])
        setCurrentLine('')
        setCharIndex(0)
        setLineIndex(i => i + 1)
      }, 80)
      return () => clearTimeout(t)
    }
  }, [lineIndex, charIndex, bootDone])

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (!bootDone) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <div style={{ ...mono }}>
            <div style={{
              color: '#fff', fontSize: '1rem',
              letterSpacing: '4px', marginBottom: '25px',
            }}>
              LATEOARCANUS
            </div>
            {visibleLines.map((line, i) => (
              <div key={i} style={{
                color: '#444', fontSize: '0.8rem',
                lineHeight: '2', marginBottom: '2px',
              }}>
                {line}
              </div>
            ))}
            <div style={{ color: '#fff', fontSize: '0.8rem', lineHeight: '2' }}>
              {currentLine}
              <span style={{ animation: 'blink-cursor 0.7s step-end infinite' }}>█</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-logo">LATEOARCANUS</div>
          <h2>Check Your Email</h2>
          <p className="auth-sub">
            We sent you a confirmation link.
            Click it to activate your account.
          </p>
          <button className="button" onClick={onSwitch}>
            Back To Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-logo">LATEOARCANUS</div>
        <h2>Become Hidden</h2>
        <p className="auth-sub">Create your anonymous identity</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSignup} className="auth-form">
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="switch-text">
          Already have an account?{' '}
          <span className="switch-link" onClick={onSwitch}>Sign In</span>
        </p>
      </div>
    </div>
  )
}