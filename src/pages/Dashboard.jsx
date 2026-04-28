import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import BreachChecker from './BreachChecker'
import DataBrokers from './DataBrokers'
import BigTech from './BigTech'
import TrackerScanner from './TrackerScanner'
import EyeTransition from '../components/EyeTransition'
import StabTransition from '../components/StabTransition'
import CursorGlitch from '../components/CursorGlitch'
import TypewriterText from '../components/TypewriterText'
import PrivacyScore from '../components/PrivacyScore'
import PageGlitch from '../components/PageGlitch'
import Redacted from '../components/Redacted'
import NavClock from '../components/NavClock'
import MFASetup from '../components/MFASetup'
import DarkWebMonitor from '../components/DarkWebMonitor'
import SecureNote from '../components/SecureNote'
import AccountCleanup from '../components/AccountCleanup'

const TOTAL_BROKERS = 116  // ← Updated from 52 to 116

export default function Dashboard() {
  const [user, setUser]                             = useState(null)
  const [aliases, setAliases]                       = useState([])
  const [loading, setLoading]                       = useState(true)
  const [activePage, setActivePage]                 = useState('dashboard')
  const [profile, setProfile]                       = useState(null)
  const [showEyeTransition, setShowEyeTransition]   = useState(false)
  const [showStabTransition, setShowStabTransition] = useState(false)
  const [showPageGlitch, setShowPageGlitch]         = useState(false)
  const [showMFA, setShowMFA]                       = useState(false)
  const [glitchingLink, setGlitchingLink]           = useState(null)
  const [copiedId, setCopiedId]                     = useState(null)
  const [purgingId, setPurgingId]                   = useState(null)
  const [threatCount, setThreatCount]               = useState(1247)
  const [newAliasEmail, setNewAliasEmail]           = useState(null)
  const [brokersRemoved, setBrokersRemoved]         = useState(0)
  const [pendingCount, setPendingCount]             = useState(0)  // ← New state
  const [editingNoteId, setEditingNoteId]           = useState(null)
  const [noteValue, setNoteValue]                   = useState('')

  const fetchAliases = async (userId) => {
    const { data, error } = await supabase
      .from('aliases')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (!error) setAliases(data)
    setLoading(false)
  }

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    if (data) setProfile(data)
  }

  const fetchRemovalStats = async (userId) => {
    // Fetch completed removals (from broker_removals)
    const { data: completedData } = await supabase
      .from('broker_removals')
      .select('broker_id')
      .eq('user_id', userId)
    const completed = completedData?.length || 0
    setBrokersRemoved(completed)

    // Fetch pending removals (sent/delivered/opened/responded from removal_attempts)
    const { data: pendingData } = await supabase
      .from('removal_attempts')
      .select('broker_id')
      .eq('user_id', userId)
      .in('status', ['sent', 'delivered', 'opened', 'responded'])
    
    // Get unique broker IDs for pending
    const uniquePending = new Set(pendingData?.map(a => a.broker_id) || [])
    // Don't count pending if already completed
    const pendingBrokers = [...uniquePending].filter(id => 
      !completedData?.some(c => c.broker_id === id)
    ).length
    setPendingCount(pendingBrokers)
  }

  const refreshProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('profiles')
     .select('*')
      .eq('id', user.id)
      .maybeSingle()
    if (data) setProfile(data)
    await fetchRemovalStats(user.id)
  }

  const generateAlias = async () => {
    const random = Math.random().toString(36).substring(2, 10)
    const alias  = `hidden.${random}@redactxd.com`
    const { error } = await supabase
      .from('aliases')
      .insert({ user_id: user.id, alias, active: true })
    if (error) {
      alert('Error: ' + JSON.stringify(error))
      return
    }
    setNewAliasEmail(alias)
    await fetchAliases(user.id)
    setTimeout(() => setNewAliasEmail(null), 4000)
  }

  const deleteAlias = async (id) => {
    setPurgingId(id)
    await new Promise(r => setTimeout(r, 900))
    const { error } = await supabase
      .from('aliases')
      .delete()
      .eq('id', id)
    if (!error) setAliases(aliases.filter(a => a.id !== id))
    setPurgingId(null)
  }

  const copyAlias = (alias, id) => {
    navigator.clipboard.writeText(alias)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const startEditNote = (alias) => {
    setEditingNoteId(alias.id)
    setNoteValue(alias.notes || '')
  }

  const saveNote = async (id) => {
    await supabase
      .from('aliases')
      .update({ notes: noteValue })
      .eq('id', id)
    setAliases(aliases.map(a => a.id === id ? { ...a, notes: noteValue } : a))
    setEditingNoteId(null)
    setNoteValue('')
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const navigateTo = (page) => {
    setGlitchingLink(page)
    setTimeout(() => setGlitchingLink(null), 400)
    if (page === activePage) return

    if (page === 'brokers') {
      setActivePage('brokers')
      setShowEyeTransition(true)
    } else if (page === 'dashboard') {
      setActivePage('dashboard')
      setShowStabTransition(true)
    } else {
      setActivePage(page)
      setShowPageGlitch(true)
    }
  }

  const handleStabComplete       = () => setShowStabTransition(false)
  const handleEyeComplete        = () => setShowEyeTransition(false)
  const handlePageGlitchComplete = () => setShowPageGlitch(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        fetchAliases(data.user.id)
        fetchProfile(data.user.id)
        fetchRemovalStats(data.user.id)
      }
    })
    const interval = setInterval(() => {
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) fetchProfile(data.user.id)
      })
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setThreatCount(n => n + Math.floor(Math.random() * 3))
    }, 2800)
    return () => clearInterval(t)
  }, [])

  if (loading) return (
    <div className="auth-container">
      <p style={{ color: '#888' }}>Loading...</p>
    </div>
  )

  return (
    <div className="dashboard">
      <CursorGlitch />

      {showMFA && <MFASetup onClose={() => setShowMFA(false)} />}

      <nav className="dash-nav">
        <div className="logo">redactxd</div>
        <div className="nav-center">
          {[
            { id: 'dashboard', label: 'Aliases'         },
            { id: 'breach',    label: 'Breach Checker'  },
            { id: 'brokers',   label: 'Data Brokers'    },
            { id: 'bigtech',   label: 'Big Tech'        },
            { id: 'tracker',   label: 'Tracker Scanner' },
             { id: 'secure', label: 'Secure Notes' },
             { id: 'cleanup', label: 'Cleanup' },
          ].map(link => (
            <span
              key={link.id}
              className={`nav-link ${activePage === link.id ? 'active' : ''} ${glitchingLink === link.id ? 'glitch' : ''}`}
              data-text={link.label}
              onClick={() => navigateTo(link.id)}
            >
              {link.label}
            </span>
          ))}
        </div>
        <div className="nav-right">
          <NavClock />
          <span style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.75rem',
            color: '#fff',
            border: '1px solid #222',
            padding: '4px 10px',
            letterSpacing: '1px',
          }}>
            {threatCount.toLocaleString()} THREATS BLOCKED
          </span>
          <span className="user-email">{user?.email}</span>
          <button
            onClick={() => setShowMFA(true)}
            style={{
              background: 'transparent',
              border: '1px solid #222',
              color: '#444',
              padding: '7px 14px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: '1px',
              borderRadius: 0,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.target.style.borderColor = '#fff'; e.target.style.color = '#fff' }}
            onMouseLeave={e => { e.target.style.borderColor = '#222'; e.target.style.color = '#444' }}
          >
            2FA
          </button>
          <button className="sign-out" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </nav>

      {activePage === 'breach' ? (
        <BreachChecker />
      ) : activePage === 'brokers' ? (
        <DataBrokers onRemovalSent={refreshProfile} />
      ) : activePage === 'bigtech' ? (
        <BigTech />
      ) : activePage === 'tracker' ? (
        <TrackerScanner />
        ) : activePage === 'secure' ? (
  <SecureNote />
  ) : activePage === 'cleanup' ? (
  <AccountCleanup />
      ) : (
        <div className="dash-container">
          <div className="dash-header">
            <div>
              <TypewriterText
                text="Your Hidden Identities"
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '2rem',
                  marginBottom: '8px',
                  display: 'block',
                }}
              />
              <p className="dash-sub">
                Each alias forwards to your{' '}
                <Redacted>real email</Redacted>
                {' '}— sites never see <Redacted>who you really are</Redacted>
              </p>
            </div>
            <button className="button" onClick={generateAlias}>
              + New Alias
            </button>
          </div>

          <PrivacyScore
            aliasCount={aliases.length}
            brokersRemoved={brokersRemoved}
            totalBrokers={TOTAL_BROKERS}
            pendingCount={pendingCount}
          />

          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-number">{aliases.length}</div>
              <div className="stat-label">Active Aliases</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{brokersRemoved}</div>
              <div className="stat-label">Brokers Removed</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{pendingCount}</div>
              <div className="stat-label">Pending Opt-Outs</div>
            </div>
            <div className="stat-box" style={{
              border: '1px solid #333',
              background: '#0a0a0a'
            }}>
              <div className="stat-number">
                {profile?.next_removal_date
                  ? Math.ceil(
                      (new Date(profile.next_removal_date) - new Date()) /
                      (1000 * 60 * 60 * 24)
                    )
                  : '—'
                }
              </div>
              <div className="stat-label">
                {profile?.next_removal_date
                  ? 'Days Until Auto Re-Removal'
                  : 'Send First Removal To Start'
                }
              </div>
              {profile?.last_removal_date && (
                <div style={{
                  fontSize: '0.65rem',
                  color: '#444',
                  marginTop: '4px',
                  fontFamily: "'Share Tech Mono', monospace"
                }}>
                  Last: {new Date(profile.last_removal_date).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          {profile?.next_removal_date && (
            <div style={{
              background: '#0a0a0a',
              border: '1px solid #222',
              padding: '20px 25px',
              marginBottom: '30px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '10px', height: '10px',
                  borderRadius: '50%',
                  background: '#fff',
                  boxShadow: '0 0 8px #fff',
                  animation: 'pulse 2s infinite'
                }} />
                <div>
                  <div style={{
                    color: '#fff', fontWeight: '700',
                    fontSize: '0.9rem', marginBottom: '3px',
                    fontFamily: "'Share Tech Mono', monospace"
                  }}>
                    Auto Protection Active
                  </div>
                  <div style={{
                    color: '#444', fontSize: '0.8rem',
                    fontFamily: "'Share Tech Mono', monospace"
                  }}>
                    Your data is automatically removed every 30 days
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  color: '#fff', fontSize: '0.85rem',
                  marginBottom: '3px',
                  fontFamily: "'Share Tech Mono', monospace"
                }}>
                  Next removal: {new Date(profile.next_removal_date).toLocaleDateString()}
                </div>
                <div style={{
                  color: '#444', fontSize: '0.75rem',
                  fontFamily: "'Share Tech Mono', monospace"
                }}>
                  Last removal: {new Date(profile.last_removal_date).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}

          {aliases.length === 0 ? (
            <div className="empty-state">
              <h3>No aliases yet</h3>
              <p>Create your first hidden email identity above</p>
            </div>
          ) : (
            <div className="aliases-list">
              {aliases.map((a) => (
                <div
                  key={a.id}
                  className="alias-card"
                  style={{
                    opacity: purgingId === a.id ? 0.4 : 1,
                    transition: 'opacity 0.3s ease',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    gap: '10px',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div
                      className="alias-info"
                      onClick={() => copyAlias(a.alias, a.id)}
                      style={{ cursor: 'pointer', flex: 1 }}
                      title="Click to copy"
                    >
                      <div className="alias-email">
                        {copiedId === a.id ? (
                          <span style={{
                            color: '#fff',
                            letterSpacing: '2px',
                            fontSize: '0.8rem',
                            fontFamily: "'Share Tech Mono', monospace"
                          }}>
                            COPIED
                          </span>
                        ) : newAliasEmail === a.alias ? (
                          <TypewriterText
                            text={a.alias}
                            speed={30}
                            tag="span"
                            style={{
                              fontFamily: "'Share Tech Mono', monospace",
                              fontSize: '0.9rem'
                            }}
                          />
                        ) : (
                          a.alias
                        )}
                      </div>
                      <div className="alias-date">
                        Created {new Date(a.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="alias-actions">
                      <div className="alias-status active">Active</div>
                      <button
                        onClick={() => startEditNote(a)}
                        style={{
                          background: 'transparent',
                          border: '1px solid #222',
                          color: a.notes ? '#fff' : '#444',
                          padding: '5px 12px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontFamily: "'Share Tech Mono', monospace",
                          letterSpacing: '1px',
                          borderRadius: 0,
                          transition: 'all 0.2s',
                        }}
                      >
                        {a.notes ? 'Edit Note' : '+ Note'}
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteAlias(a.id)}
                        disabled={purgingId === a.id}
                      >
                        {purgingId === a.id ? 'PURGING...' : 'Delete'}
                      </button>
                    </div>
                  </div>

                  {a.notes && editingNoteId !== a.id && (
                    <div style={{
                      borderTop: '1px solid #111',
                      paddingTop: '8px',
                      color: '#444',
                      fontSize: '0.75rem',
                      fontFamily: "'Share Tech Mono', monospace",
                    }}>
                      _ {a.notes}
                    </div>
                  )}

                  {editingNoteId === a.id && (
                    <div style={{
                      borderTop: '1px solid #111',
                      paddingTop: '10px',
                      display: 'flex',
                      gap: '8px',
                    }}>
                      <input
                        autoFocus
                        type="text"
                        value={noteValue}
                        onChange={(e) => setNoteValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveNote(a.id)
                          if (e.key === 'Escape') setEditingNoteId(null)
                        }}
                        placeholder="e.g. Used for Amazon..."
                        style={{
                          flex: 1,
                          background: '#000',
                          border: '1px solid #333',
                          color: '#fff',
                          padding: '8px 12px',
                          fontSize: '0.8rem',
                          fontFamily: "'Share Tech Mono', monospace",
                          outline: 'none',
                          borderRadius: 0,
                        }}
                      />
                      <button
                        onClick={() => saveNote(a.id)}
                        style={{
                          background: '#fff',
                          border: 'none',
                          color: '#000',
                          padding: '8px 14px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontFamily: "'Share Tech Mono', monospace",
                          letterSpacing: '1px',
                          borderRadius: 0,
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingNoteId(null)}
                        style={{
                          background: 'transparent',
                          border: '1px solid #222',
                          color: '#444',
                          padding: '8px 14px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontFamily: "'Share Tech Mono', monospace",
                          letterSpacing: '1px',
                          borderRadius: 0,
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showEyeTransition && (
        <EyeTransition onComplete={handleEyeComplete} />
      )}
      {showStabTransition && (
        <StabTransition onComplete={handleStabComplete} />
      )}
      {showPageGlitch && (
        <PageGlitch onComplete={handlePageGlitchComplete} />
      )}
    </div>
  )
}