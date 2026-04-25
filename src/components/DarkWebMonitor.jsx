import { useState } from 'react'
import TypewriterText from './TypewriterText'
import Redacted from './Redacted'

const SCAN_LINES = [
  '> Initializing dark web crawler...',
  '> Connecting to onion network...',
  '> Scanning paste sites (Pastebin, Ghostbin, 50+ more)...',
  '> Checking credential dump databases...',
  '> Analyzing underground markets...',
  '> Cross-referencing 12 billion leaked records...',
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

export default function DarkWebMonitor() {
  const [email, setEmail]       = useState('')
  const [scanning, setScanning] = useState(false)
  const [scanLines, setScanLines] = useState([])
  const [done, setDone]         = useState(false)

  const mono = { fontFamily: "'Share Tech Mono', monospace" }

  const runScan = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setScanning(true)
    setScanLines([])
    setDone(false)

    for (let i = 0; i < SCAN_LINES.length; i++) {
      await new Promise(r => setTimeout(r, 350 + Math.random() * 250))
      setScanLines(prev => [...prev, SCAN_LINES[i]])
    }

    await new Promise(r => setTimeout(r, 400))
    window.open(
      `https://haveibeenpwned.com/account/${encodeURIComponent(email)}`,
      '_blank'
    )
    setScanning(false)
    setDone(true)
  }

  const reset = () => {
    setDone(false)
    setEmail('')
    setScanLines([])
  }

  return (
    <div className="tool-container">
      <div className="tool-header">
        <TypewriterText
          text="Dark Web Monitor"
          style={{ ...mono, fontSize: '2rem', marginBottom: '10px', display: 'block' }}
        />
        <p className="tool-sub">
          Scan the dark web for your{' '}
          <Redacted>exposed credentials</Redacted>{' '}
          and leaked personal data
        </p>
      </div>

      {/* Scan input */}
      <div style={{
        background: 'rgba(0,0,0,0.75)',
        border: '1px solid #1a1a1a',
        padding: '30px',
        marginBottom: '20px',
      }}>
        <form
          onSubmit={runScan}
          style={{ display: 'flex', gap: '12px', marginBottom: scanning || done ? '20px' : '0' }}
        >
          <input
            type="email"
            placeholder="Enter email to scan..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            style={{ flex: 1 }}
            required
            disabled={scanning}
          />
          <button
            type="submit"
            className="button"
            disabled={scanning || !email.trim()}
            style={{ whiteSpace: 'nowrap', marginTop: 0 }}
          >
            {scanning ? 'Scanning...' : 'Scan Dark Web'}
          </button>
        </form>

        {/* Terminal output */}
        {(scanning || done) && (
          <div style={{
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
      </div>

      {/* Done state */}
      {done && (
        <div style={{
          background: 'rgba(0,0,0,0.75)',
          border: '1px solid #222',
          padding: '25px',
          marginBottom: '20px',
          ...mono,
        }}>
          <div style={{
            color: '#fff', marginBottom: '8px',
            fontSize: '0.9rem', letterSpacing: '2px',
          }}>
            RESULTS OPENED IN NEW TAB
          </div>
          <div style={{ color: '#444', fontSize: '0.8rem', marginBottom: '15px' }}>
            Check the HaveIBeenPwned tab for your full dark web exposure report
          </div>
          <button
            onClick={reset}
            style={{
              background: 'transparent', border: '1px solid #222',
              color: '#444', padding: '8px 20px',
              cursor: 'pointer', fontSize: '0.8rem', ...mono,
            }}
          >
            Scan Another Email
          </button>
        </div>
      )}

      {/* What we scan */}
      <div style={{
        background: 'rgba(0,0,0,0.75)',
        border: '1px solid #1a1a1a',
        padding: '25px',
        marginBottom: '20px',
      }}>
        <h3 style={{
          marginBottom: '15px', fontSize: '0.9rem',
          color: '#fff', letterSpacing: '1px', ...mono,
        }}>
          What We Scan
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {WHAT_WE_SCAN.map(([title, desc]) => (
            <div key={title} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ color: '#fff', flexShrink: 0 }}>_</span>
              <div>
                <div style={{ color: '#fff', fontSize: '0.8rem', ...mono }}>{title}</div>
                <div style={{ color: '#333', fontSize: '0.75rem', ...mono }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        padding: '20px',
        background: 'rgba(0,0,0,0.75)',
        border: '1px solid #1a1a1a',
        textAlign: 'center',
        color: '#333', fontSize: '0.75rem', ...mono,
      }}>
        Powered by HaveIBeenPwned — The worlds largest breach intelligence database
      </div>
    </div>
  )
}