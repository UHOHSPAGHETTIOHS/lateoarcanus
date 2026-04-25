import { useState } from 'react'
import { supabase } from '../supabase'
import TypewriterText from '../components/TypewriterText'
import Redacted from '../components/Redacted'

const BIG_TECH = [
  {
    id: 'google',
    name: 'Google',
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
    optOutUrl: 'https://myaccount.google.com/data-and-privacy',
    deletionUrl: 'https://myaccount.google.com/delete-services-or-account'
  },
  {
    id: 'meta',
    name: 'Meta / Facebook',
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
    optOutUrl: 'https://www.facebook.com/privacy/center',
    deletionUrl: 'https://www.facebook.com/help/delete_account'
  },
  {
    id: 'amazon',
    name: 'Amazon',
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
    optOutUrl: 'https://www.amazon.com/privacy',
    deletionUrl: 'https://www.amazon.com/hz/contact-us/privacy'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
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
    optOutUrl: 'https://www.tiktok.com/legal/privacy-policy',
    deletionUrl: 'https://support.tiktok.com/en/account-and-privacy/deleting-an-account'
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
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
    optOutUrl: 'https://account.microsoft.com/privacy',
    deletionUrl: 'https://account.microsoft.com/privacy/data-controls'
  },
  {
    id: 'apple',
    name: 'Apple',
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
    optOutUrl: 'https://privacy.apple.com',
    deletionUrl: 'https://privacy.apple.com/account'
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
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
    optOutUrl: 'https://twitter.com/settings/privacy_and_safety',
    deletionUrl: 'https://twitter.com/settings/deactivate'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
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
    optOutUrl: 'https://www.linkedin.com/psettings/privacy',
    deletionUrl: 'https://www.linkedin.com/help/linkedin/answer/63'
  },
  {
    id: 'spotify',
    name: 'Spotify',
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
    optOutUrl: 'https://www.spotify.com/account/privacy',
    deletionUrl: 'https://support.spotify.com/article/close-account'
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
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
    optOutUrl: 'https://www.snapchat.com/privacy/privacy-controls',
    deletionUrl: 'https://support.snapchat.com/en-US/a/delete-my-account1'
  }
]

const mono = { fontFamily: "'Share Tech Mono', monospace" }

const trackBigTechOptOut = async (companyId, companyName) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  
  await supabase.from('removal_attempts').insert({
    user_id: user.id,
    broker_id: companyId,
    broker_name: companyName,
    method: 'manual',
    status: 'sent',
    sent_at: new Date().toISOString(),
    next_follow_up: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  })
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

  const confirmOptOut = async () => {
    await trackBigTechOptOut(pendingCompany.id, pendingCompany.name)
    setSent([...sent, pendingCompany.id])
    setShowWarning(false)
    window.open(pendingCompany.optOutUrl, '_blank')
  }

  return (
    <div className="tool-container" style={{ maxWidth: '900px' }}>
      <div className="tool-header">
        <TypewriterText text="Big Tech Data Control" style={{ fontFamily: "'Share Tech Mono', monospace" }} />
        <p className="tool-sub">
          See exactly what the worlds biggest companies <Redacted>know about you</Redacted> and take back control of your <Redacted>data</Redacted>
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        marginBottom: '30px'
      }}>
        {[
          { number: '10+', label: <span>Companies <Redacted>profiling you</Redacted></span> },
          { number: '$700+', label: <span>Avg yearly value of <Redacted>your data</Redacted></span> },
          { number: '10,000+', label: <span>Times <Redacted>your data</Redacted> is sold yearly</span> },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid #1a1a1a',
            padding: '25px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: '900',
              color: '#fff',
              marginBottom: '8px',
              ...mono
            }}>
              {stat.number}
            </div>
            <div style={{
              color: '#333',
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              ...mono
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {BIG_TECH.map(company => (
          <div key={company.id}>
            <div
              style={{
                background: '#000',
                border: '1px solid #1a1a1a',
                borderBottom: selected?.id === company.id ? 'none' : '1px solid #1a1a1a',
                padding: '18px 22px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => setSelected(selected?.id === company.id ? null : company)}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    marginBottom: '4px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      fontWeight: '700',
                      fontSize: '0.95rem',
                      color: '#fff',
                      ...mono
                    }}>
                      {company.name}
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      color: '#444',
                      letterSpacing: '1px',
                      ...mono
                    }}>
                      [ {company.riskLevel.toUpperCase()} ]
                    </span>
                    {sent.includes(company.id) && (
                      <span style={{
                        fontSize: '0.7rem',
                        color: '#fff',
                        border: '1px solid #333',
                        padding: '2px 8px',
                        ...mono
                      }}>
                        OPTED OUT
                      </span>
                    )}
                  </div>
                  <div style={{ color: '#333', fontSize: '0.8rem', ...mono }}>
                    {company.tagline}
                  </div>
                </div>
                <span style={{
                  color: '#333',
                  fontSize: '0.75rem',
                  transition: 'transform 0.2s',
                  transform: selected?.id === company.id ? 'rotate(180deg)' : 'rotate(0deg)',
                  ...mono
                }}>
                  ▼
                </span>
              </div>
            </div>

            {selected?.id === company.id && (
              <div style={{
                background: '#050505',
                border: '1px solid #1a1a1a',
                borderTop: 'none',
                padding: '25px'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '20px',
                  marginBottom: '25px'
                }}>
                  {[
                    { title: 'WHAT THEY COLLECT', items: company.dataCollected },
                    { title: 'WHAT THEY SELL', items: company.dataSold },
                    { title: 'YOUR RISKS', items: company.risks },
                  ].map(col => (
                    <div key={col.title}>
                      <h3 style={{
                        fontSize: '0.7rem',
                        color: '#444',
                        letterSpacing: '2px',
                        marginBottom: '12px',
                        ...mono
                      }}>
                        {col.title}
                      </h3>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}>
                        {col.items.map(item => (
                          <div key={item} style={{
                            color: '#444',
                            fontSize: '0.78rem',
                            display: 'flex',
                            gap: '6px',
                            ...mono
                          }}>
                            <span style={{ color: '#fff', flexShrink: 0 }}>_</span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  gap: '10px',
                  paddingTop: '20px',
                  borderTop: '1px solid #1a1a1a'
                }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleOptOut(company) }}
                    className="button"
                    style={{ flex: 1 }}
                  >
                    {sent.includes(company.id) ? 'Opt Out Again' : 'Opt Out of Data Collection'}
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
                      color: '#444',
                      padding: '14px',
                      textDecoration: 'none',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      letterSpacing: '1px',
                      ...mono
                    }}
                  >
                    Request Data Deletion
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
          inset: 0,
          background: 'rgba(0,0,0,0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#000',
            border: '1px solid #333',
            padding: '40px',
            maxWidth: '500px',
            width: '100%'
          }}>
            <h2 style={{
              marginBottom: '15px',
              color: '#fff',
              ...mono
            }}>
              Before You Continue
            </h2>
            <p style={{
              color: '#444',
              marginBottom: '25px',
              lineHeight: '1.6',
              fontSize: '0.85rem',
              ...mono
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
                { symbol: '!', text: 'Personalized recommendations may become less relevant' },
                { symbol: '!', text: 'Search results may be less personalized' },
                { symbol: '+', text: 'Your account and content will NOT be deleted' },
                { symbol: '+', text: 'You will still be able to use the service normally' },
                { symbol: '+', text: 'Your personal data will be significantly reduced' },
                { symbol: '+', text: 'Your identity will be much better protected' },
              ].map(item => (
                <div key={item.text} style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  fontSize: '0.82rem',
                  ...mono
                }}>
                  <span style={{
                    color: item.symbol === '+' ? '#fff' : '#444',
                    flexShrink: 0
                  }}>
                    [{item.symbol}]
                  </span>
                  <span style={{ color: '#444' }}>{item.text}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={confirmOptOut}
                className="button"
                style={{ flex: 1 }}
              >
                Protect My Privacy
              </button>
              <button
                onClick={() => setShowWarning(false)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: '1px solid #222',
                  color: '#444',
                  padding: '14px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  ...mono
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