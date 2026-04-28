import { useState } from 'react'
import { supabase } from '../supabase'
import TypewriterText from './TypewriterText'
import Redacted from './Redacted'

const MONO = { fontFamily: "'Share Tech Mono', monospace" }

export default function SecureNote() {
  const [message, setMessage] = useState('')
  const [title, setTitle] = useState('')
  const [burnAfterRead, setBurnAfterRead] = useState(true)
  const [expiresIn, setExpiresIn] = useState('7')
  const [generatedLink, setGeneratedLink] = useState(null)
  const [loading, setLoading] = useState(false)

  const generateSecureNote = async () => {
    if (!message.trim()) {
      alert('Please enter a message')
      return
    }

    setLoading(true)
    setGeneratedLink(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Please log in to create secure notes')
        setLoading(false)
        return
      }

      // Generate random ID
      const noteId = crypto.randomUUID()
      
      // Generate encryption key
      const key = await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      )
      
      // Export key to base64 for sharing
      const rawKey = await window.crypto.subtle.exportKey('raw', key)
      const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(rawKey)))
      
      // Generate random IV
      const iv = window.crypto.getRandomValues(new Uint8Array(12))
      const ivBase64 = btoa(String.fromCharCode(...iv))
      
      // Encrypt message
      const encoder = new TextEncoder()
      const encodedMessage = encoder.encode(message)
      
      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encodedMessage
      )
      
      const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)))
      
      // Calculate expiration
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn))
      
      // Save to Supabase
      const { error } = await supabase
        .from('secure_notes')
        .insert({
          id: noteId,
          user_id: user.id,
          title: title || 'Untitled Note',
          encrypted_data: encryptedBase64,
          iv: ivBase64,
          expires_at: burnAfterRead ? null : expiresAt.toISOString(),
          read: false
        })
      
      if (error) throw error
      
      // Generate shareable link
      const shareUrl = `${window.location.origin}/secure-note/${noteId}#key=${keyBase64}`
      setGeneratedLink(shareUrl)
      
      // Clear form
      setMessage('')
      setTitle('')
      
    } catch (err) {
      console.error('Failed to create note:', err)
      alert('Failed to create secure note')
    }
    
    setLoading(false)
  }

  const copyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="tool-container">
      <div className="tool-header">
        <TypewriterText text="SECURE NOTES" style={MONO} />
        <p className="tool-sub">
          Create <Redacted>self-destructing</Redacted> encrypted messages that burn after reading
        </p>
      </div>

      <div style={{
        background: 'rgba(0,0,0,0.75)',
        border: '1px solid #1a1a1a',
        padding: '30px',
        marginBottom: '25px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#444', fontSize: '0.7rem', fontFamily: MONO, letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
            TITLE (OPTIONAL)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Backup Codes for iCloud"
            style={{
              width: '100%',
              background: '#000',
              border: '1px solid #222',
              color: '#fff',
              padding: '12px',
              fontSize: '0.85rem',
              fontFamily: MONO,
              outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#444', fontSize: '0.7rem', fontFamily: MONO, letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
            MESSAGE
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your secure message here... (encrypted locally before sending)"
            rows={6}
            style={{
              width: '100%',
              background: '#000',
              border: '1px solid #222',
              color: '#fff',
              padding: '12px',
              fontSize: '0.85rem',
              fontFamily: MONO,
              outline: 'none',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#444', fontSize: '0.7rem', fontFamily: MONO, letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
            OPTIONS
          </label>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555', fontFamily: MONO, fontSize: '0.8rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={burnAfterRead}
                onChange={(e) => setBurnAfterRead(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              Burn after reading (recommended)
            </label>
            
            {!burnAfterRead && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#444', fontFamily: MONO, fontSize: '0.7rem' }}>Expires in:</span>
                <select
                  value={expiresIn}
                  onChange={(e) => setExpiresIn(e.target.value)}
                  style={{
                    background: '#000',
                    border: '1px solid #222',
                    color: '#fff',
                    padding: '6px 12px',
                    fontFamily: MONO,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="1">1 day</option>
                  <option value="3">3 days</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={generateSecureNote}
          disabled={loading || !message.trim()}
          style={{
            width: '100%',
            background: '#fff',
            border: 'none',
            color: '#000',
            padding: '14px',
            fontSize: '0.85rem',
            fontFamily: MONO,
            letterSpacing: '3px',
            fontWeight: '700',
            cursor: (loading || !message.trim()) ? 'default' : 'pointer',
            opacity: (loading || !message.trim()) ? 0.5 : 1,
            transition: 'all 0.2s'
          }}
        >
          {loading ? 'ENCRYPTING & GENERATING...' : 'GENERATE SECURE LINK'}
        </button>
      </div>

      {generatedLink && (
        <div style={{
          background: '#050505',
          border: '1px solid #00ff00',
          padding: '25px',
          marginTop: '20px'
        }}>
          <div style={{ color: '#00ff00', fontSize: '0.7rem', fontFamily: MONO, letterSpacing: '2px', marginBottom: '10px' }}>
            ✓ SECURE LINK GENERATED
          </div>
          <div style={{
            background: '#000',
            border: '1px solid #1a1a1a',
            padding: '15px',
            marginBottom: '15px',
            wordBreak: 'break-all',
            fontFamily: MONO,
            fontSize: '0.75rem',
            color: '#888'
          }}>
            {generatedLink}
          </div>
          <button
            onClick={copyLink}
            style={{
              background: 'transparent',
              border: '1px solid #00ff00',
              color: '#00ff00',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontFamily: MONO,
              letterSpacing: '2px',
              width: '100%'
            }}
          >
            COPY LINK TO CLIPBOARD
          </button>
          <div style={{ marginTop: '15px', color: '#444', fontSize: '0.7rem', fontFamily: MONO, textAlign: 'center' }}>
            Share this link securely (Signal, WhatsApp, etc.). The recipient does NOT need a Redactxd account.
          </div>
        </div>
      )}

      <div style={{
        marginTop: '25px',
        padding: '20px',
        background: 'rgba(0,0,0,0.6)',
        border: '1px solid #1a1a1a',
        textAlign: 'center',
        color: '#333',
        fontSize: '0.7rem',
        fontFamily: MONO
      }}>
        ⚡ End-to-end encrypted in your browser | Keys never touch our servers | Messages self-destruct after reading
      </div>
    </div>
  )
}