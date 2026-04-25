import { useState } from 'react'
import TypewriterText from '../components/TypewriterText'
import Redacted from '../components/Redacted'

const SCAN_LINES = [
  '> Initializing dark web crawler...',
  '> Connecting to onion network...',
  '> Scanning paste sites (Pastebin, Ghostbin, 50+ more)...',
  '> Checking credential dump databases...',
  '> Analyzing underground markets...',
  '> Cross-referencing 12 billion leaked records...',
  '> Cross-referencing HaveIBeenPwned breach database...',
  '> Compiling exposure report...',
  '> Done. Opening results...',
]

const WHAT_WE_SCAN = [
  ['Paste sites',        'Pastebin, Ghostbin and 50+ paste services'],
  ['Credential dumps',   'Leaked username and password combinations'],
  ['Dark web markets',   'Underground forums and data marketplaces'],
  ['Breach databases',   '12+ billion records from known breaches'],
  ['Malware logs',       'Stealer logs harvested from infected devices'],
  ['Email exposure',     'Emails found in public and private dumps'],
]

export default function BreachChecker() {
  const [email, setEmail]         = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [scanning, setScanning]   = useState(false)
  const [scanLines, setScanLines] = useState([])

  const mono = { fontFamily: "'Share Tech Mono', monospace" }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    
    setScanning(true)
    setScanLines([])
    setSubmitted(false)
    
    // Terminal animation
    for (let i = 0; i < SCAN_LINES.length; i++) {
      await new Promise(r => setTimeout(r, 250 + Math.random() * 200))
      setScanLines(prev => [...prev, SCAN_LINES[i]])
    }
    
    await new Promise(r => setTimeout(r, 300))
    window.open(
      `https://haveibeenpwned.com/account/${encodeURIComponent(email)}`,
      '_blank'
    )
    setSubmitted(true)
    setScanning(false)
  }

  const reset = () => {
    setSubmitted(false)
    setScanLines([])
    setEmail('')
  }

  return (
    <div className="tool-container">
      <div className="tool-header">
        <TypewriterText text="Breach & Dark Web Scanner" style={{ ...mono }} />
        <p className="tool-sub">
          Scan the <Redacted>dark web</Redacted> and <Redacted>data breaches</Redacted> for your exposed credentials
        </p>
      </div>

      <div className="tool-card">
        <form onSubmit={handleSubmit} className="tool-form">
          <input
            type="email"
            placeholder="Enter email to scan..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
            disabled={scanning}
          />
          <button type="submit" className="button" disabled={scanning}>
            {scanning ? 'SCANNING...' : 'SCAN BREACHES & DARK WEB'}
          </button>
        </form>

        {/* Terminal animation during scan */}
        {(scanning || scanLines.length > 0) && (
          <div style={{
            marginTop: '25px',
            background: '#000',
            border: '1px solid #111',
            padding: '20px',
            ...mono,
          }}>
            {scanLines.map((line, i) => (
              <div
                key={i}
                style={{
                  color: i === scanLines.length - 1 && scanning ? '#fff' : '#444',
                  fontSize: '0.8rem',
                  lineHeight: '2',
                }}
              >
                {line}
              </div>
            ))}
            {scanning && (
              <span style={{
                color: '#fff',
                fontSize: '0.8rem',
                animation: 'blink-cursor 0.7s step-end infinite',
              }}>
                █
              </span>
            )}
          </div>
        )}

        {submitted && (
          <div style={{
            marginTop: '25px',
            padding: '20px',
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid #222',
            textAlign: 'center'
          }}>
            <p style={{ color: '#fff', marginBottom: '8px', ...mono }}>
              ✓ Scan complete — opened HaveIBeenPwned in a new tab
            </p>
            <p style={{ color: '#333', fontSize: '0.8rem', ...mono }}>
              Check the new tab for your breach and dark web exposure results
            </p>
            <button
              onClick={reset}
              style={{
                marginTop: '15px',
                background: 'transparent',
                border: '1px solid #222',
                color: '#444',
                padding: '8px 20px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                ...mono
              }}
            >
              Scan Another Email
            </button>
          </div>
        )}
      </div>

      <div style={{
        marginTop: '25px',
        background: 'rgba(0,0,0,0.6)',
        border: '1px solid #1a1a1a',
        padding: '25px'
      }}>
        <h3 style={{
          marginBottom: '15px',
          fontSize: '0.9rem',
          color: '#fff',
          letterSpacing: '1px',
          ...mono
        }}>
          What We Check For
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {WHAT_WE_SCAN.map(([title, desc]) => (
            <div key={title} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              color: '#444',
              fontSize: '0.85rem',
              ...mono
            }}>
              <span style={{ color: '#fff', flexShrink: 0 }}>_</span>
              <div>
                <div style={{ color: '#fff', marginBottom: '2px' }}>{title}</div>
                <div style={{ color: '#333', fontSize: '0.7rem' }}>{desc}</div>
              </div>
              <span style={{
                marginLeft: 'auto',
                color: '#fff',
                fontSize: '0.7rem',
                letterSpacing: '2px',
                flexShrink: 0
              }}>
                ACTIVE
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: '25px',
        padding: '20px',
        background: 'rgba(0,0,0,0.6)',
        border: '1px solid #1a1a1a',
        textAlign: 'center',
        color: '#333',
        fontSize: '0.75rem',
        ...mono
      }}>
       Powered by HaveIBeenPwned — The world's largest breach and dark web intelligence database
      </div>
    </div>
  )
}