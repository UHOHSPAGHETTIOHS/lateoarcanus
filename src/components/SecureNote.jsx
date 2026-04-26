import { useState, useEffect } from 'react'
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
  const [notes, setNotes] = useState([])
  const [activeTab, setActiveTab] = useState('create') // 'create' or 'inbox'
  const [decrypting, setDecrypting] = useState(false)
  const [decryptedMessage, setDecryptedMessage] = useState(null)
  const [selectedNoteId, setSelectedNoteId] = useState(null)

  // Fetch user's received notes (inbox)
  const fetchNotes = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('secure_notes')
      .select('*')
      .eq('user_id', user.id)
      .eq('read', false)
      .order('created_at', { ascending: false })

    if (data) setNotes(data)
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  // Check if viewing a shared note (URL contains #key)
  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.includes('key=')) {
      const match = hash.match(/key=([^&]+)/)
      if (match) {
        const key = match[1]
        const noteId = window.location.pathname.split('/').pop()
        if (noteId && noteId !== 'secure-note') {
          decryptAndViewNote(noteId, key)
        }
      }
    }
  }, [])

  const decryptAndViewNote = async (noteId, keyBase64) => {
    setDecrypting(true)
    try {
      // Fetch encrypted note
      const { data: note, error } = await supabase
        .from('secure_notes')
        .select('*')
        .eq('id', noteId)
        .single()

      if (error || !note) {
        alert('Note not found or already destroyed')
        setDecrypting(false)
        return
      }

      if (note.read) {
        alert('This note has already been read and destroyed')
        setDecrypting(false)
        return
      }

      // Convert key from base64 to CryptoKey
      const keyBytes = Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0))
      const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      )

      // Decrypt
      const encryptedBytes = Uint8Array.from(atob(note.encrypted_data), c => c.charCodeAt(0))
      const iv = Uint8Array.from(atob(note.iv), c => c.charCodeAt(0))
      
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        encryptedBytes
      )

      const decoder = new TextDecoder()
      const plaintext = decoder.decode(decrypted)
      setDecryptedMessage(plaintext)
      setSelectedNoteId(noteId)

      // Mark as read and delete if burnAfterRead
      if (note.burn_after_read !== false) {
        await supabase
          .from('secure_notes')
          .update({ read: true })
          .eq('id', noteId)
        
        // Clear URL hash
        window.history.replaceState({}, '', window.location.pathname)
      }

    } catch (err) {
      console.error('Decryption failed:', err)
      alert('Failed to decrypt note. It may have been tampered with or already destroyed.')
    }
    setDecrypting(false)
  }

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

  const deleteNote = async (id) => {
    await supabase
      .from('secure_notes')
      .delete()
      .eq('id', id)
    setNotes(notes.filter(n => n.id !== id))
  }

  const getDaysLeft = (expiresAt) => {
    if (!expiresAt) return 'Never (burns on read)'
    const days = Math.ceil((new Date(expiresAt) - new Date()) / (1000 * 60 * 60 * 24))
    return days > 0 ? `${days} days` : 'Expired'
  }

  // View for reading a decrypted note
  if (decryptedMessage) {
    return (
      <div className="tool-container">
        <div className="tool-header">
          <TypewriterText text="SECURE NOTE" style={MONO} />
          <p className="tool-sub">
            This message has been <Redacted>decrypted locally</Redacted> in your browser
          </p>
        </div>

        <div style={{
          background: 'rgba(0,0,0,0.75)',
          border: '1px solid #1a1a1a',
          padding: '40px',
          marginBottom: '20px'
        }}>
          <pre style={{
            color: '#fff',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.9rem',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            margin: 0
          }}>
            {decryptedMessage}
          </pre>
        </div>

        <div style={{
          background: '#050505',
          border: '1px solid #222',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ color: '#ff4444', fontFamily: MONO, marginBottom: '10px' }}>
            ⚠ THIS NOTE HAS BEEN DESTROYED
          </div>
          <div style={{ color: '#444', fontSize: '0.75rem', fontFamily: MONO }}>
            The encrypted copy has been deleted. No one can read this message again.
          </div>
        </div>
      </div>
    )
  }

  if (decrypting) {
    return (
      <div className="tool-container" style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ color: '#fff', fontFamily: MONO, fontSize: '1.2rem', marginBottom: '20px' }}>
          DECRYPTING NOTE...
        </div>
        <div style={{ color: '#333', fontFamily: MONO }}>
          This may take a moment
        </div>
      </div>
    )
  }

  return (
    <div className="tool-container">
      <div className="tool-header">
        <TypewriterText text="SECURE NOTES" style={MONO} />
        <p className="tool-sub">
          Create <Redacted>self-destructing</Redacted> encrypted messages that burn after reading
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '25px', borderBottom: '1px solid #1a1a1a', paddingBottom: '15px' }}>
        <button
          onClick={() => { setActiveTab('create'); setGeneratedLink(null) }}
          style={{
            background: activeTab === 'create' ? '#fff' : 'transparent',
            border: 'none',
            color: activeTab === 'create' ? '#000' : '#555',
            padding: '8px 20px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontFamily: MONO,
            letterSpacing: '2px',
            transition: 'all 0.2s'
          }}
        >
          + CREATE NOTE
        </button>
        <button
          onClick={() => { setActiveTab('inbox'); fetchNotes() }}
          style={{
            background: activeTab === 'inbox' ? '#fff' : 'transparent',
            border: 'none',
            color: activeTab === 'inbox' ? '#000' : '#555',
            padding: '8px 20px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontFamily: MONO,
            letterSpacing: '2px',
            transition: 'all 0.2s'
          }}
        >
          INBOX ({notes.length})
        </button>
      </div>

      {activeTab === 'create' && (
        <>
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
                Share this link securely (Signal, WhatsApp, etc.). The recipient does NOT need a redactxd account.
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'inbox' && (
        <div style={{
          background: 'rgba(0,0,0,0.75)',
          border: '1px solid #1a1a1a',
          padding: '25px'
        }}>
          {notes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#333', fontFamily: MONO }}>
              NO PENDING NOTES
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {notes.map(note => (
                <div key={note.id} style={{
                  background: '#000',
                  border: '1px solid #1a1a1a',
                  padding: '15px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '15px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontFamily: MONO, fontWeight: '700', marginBottom: '4px' }}>
                      {note.title || 'Untitled Note'}
                    </div>
                    <div style={{ color: '#444', fontSize: '0.7rem', fontFamily: MONO }}>
                      Created: {new Date(note.created_at).toLocaleDateString()} | Expires: {getDaysLeft(note.expires_at)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => deleteNote(note.id)}
                      style={{
                        background: 'transparent',
                        border: '1px solid #222',
                        color: '#444',
                        padding: '6px 14px',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        fontFamily: MONO,
                        letterSpacing: '1px'
                      }}
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
        ⚡ End-to-end encrypted in your browser | Keys never touch our servers | Messages self-destruct
      </div>
    </div>
  )
}