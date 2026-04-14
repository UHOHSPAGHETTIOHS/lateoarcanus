import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import AutoRemoval from '../components/AutoRemoval'

const BROKERS = [
  {
    id: 'spokeo',
    name: 'Spokeo',
    category: 'People Search',
    dataCollected: ['Name', 'Address', 'Phone', 'Email', 'Relatives'],
    optOutUrl: 'https://www.spokeo.com/optout',
    difficulty: 'easy',
    estimatedTime: '24-48 hours',
    icon: '📋'
  },
  {
    id: 'whitepages',
    name: 'WhitePages',
    category: 'People Search',
    dataCollected: ['Name', 'Address', 'Phone', 'Age'],
    optOutUrl: 'https://www.whitepages.com/suppression-requests',
    difficulty: 'easy',
    estimatedTime: '24 hours',
    icon: '📞'
  },
  {
    id: 'beenverified',
    name: 'BeenVerified',
    category: 'Background Check',
    dataCollected: ['Name', 'Address', 'Criminal Records', 'Social Media'],
    optOutUrl: 'https://www.beenverified.com/app/optout/search',
    difficulty: 'medium',
    estimatedTime: '1-3 days',
    icon: '🔎'
  },
  {
    id: 'intelius',
    name: 'Intelius',
    category: 'Background Check',
    dataCollected: ['Name', 'Address', 'Phone', 'Criminal Records'],
    optOutUrl: 'https://www.intelius.com/opt-out',
    difficulty: 'medium',
    estimatedTime: '3-5 days',
    icon: '🔍'
  },
  {
    id: 'mylife',
    name: 'MyLife',
    category: 'Reputation',
    dataCollected: ['Name', 'Address', 'Reputation Score', 'Reviews'],
    optOutUrl: 'https://www.mylife.com/ccpa/index.pubview',
    difficulty: 'hard',
    estimatedTime: '5-7 days',
    icon: '👤'
  },
  {
    id: 'radaris',
    name: 'Radaris',
    category: 'People Search',
    dataCollected: ['Name', 'Address', 'Phone', 'Email', 'Social Media'],
    optOutUrl: 'https://radaris.com/page/how-to-remove',
    difficulty: 'medium',
    estimatedTime: '2-4 days',
    icon: '📡'
  },
  {
    id: 'peoplefinder',
    name: 'PeopleFinder',
    category: 'People Search',
    dataCollected: ['Name', 'Address', 'Phone', 'Age', 'Relatives'],
    optOutUrl: 'https://www.peoplefinders.com/opt-out',
    difficulty: 'easy',
    estimatedTime: '24-48 hours',
    icon: '🔭'
  },
  {
    id: 'instantcheckmate',
    name: 'Instant Checkmate',
    category: 'Background Check',
    dataCollected: ['Criminal Records', 'Address', 'Phone', 'Social Media'],
    optOutUrl: 'https://www.instantcheckmate.com/opt-out/',
    difficulty: 'easy',
    estimatedTime: '24-48 hours',
    icon: '✅'
  },
  {
    id: 'truthfinder',
    name: 'TruthFinder',
    category: 'Background Check',
    dataCollected: ['Criminal Records', 'Address', 'Social Media', 'Photos'],
    optOutUrl: 'https://www.truthfinder.com/opt-out/',
    difficulty: 'easy',
    estimatedTime: '24-48 hours',
    icon: '🔬'
  },
  {
    id: 'acxiom',
    name: 'Acxiom',
    category: 'Data Broker',
    dataCollected: ['Purchase History', 'Demographics', 'Financial Data'],
    optOutUrl: 'https://www.acxiom.com/optout/',
    difficulty: 'medium',
    estimatedTime: '30 days',
    icon: '🏢'
  },
  {
    id: 'epsilon',
    name: 'Epsilon',
    category: 'Data Broker',
    dataCollected: ['Purchase History', 'Email', 'Demographics'],
    optOutUrl: 'https://www.epsilon.com/us/privacy-policy/privacy-request',
    difficulty: 'medium',
    estimatedTime: '30 days',
    icon: '📊'
  },
  {
    id: 'datalogix',
    name: 'Oracle Data Cloud',
    category: 'Data Broker',
    dataCollected: ['Purchase History', 'Location', 'Demographics'],
    optOutUrl: 'https://datacloudoptout.oracle.com/optout',
    difficulty: 'medium',
    estimatedTime: '30 days',
    icon: '☁️'
  },
  {
    id: 'lexisnexis',
    name: 'LexisNexis',
    category: 'Data Broker',
    dataCollected: ['Legal Records', 'Financial', 'Address History'],
    optOutUrl: 'https://optout.lexisnexis.com/',
    difficulty: 'hard',
    estimatedTime: '30 days',
    icon: '⚖️'
  },
  {
    id: 'coredatabroker',
    name: 'CoreLogic',
    category: 'Data Broker',
    dataCollected: ['Property Records', 'Financial', 'Address History'],
    optOutUrl: 'https://www.corelogic.com/privacy-center/',
    difficulty: 'hard',
    estimatedTime: '30 days',
    icon: '🏠'
  },
  {
    id: 'familytreenow',
    name: 'FamilyTreeNow',
    category: 'People Search',
    dataCollected: ['Name', 'Address', 'Relatives', 'Age'],
    optOutUrl: 'https://www.familytreenow.com/optout',
    difficulty: 'easy',
    estimatedTime: '24 hours',
    icon: '🌳'
  },
  {
    id: 'usphonebook',
    name: 'US Phone Book',
    category: 'People Search',
    dataCollected: ['Name', 'Address', 'Phone'],
    optOutUrl: 'https://www.usphonebook.com/opt-out',
    difficulty: 'easy',
    estimatedTime: '24-48 hours',
    icon: '📱'
  },
  {
    id: 'peekyou',
    name: 'PeekYou',
    category: 'People Search',
    dataCollected: ['Name', 'Social Media', 'Email', 'Username'],
    optOutUrl: 'https://www.peekyou.com/about/contact/optout/',
    difficulty: 'easy',
    estimatedTime: '24-48 hours',
    icon: '👀'
  },
  {
    id: 'pipl',
    name: 'Pipl',
    category: 'People Search',
    dataCollected: ['Name', 'Email', 'Social Media', 'Phone'],
    optOutUrl: 'https://pipl.com/personal-information-removal-request/',
    difficulty: 'medium',
    estimatedTime: '3-5 days',
    icon: '🔮'
  },
  {
    id: 'publicrecordsnow',
    name: 'Public Records Now',
    category: 'Public Records',
    dataCollected: ['Criminal Records', 'Address', 'Phone'],
    optOutUrl: 'https://www.publicrecordsnow.com/static/view/optout',
    difficulty: 'easy',
    estimatedTime: '24-48 hours',
    icon: '📁'
  },
  {
    id: 'arrests',
    name: 'Arrests.org',
    category: 'Public Records',
    dataCollected: ['Arrest Records', 'Mugshots', 'Name'],
    optOutUrl: 'https://arrests.org/removal/',
    difficulty: 'medium',
    estimatedTime: '3-5 days',
    icon: '🚨'
  }
]

const getDifficultyColor = (difficulty) => {
  switch(difficulty) {
    case 'easy': return '#4aff88'
    case 'medium': return '#ffaa00'
    case 'hard': return '#ff6b6b'
    default: return '#888'
  }
}

const getCategoryColor = (category) => {
  switch(category) {
    case 'People Search': return '#4a9eff'
    case 'Background Check': return '#ff6b6b'
    case 'Data Broker': return '#ffaa00'
    case 'Reputation': return '#ff4aff'
    case 'Public Records': return '#4affff'
    default: return '#888'
  }
}

export default function DataBrokers() {
  const [completed, setCompleted] = useState([])
  const [filter, setFilter] = useState('all')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        fetchCompleted(data.user.id)
      }
    })
  }, [])

  const fetchCompleted = async (userId) => {
    const { data } = await supabase
      .from('broker_removals')
      .select('broker_id')
      .eq('user_id', userId)

    if (data) {
      setCompleted(data.map(d => d.broker_id))
    }
    setLoading(false)
  }

  const toggleCompleted = async (brokerId) => {
    if (!user) return

    if (completed.includes(brokerId)) {
      await supabase
        .from('broker_removals')
        .delete()
        .eq('user_id', user.id)
        .eq('broker_id', brokerId)
      setCompleted(completed.filter(id => id !== brokerId))
    } else {
      await supabase
        .from('broker_removals')
        .insert({
          user_id: user.id,
          broker_id: brokerId
        })
      setCompleted([...completed, brokerId])
    }
  }

  const categories = ['all', ...new Set(BROKERS.map(b => b.category))]

  const filteredBrokers = filter === 'all'
    ? BROKERS
    : BROKERS.filter(b => b.category === filter)

  const completionPercentage = Math.round(
    (completed.length / BROKERS.length) * 100
  )

  if (loading) return (
    <div className="auth-container">
      <p style={{color: '#888'}}>Loading...</p>
    </div>
  )

  return (
    <div className="tool-container" style={{maxWidth: '900px'}}>
      <div className="tool-header">
        <h1>Data Broker Removal</h1>
        <p className="tool-sub">
          Remove yourself from sites that sell your personal data
        </p>
      </div>

      <AutoRemoval />

      {/* Progress Section */}
      <div style={{
        background: '#111',
        border: '1px solid #1e1e1e',
        borderRadius: '16px',
        padding: '30px',
        marginBottom: '25px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div>
            <h3 style={{marginBottom: '5px'}}>Removal Progress</h3>
            <p style={{color: '#555', fontSize: '0.85rem'}}>
              {completed.length} of {BROKERS.length} brokers removed
            </p>
          </div>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            color: completionPercentage > 50 ? '#4aff88' : '#ffaa00'
          }}>
            {completionPercentage}%
          </div>
        </div>

        <div style={{
          background: '#0a0a0a',
          borderRadius: '999px',
          height: '8px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${completionPercentage}%`,
            background: completionPercentage > 50 ? '#4aff88' : '#ffaa00',
            borderRadius: '999px',
            transition: 'width 0.5s ease'
          }} />
        </div>

        <div style={{
          display: 'flex',
          gap: '20px',
          marginTop: '20px'
        }}>
          <div style={{
            flex: 1,
            background: '#0a0a0a',
            borderRadius: '8px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '800',
              color: '#4aff88',
              marginBottom: '4px'
            }}>
              {completed.length}
            </div>
            <div style={{
              color: '#444',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Removed
            </div>
          </div>
          <div style={{
            flex: 1,
            background: '#0a0a0a',
            borderRadius: '8px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '800',
              color: '#ff6b6b',
              marginBottom: '4px'
            }}>
              {BROKERS.length - completed.length}
            </div>
            <div style={{
              color: '#444',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Remaining
            </div>
          </div>
          <div style={{
            flex: 1,
            background: '#0a0a0a',
            borderRadius: '8px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '800',
              color: '#4a9eff',
              marginBottom: '4px'
            }}>
              {BROKERS.length}
            </div>
            <div style={{
              color: '#444',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Total Brokers
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              background: filter === cat ? '#4a9eff' : '#111',
              border: `1px solid ${filter === cat ? '#4a9eff' : '#222'}`,
              color: filter === cat ? '#fff' : '#666',
              padding: '8px 16px',
              borderRadius: '999px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              textTransform: 'capitalize',
              transition: 'all 0.2s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Broker Cards */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {filteredBrokers.map(broker => (
          <div
            key={broker.id}
            style={{
              background: completed.includes(broker.id) ? '#0a1a0a' : '#111',
              border: `1px solid ${completed.includes(broker.id) ? '#1a3a1a' : '#1e1e1e'}`,
              borderRadius: '12px',
              padding: '20px 25px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px',
              transition: 'all 0.2s'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              flex: 1
            }}>
              <span style={{fontSize: '1.5rem'}}>{broker.icon}</span>
              <div style={{flex: 1}}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '5px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{fontWeight: '700'}}>{broker.name}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: getCategoryColor(broker.category) + '22',
                    color: getCategoryColor(broker.category),
                    border: `1px solid ${getCategoryColor(broker.category)}44`
                  }}>
                    {broker.category}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: getDifficultyColor(broker.difficulty) + '22',
                    color: getDifficultyColor(broker.difficulty),
                    border: `1px solid ${getDifficultyColor(broker.difficulty)}44`
                  }}>
                    {broker.difficulty}
                  </span>
                </div>
                <div style={{
                  color: '#444',
                  fontSize: '0.8rem',
                  marginBottom: '5px'
                }}>
                  Collects: {broker.dataCollected.join(', ')}
                </div>
                <div style={{
                  color: '#333',
                  fontSize: '0.75rem'
                }}>
                  ⏱ Removal time: {broker.estimatedTime}
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              flexShrink: 0
            }}>
              {!completed.includes(broker.id) && (
                <a
                  href={broker.optOutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'transparent',
                    border: '1px solid #222',
                    color: '#888',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Opt Out →
                </a>
              )}
              <button
                onClick={() => toggleCompleted(broker.id)}
                style={{
                  background: completed.includes(broker.id)
                    ? '#0a1a0a'
                    : 'transparent',
                  border: `1px solid ${completed.includes(broker.id) ? '#1a3a1a' : '#222'}`,
                  color: completed.includes(broker.id) ? '#4aff88' : '#444',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                {completed.includes(broker.id) ? '✓ Done' : 'Mark Done'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: '#0a0f1a',
        border: '1px solid #1a2a3a',
        borderRadius: '12px',
        textAlign: 'center',
        color: '#4a9eff',
        fontSize: '0.85rem'
      }}>
        🔄 Brokers may re-add your data over time. 
        Check back monthly to stay protected.
      </div>
    </div>
  )
}