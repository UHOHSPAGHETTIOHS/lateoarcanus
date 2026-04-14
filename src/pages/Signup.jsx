import { useState } from 'react'
import { supabase } from '../supabase'

export default function Signup({ onSwitch }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-logo">LATEOARCANUS</div>
          <h2>✓ Check Your Email</h2>
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
          <span className="switch-link" onClick={onSwitch}>
            Sign In
          </span>
        </p>
      </div>
    </div>
  )
}