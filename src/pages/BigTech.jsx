import { useState } from 'react'

const BIG_TECH = [
  {
    id: 'google',
    name: 'Google',
    icon: '🔍',
    color: '#4285f4',
    riskLevel: 'Critical',
    tagline: 'Knows everything about you',
    dataCollected: [
      'Every search you have ever made',
      'Every website you visit via Chrome',
      'Your exact location 24/7',
      'Every YouTube video watched',
      'All emails sent and received via Gmail',
      'Voice recordings via Google Assistant',
      'Every app you use and when',
      'Your contacts, calendar and photos',
      'Your purchases via Google Pay',
      'Your health data via Google Fit'
    ],
    dataSold: [
      'Behavioral profiles to advertisers',
      'Interest and demographic categories',
      'Location patterns and routines',
      'Purchase intent data',
      'Emotional and psychological profiles'
    ],
    risks: [
      'Identity theft via data breaches',
      'Location stalking',
      'Financial fraud',
      'Behavioral manipulation',
      'Personal profiling'
    ],
    privacyEmail: 'privacy@google.com',
    optOutUrl: 'https://myaccount.google.com/data-and-privacy',
    deletionUrl: 'https://myaccount.google.com/delete-services-or-account'
  },
  {
    id: 'meta',
    name: 'Meta / Facebook',
    icon: '👥',
    color: '#1877f2',
    riskLevel: 'Critical',
    tagline: 'Knows your deepest thoughts and relationships',
    dataCollected: [
      'Every post, like and comment ever made',
      'Every message sent even if deleted',
      'Your face via facial recognition',
      'Your precise location history',
      'Every website visited outside Facebook',
      'Your political views and affiliations',
      'All relationships and family connections',
      'Your phone contacts if ever uploaded',
      'Your estimated income level',
      'Your emotional state and vulnerabilities'
    ],
    dataSold: [
      'Detailed psychographic profiles',
      'Political affiliation data',
      'Relationship and life event data',
      'Emotional vulnerability profiles',
      'Behavioral prediction models'
    ],
    risks: [
      'Political manipulation',
      'Emotional manipulation',
      'Identity theft',
      'Relationship exploitation',
      'Cambridge Analytica style misuse'
    ],
    privacyEmail: 'privacy@fb.com',
    optOutUrl: 'https://www.facebook.com/privacy/center',
    deletionUrl: 'https://www.facebook.com/help/delete_account'
  },
  {
    id: 'amazon',
    name: 'Amazon',
    icon: '📦',
    color: '#ff9900',
    riskLevel: 'High',
    tagline: 'Knows your finances and home life',
    dataCollected: [
      'Everything you have ever bought',
      'Everything you have ever searched',
      'Your complete address history',
      'Your credit card and financial data',
      'Voice recordings via Alexa',
      'Your daily home routines via Ring',
      'Your reading habits via Kindle',
      'Your TV watching via Fire TV',
      'Your estimated income and wealth',
      'Your household composition'
    ],
    dataSold: [
      'Purchase behavior profiles',
      'Product interest data',
      'Financial behavior patterns',
      'Household demographic data',
      'Shopping intent signals'
    ],
    risks: [
      'Financial fraud',
      'Home security risks via Ring',
      'Identity theft',
      'Financial profiling',
      'Law enforcement data sharing'
    ],
    privacyEmail: 'privacy@amazon.com',
    optOutUrl: 'https://www.amazon.com/privacy',
    deletionUrl: 'https://www.amazon.com/hz/contact-us/privacy'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    color: '#ff0050',
    riskLevel: 'Critical',
    tagline: 'Most aggressive data collector on your phone',
    dataCollected: [
      'Your face and voice biometrics',
      'Your exact location at all times',
      'Your device and network information',
      'Your clipboard contents',
      'Every video watched and for how long',
      'Your complete search history',
      'All your contacts',
      'Your keystroke patterns',
      'Your daily schedule and routines',
      'Potentially shared with Chinese government'
    ],
    dataSold: [
      'Biometric data profiles',
      'Behavioral addiction profiles',
      'Demographic and interest data',
      'Location and movement patterns',
      'Psychological vulnerability data'
    ],
    risks: [
      'Biometric data theft',
      'Foreign government surveillance',
      'Identity theft',
      'Location stalking',
      'Psychological manipulation'
    ],
    privacyEmail: 'privacy@tiktok.com',
    optOutUrl: 'https://www.tiktok.com/legal/privacy-policy',
    deletionUrl: 'https://support.tiktok.com/en/account-and-privacy/deleting-an-account'
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    icon: '💻',
    color: '#00a4ef',
    riskLevel: 'High',
    tagline: 'Knows your professional and personal life',
    dataCollected: [
      'Everything you type via Windows telemetry',
      'Your work documents via OneDrive',
      'Your emails via Outlook',
      'Your professional network via LinkedIn',
      'Your browsing via Edge',
      'Your gaming behavior via Xbox',
      'Your voice via Cortana',
      'Your face via Windows Hello',
      'Your calendar and meetings',
      'Your professional communications'
    ],
    dataSold: [
      'Professional profile data via LinkedIn',
      'Advertising behavioral data',
      'Enterprise analytics data',
      'Professional interest profiles',
      'Career and income data'
    ],
    risks: [
      'Professional identity theft',
      'Work document exposure',
      'LinkedIn data exploitation',
      'Corporate espionage risk',
      'Career manipulation'
    ],
    privacyEmail: 'privacy@microsoft.com',
    optOutUrl: 'https://account.microsoft.com/privacy',
    deletionUrl: 'https://account.microsoft.com/privacy/data-controls'
  },
  {
    id: 'apple',
    name: 'Apple',
    icon: '🍎',
    color: '#555555',
    riskLevel: 'Medium',
    tagline: 'Less than most but still collects significant data',
    dataCollected: [
      'Your location history',
      'Your app usage patterns',
      'Your purchase history via App Store',
      'Your health data via Apple Health',
      'Your face via Face ID',
      'Your voice via Siri recordings',
      'Your photos and their metadata',
      'Your contacts and communications',
      'Your financial data via Apple Pay',
      'Your device usage patterns'
    ],
    dataSold: [
      'Aggregated app usage data',
      'Advertising data via Apple Ads',
      'App Store behavioral data',
      'Limited third party sharing'
    ],
    risks: [
      'Health data exposure',
      'Biometric data risks',
      'Financial data theft',
      'Location tracking',
      'Identity theft'
    ],
    privacyEmail: 'privacy@apple.com',
    optOutUrl: 'https://privacy.apple.com',
    deletionUrl: 'https://privacy.apple.com/account'
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    icon: '🐦',
    color: '#1da1f2',
    riskLevel: 'High',
    tagline: 'Knows your opinions and political views',
    dataCollected: [
      'Every tweet, like and retweet',
      'Your political opinions and views',
      'Your location when tweeting',
      'Your phone number',
      'Your browsing via Twitter buttons',
      'Your device information',
      'Your follower relationships',
      'Your direct messages',
      'Your interests and affiliations',
      'Your activity patterns'
    ],
    dataSold: [
      'Political profile data',
      'Interest and opinion data',
      'Demographic profiles',
      'Behavioral patterns',
      'Influence network data'
    ],
    risks: [
      'Political targeting',
      'Opinion manipulation',
      'Identity exposure',
      'Doxxing risk',
      'Employment discrimination'
    ],
    privacyEmail: 'privacy@twitter.com',
    optOutUrl: 'https://twitter.com/settings/privacy_and_safety',
    deletionUrl: 'https://twitter.com/settings/deactivate'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    color: '#0077b5',
    riskLevel: 'High',
    tagline: 'Knows your entire professional life',
    dataCollected: [
      'Your complete work history',
      'Your education background',
      'Your professional network',
      'Your skills and endorsements',
      'Your salary expectations',
      'Your job search activity',
      'Your professional communications',
      'Your career aspirations',
      'Your income level estimated',
      'Your professional relationships'
    ],
    dataSold: [
      'Professional demographic data',
      'Career progression data',
      'Salary and income profiles',
      'Professional interest data',
      'Recruitment targeting data'
    ],
    risks: [
      'Professional identity theft',
      'Salary discrimination',
      'Career manipulation',
      'Corporate targeting',
      'Recruitment scams'
    ],
    privacyEmail: 'privacy@linkedin.com',
    optOutUrl: 'https://www.linkedin.com/psettings/privacy',
    deletionUrl: 'https://www.linkedin.com/help/linkedin/answer/63'
  },
  {
    id: 'spotify',
    name: 'Spotify',
    icon: '🎧',
    color: '#1db954',
    riskLevel: 'Medium',
    tagline: 'Knows your emotions through your music',
    dataCollected: [
      'Every song you have ever played',
      'Your emotional state via music choices',
      'Your daily routines and schedule',
      'Your location',
      'Your social connections',
      'Your taste and personality profile',
      'Your podcast listening habits',
      'Your political leanings via content',
      'Your age and demographic data',
      'Your device and usage patterns'
    ],
    dataSold: [
      'Emotional profile data',
      'Demographic and taste data',
      'Behavioral pattern data',
      'Advertising targeting data',
      'Third party partner data'
    ],
    risks: [
      'Emotional manipulation',
      'Demographic profiling',
      'Behavioral prediction',
      'Advertising exploitation',
      'Personal taste exposure'
    ],
    privacyEmail: 'privacy@spotify.com',
    optOutUrl: 'https://www.spotify.com/account/privacy',
    deletionUrl: 'https://support.spotify.com/article/close-account'
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    icon: '👻',
    color: '#fffc00',
    riskLevel: 'High',
    tagline: 'Knows your location and social life in real time',
    dataCollected: [
      'Your precise real time location via Snap Map',
      'Your face via facial recognition filters',
      'Your social circle and friendships',
      'Your daily routines and patterns',
      'Your communication patterns',
      'Your device information',
      'Your age and demographic data',
      'Your interests via content consumption',
      'Your photos and videos',
      'Your behavioral patterns'
    ],
    dataSold: [
      'Location and movement data',
      'Demographic profiles',
      'Social network data',
      'Behavioral targeting data',
      'Advertising profiles'
    ],
    risks: [
      'Real time location stalking',
      'Facial recognition risks',
      'Social manipulation',
      'Youth targeting exploitation',
      'Identity theft'
    ],
    privacyEmail: 'privacy@snap.com',
    optOutUrl: 'https://www.snapchat.com/privacy/privacy-controls',
    deletionUrl: 'https://support.snapchat.com/en-US/a/delete-my-account1'
  }
]

const getRiskColor = (risk) => {
  switch(risk) {
    case 'Critical': return '#ff4444'
    case 'High': return '#ff6b6b'
    case 'Medium': return '#ffaa00'
    case 'Low': return '#4aff88'
    default: return '#888'
  }
}
export default function BigTech() {
  const [selected, setSelected] = useState(null)
  const [sent, setSent] = useState([])
  const [showWarning, setShowWarning] = useState(false)
  const [pendingCompany, setPendingCompany] = useState(null)

  const handleOptOut = (company) => {
    setPendingCompany(company)
    setShowWarning(true)
  }

  const confirmOptOut = () => {
    setSent([...sent, pendingCompany.id])
    setShowWarning(false)
    window.open(pendingCompany.optOutUrl, '_blank')
  }

  return (
    <div className="tool-container" style={{maxWidth: '900px'}}>
      <div className="tool-header">
        <h1>Big Tech Data Control</h1>
        <p className="tool-sub">
          See exactly what the worlds biggest companies know about
          you and take back control of your data
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '15px',
        marginBottom: '30px'
      }}>
        {[
          {
            number: '10+',
            label: 'Companies profiling you',
            color: '#ff6b6b'
          },
          {
            number: '\$700+',
            label: 'Avg yearly value of your data',
            color: '#ffaa00'
          },
          {
            number: '10,000+',
            label: 'Times your data is sold yearly',
            color: '#4a9eff'
          }
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#111',
            border: '1px solid #1e1e1e',
            borderRadius: '12px',
            padding: '25px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: '900',
              color: stat.color,
              marginBottom: '8px'
            }}>
              {stat.number}
            </div>
            <div style={{
              color: '#555',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        {BIG_TECH.map(company => (
          <div key={company.id}>
            <div
              style={{
                background: '#111',
                border: `1px solid ${selected?.id === company.id
                  ? getRiskColor(company.riskLevel) + '44'
                  : '#1e1e1e'}`,
                borderRadius: selected?.id === company.id
                  ? '12px 12px 0 0'
                  : '12px',
                padding: '20px 25px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => setSelected(
                selected?.id === company.id ? null : company
              )}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}>
                  <span style={{fontSize: '2rem'}}>
                    {company.icon}
                  </span>
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '4px',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{
                        fontWeight: '700',
                        fontSize: '1.1rem'
                      }}>
                        {company.name}
                      </span>
                      <span style={{
                        fontSize: '0.7rem',
                        padding: '2px 10px',
                        borderRadius: '999px',
                        background: getRiskColor(company.riskLevel) + '22',
                        color: getRiskColor(company.riskLevel),
                        border: `1px solid ${getRiskColor(company.riskLevel)}44`
                      }}>
                        {company.riskLevel} Risk
                      </span>
                      {sent.includes(company.id) && (
                        <span style={{
                          fontSize: '0.7rem',
                          padding: '2px 10px',
                          borderRadius: '999px',
                          background: '#0a1a0a',
                          color: '#4aff88',
                          border: '1px solid #1a3a1a'
                        }}>
                          ✓ Opted Out
                        </span>
                      )}
                    </div>
                    <div style={{
                      color: '#555',
                      fontSize: '0.85rem'
                    }}>
                      {company.tagline}
                    </div>
                  </div>
                </div>
                <span style={{
                  color: '#333',
                  fontSize: '1.2rem',
                  transition: 'transform 0.2s',
                  transform: selected?.id === company.id
                    ? 'rotate(180deg)'
                    : 'rotate(0deg)'
                }}>
                  ▼
                </span>
              </div>
            </div>

            {selected?.id === company.id && (
              <div style={{
                background: '#0a0a0a',
                border: `1px solid ${getRiskColor(company.riskLevel)}22`,
                borderTop: 'none',
                borderRadius: '0 0 12px 12px',
                padding: '25px'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '20px',
                  marginBottom: '25px'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '0.8rem',
                      color: '#ff6b6b',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '12px'
                    }}>
                      📊 What They Collect
                    </h3>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}>
                      {company.dataCollected.map(item => (
                        <div key={item} style={{
                          color: '#666',
                          fontSize: '0.8rem',
                          display: 'flex',
                          gap: '6px'
                        }}>
                          <span style={{color: '#ff6b6b'}}>•</span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 style={{
                      fontSize: '0.8rem',
                      color: '#ffaa00',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '12px'
                    }}>
                      💰 What They Sell
                    </h3>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}>
                      {company.dataSold.map(item => (
                        <div key={item} style={{
                          color: '#666',
                          fontSize: '0.8rem',
                          display: 'flex',
                          gap: '6px'
                        }}>
                          <span style={{color: '#ffaa00'}}>•</span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 style={{
                      fontSize: '0.8rem',
                      color: '#4aff88',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '12px'
                    }}>
                      ⚠️ Your Risks
                    </h3>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}>
                      {company.risks.map(item => (
                        <div key={item} style={{
                          color: '#666',
                          fontSize: '0.8rem',
                          display: 'flex',
                          gap: '6px'
                        }}>
                          <span style={{color: '#4aff88'}}>•</span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  paddingTop: '20px',
                  borderTop: '1px solid #1a1a1a'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleOptOut(company)
                    }}
                    className="button"
                    style={{flex: 1}}
                  >
                    {sent.includes(company.id)
                      ? '✓ Opted Out - Do Again'
                      : '🛡️ Opt Out of Data Collection'}
                  </button>
                  <a
                    href={company.deletionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: '1px solid #222',
                      color: '#888',
                      padding: '15px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    🗑️ Request Data Deletion
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showWarning && pendingCompany && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#111',
            border: '1px solid #1e1e1e',
            borderRadius: '16px',
            padding: '40px',
            maxWidth: '500px',
            width: '100%'
          }}>
            <h2 style={{marginBottom: '15px'}}>
              ⚠️ Before You Continue
            </h2>
            <p style={{
              color: '#888',
              marginBottom: '25px',
              lineHeight: '1.6'
            }}>
              Opting out of {pendingCompany.name} data collection may affect your experience
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '25px'
            }}>
              {[
                {
                  icon: '⚠️',
                  text: 'Personalized recommendations may become less relevant',
                  color: '#ffaa00'
                },
                {
                  icon: '⚠️',
                  text: 'Search results may be less personalized',
                  color: '#ffaa00'
                },
                {
                  icon: '✓',
                  text: 'Your account and content will NOT be deleted',
                  color: '#4aff88'
                },
                {
                  icon: '✓',
                  text: 'You will still be able to use the service normally',
                  color: '#4aff88'
                },
                {
                  icon: '✓',
                  text: 'Your personal data will be significantly reduced',
                  color: '#4aff88'
                },
                {
                  icon: '✓',
                  text: 'Your identity will be much better protected',
                  color: '#4aff88'
                }
              ].map(item => (
                <div key={item.text} style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  fontSize: '0.9rem'
                }}>
                  <span style={{color: item.color}}>{item.icon}</span>
                  <span style={{color: '#666'}}>{item.text}</span>
                </div>
              ))}
            </div>

            <div style={{display: 'flex', gap: '12px'}}>
              <button
                onClick={confirmOptOut}
                className="button"
                style={{flex: 1}}
              >
                Yes, Protect My Privacy
              </button>
              <button
                onClick={() => setShowWarning(false)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: '1px solid #222',
                  color: '#666',
                  padding: '15px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}