import { useState } from 'react'
import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
    }
  }

  return (
    <div className="container">
      <nav className="nav">
        <div className="logo">LATEOARCANUS</div>
        <div className="nav-tagline">The Hidden One</div>
      </nav>

      <main className="hero">
        <div className="badge">Privacy Protection Suite</div>
        <h1 className="title">
          Disappear From <span className="highlight">The Internet</span>
        </h1>
        <p className="subtitle">
          In a world where every click, email, and search is tracked, 
          monitored, and sold — become invisible. Lateoarcanus gives you 
          complete digital anonymity in one simple dashboard.
        </p>

        <div className="features">
          <div className="feature">
            <span className="feature-icon">✉️</span>
            <span>Email Masking</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🛡️</span>
            <span>Tracker Blocking</span>
          </div>
          <div className="feature">
            <span className="feature-icon">👤</span>
            <span>Identity Protection</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🔍</span>
            <span>Data Breach Alerts</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🗑️</span>
            <span>Data Broker Removal</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🔒</span>
            <span>Password Vault</span>
          </div>
        </div>

        {!submitted ? (
          <div className="waitlist">
            <h2>Join The Waitlist</h2>
            <p>Be first to become the hidden one</p>
            <form onSubmit={handleSubmit} className="form">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
              <button type="submit" className="button">
                Get Early Access
              </button>
            </form>
          </div>
        ) : (
          <div className="waitlist">
            <div className="success">
              <h2>✓ You're On The List</h2>
              <p>We'll contact you when we launch</p>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2025 Lateoarcanus · Privacy is a right, not a privilege</p>
      </footer>
    </div>
  )
}

export default App