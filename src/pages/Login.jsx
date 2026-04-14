import { useState } from 'react'
import { supabase } from '../supabase'

export default function Login({ onSwitch }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-logo">LATEOARCANUS</div>
        <h2>Welcome Back</h2>
        <p className="auth-sub">Sign in to your hidden identity</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="switch-text">
          Don't have an account?{' '}
          <span className="switch-link" onClick={onSwitch}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  )
}