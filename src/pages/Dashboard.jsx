import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import BreachChecker from './BreachChecker'
import DataBrokers from './DataBrokers'
import BigTech from './BigTech'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [aliases, setAliases] = useState([])
  const [loading, setLoading] = useState(true)
  const [activePage, setActivePage] = useState('dashboard')

  const fetchAliases = async (userId) => {
    const { data, error } = await supabase
      .from('aliases')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!error) setAliases(data)
    setLoading(false)
  }

  const generateAlias = async () => {
    const random = Math.random().toString(36).substring(2, 10)
    const alias = `hidden.${random}@lateoarcanus.com`

    const { error } = await supabase
      .from('aliases')
      .insert({
        user_id: user.id,
        alias: alias,
        active: true
      })

    if (error) {
      alert('Error: ' + JSON.stringify(error))
      return
    }

    fetchAliases(user.id)
  }

  const deleteAlias = async (id) => {
    const { error } = await supabase
      .from('aliases')
      .delete()
      .eq('id', id)

    if (!error) {
      setAliases(aliases.filter(a => a.id !== id))
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        fetchAliases(data.user.id)
      }
    })
  }, [])

  if (loading) return (
    <div className="auth-container">
      <p style={{color: '#888'}}>Loading...</p>
    </div>
  )

  return (
    <div className="dashboard">
      <nav className="dash-nav">
        <div className="logo">LATEOARCANUS</div>
        <div className="nav-center">
          <span
            className={`nav-link ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActivePage('dashboard')}
          >
            Aliases
          </span>
          <span
            className={`nav-link ${activePage === 'breach' ? 'active' : ''}`}
            onClick={() => setActivePage('breach')}
          >
            Breach Checker
          </span>
          <span
            className={`nav-link ${activePage === 'brokers' ? 'active' : ''}`}
            onClick={() => setActivePage('brokers')}
          >
            Data Brokers
          </span>
          <span
            className={`nav-link ${activePage === 'bigtech' ? 'active' : ''}`}
            onClick={() => setActivePage('bigtech')}
          >
            Big Tech
          </span>
        </div>
        <div className="nav-right">
          <span className="user-email">{user?.email}</span>
          <button className="sign-out" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </nav>

      {activePage === 'breach' ? (
        <BreachChecker />
      ) : activePage === 'brokers' ? (
        <DataBrokers />
      ) : activePage === 'bigtech' ? (
        <BigTech />
      ) : (
        <div className="dash-container">
          <div className="dash-header">
            <div>
              <h1>Your Hidden Identities</h1>
              <p className="dash-sub">
                Each alias forwards to your real email -
                sites never see who you really are
              </p>
            </div>
            <button className="button" onClick={generateAlias}>
              + New Alias
            </button>
          </div>

          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-number">{aliases.length}</div>
              <div className="stat-label">Active Aliases</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">0</div>
              <div className="stat-label">Emails Forwarded</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">0</div>
              <div className="stat-label">Trackers Blocked</div>
            </div>
          </div>

          {aliases.length === 0 ? (
            <div className="empty-state">
              <h3>No aliases yet</h3>
              <p>Create your first hidden email identity above</p>
            </div>
          ) : (
            <div className="aliases-list">
              {aliases.map((a) => (
                <div key={a.id} className="alias-card">
                  <div className="alias-info">
                    <div className="alias-email">{a.alias}</div>
                    <div className="alias-date">
                      Created {new Date(a.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="alias-actions">
                    <div className="alias-status active">Active</div>
                    <button
                      className="delete-btn"
                      onClick={() => deleteAlias(a.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}