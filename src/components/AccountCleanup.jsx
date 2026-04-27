import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import TypewriterText from './TypewriterText'

const MONO = { fontFamily: "'Share Tech Mono', monospace" }

export default function AccountCleanup() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [filter, setFilter] = useState('pending') // pending, keep, auto_delete, deleted
  const [showGmailAuth, setShowGmailAuth] = useState(false)

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('discovered_accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) setAccounts(data)
    setLoading(false)
  }

  const startEmailScan = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gmail-auth-start`,
    {
      headers: { 'Authorization': `Bearer ${session.access_token}` }
    }
  )
  
  const { url } = await response.json()
  window.location.href = url  // Redirect to Google
}

useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  if (params.get('scan') === 'start') {
    // Clear the URL parameter and start scanning
    window.history.replaceState({}, '', '/cleanup')
    performEmailScan()  // Call your email scanning function
  }
}, [])

  const updateAccountStatus = async (accountId, newStatus) => {
    const { error } = await supabase
      .from('discovered_accounts')
      .update({ status: newStatus })
      .eq('id', accountId)

    if (!error) {
      setAccounts(accounts.map(a => 
        a.id === accountId ? { ...a, status: newStatus } : a
      ))
    }
  }

  const queueForDeletion = async (accountId) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Add to deletion queue
    const { error } = await supabase
      .from('deletion_queue')
      .insert({
        user_id: user.id,
        account_id: accountId,
        status: 'queued',
        scheduled_for: new Date()
      })

    if (!error) {
      await updateAccountStatus(accountId, 'auto_delete')
    }
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'keep': return <span style={{ color: '#44ff44' }}>[ KEEP ]</span>
      case 'auto_delete': return <span style={{ color: '#ff4444' }}>[ DELETE ]</span>
      case 'deleted': return <span style={{ color: '#444' }}>[ DELETED ]</span>
      case 'pending': return <span style={{ color: '#ffaa44' }}>[ REVIEW ]</span>
      default: return <span style={{ color: '#666' }}>[ UNKNOWN ]</span>
    }
  }

  const pendingCount = accounts.filter(a => a.status === 'pending').length
  const keepCount = accounts.filter(a => a.status === 'keep').length
  const deleteCount = accounts.filter(a => a.status === 'auto_delete').length
  const deletedCount = accounts.filter(a => a.status === 'deleted').length

  const filteredAccounts = accounts.filter(a => {
    if (filter === 'all') return true
    return a.status === filter
  })

  if (loading) return <div style={{ color: '#444', ...MONO, textAlign: 'center', padding: '40px' }}>LOADING...</div>

  return (
    <div className="tool-container">
      <div className="tool-header">
        <TypewriterText text="ACCOUNT CLEANUP" style={MONO} />
        <p className="tool-sub">
          Find and delete old accounts you no longer use
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px',
        marginBottom: '25px'
      }}>
        <div style={{ background: '#050505', border: '1px solid #1a1a1a', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', ...MONO }}>{accounts.length}</div>
          <div style={{ color: '#444', fontSize: '0.7rem', ...MONO }}>TOTAL FOUND</div>
        </div>
        <div style={{ background: '#050505', border: '1px solid #1a1a1a', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#44ff44', ...MONO }}>{keepCount}</div>
          <div style={{ color: '#444', fontSize: '0.7rem', ...MONO }}>TO KEEP</div>
        </div>
        <div style={{ background: '#050505', border: '1px solid #1a1a1a', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#ffaa44', ...MONO }}>{pendingCount}</div>
          <div style={{ color: '#444', fontSize: '0.7rem', ...MONO }}>TO REVIEW</div>
        </div>
        <div style={{ background: '#050505', border: '1px solid #1a1a1a', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#ff4444', ...MONO }}>{deleteCount}</div>
          <div style={{ color: '#444', fontSize: '0.7rem', ...MONO }}>TO DELETE</div>
        </div>
      </div>

      {/* Scan Button */}
      {accounts.length === 0 && (
        <div style={{
          background: '#0a0a0a',
          border: '1px solid #1a1a1a',
          padding: '40px',
          textAlign: 'center',
          marginBottom: '25px'
        }}>
          <div style={{ color: '#444', ...MONO, marginBottom: '20px' }}>
            Scan your email to find accounts you've forgotten about
          </div>
          <button
            onClick={startEmailScan}
            disabled={scanning}
            style={{
              background: '#fff',
              border: 'none',
              color: '#000',
              padding: '12px 30px',
              fontSize: '0.8rem',
              ...MONO,
              letterSpacing: '2px',
              cursor: scanning ? 'default' : 'pointer',
              opacity: scanning ? 0.5 : 1
            }}
          >
            {scanning ? 'SCANNING...' : 'SCAN EMAIL FOR ACCOUNTS'}
          </button>
        </div>
      )}

      {/* Filters */}
      {accounts.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {['pending', 'keep', 'auto_delete', 'deleted', 'all'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? '#fff' : 'transparent',
                border: '1px solid #333',
                color: filter === f ? '#000' : '#555',
                padding: '6px 14px',
                cursor: 'pointer',
                fontSize: '0.7rem',
                ...MONO,
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}
            >
              {f.replace('_', ' ')} ({accounts.filter(a => a.status === f).length})
            </button>
          ))}
        </div>
      )}

      {/* Account List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {filteredAccounts.map(account => (
          <div
            key={account.id}
            style={{
              background: account.status === 'deleted' ? '#050505' : '#0a0a0a',
              border: '1px solid #1a1a1a',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '15px'
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '5px' }}>
                <span style={{ fontWeight: '700', ...MONO, color: '#fff' }}>
                  {account.company_name}
                </span>
                {getStatusBadge(account.status)}
              </div>
              {account.signup_date && (
                <div style={{ color: '#444', fontSize: '0.7rem', ...MONO }}>
                  First seen: {new Date(account.signup_date).toLocaleDateString()}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              {account.status === 'pending' && (
                <>
                  <button
                    onClick={() => updateAccountStatus(account.id, 'keep')}
                    style={{
                      background: 'transparent',
                      border: '1px solid #44ff44',
                      color: '#44ff44',
                      padding: '6px 14px',
                      cursor: 'pointer',
                      fontSize: '0.7rem',
                      ...MONO,
                      letterSpacing: '1px'
                    }}
                  >
                    KEEP
                  </button>
                  <button
                    onClick={() => queueForDeletion(account.id)}
                    style={{
                      background: 'transparent',
                      border: '1px solid #ff4444',
                      color: '#ff4444',
                      padding: '6px 14px',
                      cursor: 'pointer',
                      fontSize: '0.7rem',
                      ...MONO,
                      letterSpacing: '1px'
                    }}
                  >
                    DELETE
                  </button>
                </>
              )}
              {account.status === 'keep' && (
                <button
                  onClick={() => updateAccountStatus(account.id, 'pending')}
                  style={{
                    background: 'transparent',
                    border: '1px solid #333',
                    color: '#666',
                    padding: '6px 14px',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    ...MONO,
                    letterSpacing: '1px'
                  }}
                >
                  UNDO
                </button>
              )}
              {account.status === 'auto_delete' && (
                <button
                  onClick={() => updateAccountStatus(account.id, 'pending')}
                  style={{
                    background: 'transparent',
                    border: '1px solid #333',
                    color: '#ffaa44',
                    padding: '6px 14px',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    ...MONO,
                    letterSpacing: '1px'
                  }}
                >
                  CANCEL
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAccounts.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px',
          color: '#333',
          ...MONO
        }}>
          NO ACCOUNTS FOUND IN THIS CATEGORY
        </div>
      )}

      {/* Delete All Button */}
      {deleteCount > 0 && (
        <div style={{
          marginTop: '25px',
          padding: '20px',
          background: '#0a0a0a',
          border: '1px solid #ff4444',
          textAlign: 'center'
        }}>
          <div style={{ color: '#ff4444', ...MONO, marginBottom: '10px' }}>
            {deleteCount} accounts marked for deletion
          </div>
          <button
            style={{
              background: '#ff4444',
              border: 'none',
              color: '#fff',
              padding: '10px 24px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              ...MONO,
              letterSpacing: '2px',
              fontWeight: '700'
            }}
          >
            DELETE ALL {deleteCount} ACCOUNTS
          </button>
          <div style={{ color: '#444', fontSize: '0.65rem', ...MONO, marginTop: '10px' }}>
            Accounts will be queued and processed automatically
          </div>
        </div>
      )}
    </div>
  )
}