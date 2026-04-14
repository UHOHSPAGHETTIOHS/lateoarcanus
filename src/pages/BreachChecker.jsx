import { useState } from 'react'

export default function BreachChecker() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    window.open(
      `https://haveibeenpwned.com/account/${encodeURIComponent(email)}`,
      '_blank'
    )
  }

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>Data Breach Checker</h1>
        <p className="tool-sub">
          Find out if your email has been exposed in a data breach
        </p>
      </div>

      <div className="tool-card">
        <form onSubmit={handleSubmit} className="tool-form">
          <input
            type="email"
            placeholder="Enter email to check..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
          <button type="submit" className="button">
            Check For Breaches
          </button>
        </form>

        {submitted && (
          <div style={{
            marginTop: '25px',
            padding: '20px',
            background: '#0a0f1a',
            border: '1px solid #1a2a3a',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <p style={{color: '#4a9eff', marginBottom: '8px'}}>
              ✓ Opened HaveIBeenPwned in a new tab
            </p>
            <p style={{color: '#444', fontSize: '0.85rem'}}>
              Check the new tab for your breach results
            </p>
            <button
              onClick={() => {
                setSubmitted(false)
                setEmail('')
              }}
              style={{
                marginTop: '15px',
                background: 'transparent',
                border: '1px solid #222',
                color: '#666',
                padding: '8px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Check Another Email
            </button>
          </div>
        )}
      </div>

      <div style={{
        marginTop: '25px',
        background: '#111',
        border: '1px solid #1e1e1e',
        borderRadius: '12px',
        padding: '25px'
      }}>
        <h3 style={{
          marginBottom: '15px',
          fontSize: '1rem'
        }}>
          What We Check For
        </h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {[
            { icon: '💾', text: 'Database leaks and dumps' },
            { icon: '🔑', text: 'Exposed passwords' },
            { icon: '📧', text: 'Email exposure in breaches' },
            { icon: '💳', text: 'Financial data leaks' },
            { icon: '📱', text: 'Phone number exposure' },
            { icon: '🏠', text: 'Address information leaks' },
          ].map((item) => (
            <div
              key={item.text}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#666',
                fontSize: '0.9rem'
              }}
            >
              <span>{item.icon}</span>
              <span>{item.text}</span>
              <span style={{
                marginLeft: 'auto',
                color: '#4aff88',
                fontSize: '0.75rem'
              }}>
                ✓ Active
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: '25px',
        padding: '20px',
        background: '#0a1a0a',
        border: '1px solid #1a3a1a',
        borderRadius: '12px',
        textAlign: 'center',
        color: '#4aff88',
        fontSize: '0.85rem'
      }}>
        🔐 Powered by HaveIBeenPwned — The worlds largest breach database
      </div>
    </div>
  )
}