import { useEffect, useState } from 'react'

export default function PrivacyScore({ aliasCount, brokersRemoved, totalBrokers, pendingCount }) {
  const [displayed, setDisplayed] = useState(0)

  const baseScore   = 20
  const aliasScore  = Math.min(30, aliasCount * 6)
  // brokersRemoved = completed removals (confirmed removed)
  // pendingCount = opt-out sent but not yet confirmed
  // Give partial credit for pending (50% of possible broker score)
  const pendingCredit = Math.min(50, Math.round((pendingCount / totalBrokers) * 25)) // Half credit for pending
  const completedCredit = Math.min(50, Math.round((brokersRemoved / totalBrokers) * 50))
  const brokerScore = Math.min(50, completedCredit + pendingCredit)
  const total       = Math.min(100, baseScore + aliasScore + brokerScore)

  const getLabel = (s) => {
    if (s < 25) return 'EXPOSED'
    if (s < 50) return 'AT RISK'
    if (s < 75) return 'PROTECTED'
    return 'SECURE'
  }

  useEffect(() => {
    let current = 0
    const step = total / 60
    const interval = setInterval(() => {
      current += step
      if (current >= total) {
        setDisplayed(total)
        clearInterval(interval)
      } else {
        setDisplayed(Math.floor(current))
      }
    }, 16)
    return () => clearInterval(interval)
  }, [total])

  const mono = { fontFamily: "'Share Tech Mono', monospace" }

  return (
    <div style={{
      background: 'rgba(0,0,0,0.75)',
      border: '1px solid #222',
      padding: '25px',
      marginBottom: '30px',
    }}>
      <div style={{
        fontSize: '0.7rem',
        color: '#444',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        marginBottom: '15px',
        ...mono
      }}>
        Privacy Score
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '20px',
        marginBottom: '15px'
      }}>
        <div style={{
          fontSize: '4rem',
          fontWeight: '900',
          color: '#fff',
          lineHeight: 1,
          ...mono
        }}>
          {displayed}
        </div>
        <div style={{ marginBottom: '8px' }}>
          <div style={{
            color: '#fff',
            fontSize: '0.9rem',
            letterSpacing: '3px',
            ...mono
          }}>
            {getLabel(displayed)}
          </div>
          <div style={{ color: '#333', fontSize: '0.7rem', ...mono }}>
            out of 100
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div style={{
        background: '#111',
        height: '3px',
        marginBottom: '20px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${displayed}%`,
          background: '#fff',
          transition: 'width 0.05s linear',
          boxShadow: '0 0 8px rgba(255,255,255,0.4)',
        }}/>
      </div>

      {/* Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          { label: 'Account created',   score: baseScore,   max: 20, actual: baseScore },
          { label: 'Aliases generated', score: aliasScore,  max: 30, actual: aliasCount },
          { label: 'Brokers removed',   score: completedCredit, max: 50, actual: brokersRemoved, pending: pendingCount },
        ].map(item => (
          <div key={item.label} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{
              color: '#333',
              fontSize: '0.75rem',
              width: '170px',
              flexShrink: 0,
              ...mono
            }}>
              {item.label}
            </div>
            <div style={{
              flex: 1,
              height: '2px',
              background: '#111',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${(item.score / item.max) * 100}%`,
                background: '#555',
                transition: 'width 0.6s ease',
              }}/>
            </div>
            <div style={{
              color: '#444',
              fontSize: '0.7rem',
              width: '65px',
              textAlign: 'right',
              ...mono
            }}>
              {item.pending !== undefined ? `${item.actual} removed (+${item.pending} pending)` : `${item.actual}/${item.max}`}
            </div>
          </div>
        ))}
      </div>
      
      {/* Note about pending removals */}
      {pendingCount > 0 && (
        <div style={{
          marginTop: '15px',
          paddingTop: '10px',
          borderTop: '1px solid #1a1a1a',
          color: '#333',
          fontSize: '0.6rem',
          fontFamily: "'Share Tech Mono', monospace",
          textAlign: 'center',
          letterSpacing: '1px'
        }}>
          Pending opt-outs ({pendingCount}) are counting toward your score (50% credit)
        </div>
      )}
    </div>
  )
}