import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabase'
import TypewriterText from '../components/TypewriterText'
import Redacted from '../components/Redacted'

const MONO = { fontFamily: "'Share Tech Mono', monospace" }

export default function SecureNotePage() {
  const { id } = useParams()
  const [decrypting, setDecrypting] = useState(true)
  const [decryptedMessage, setDecryptedMessage] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const hash = window.location.hash
    const keyMatch = hash.match(/key=([^&]+)/)
    const key = keyMatch ? keyMatch[1] : null
    
    if (id && key) {
      decryptNote(id, key)
    } else {
      setError('Invalid note link')
      setDecrypting(false)
    }
  }, [id])

  const decryptNote = async (noteId, keyBase64) => {
    try {
      // Fetch encrypted note from Supabase
      const { data: note, error } = await supabase
        .from('secure_notes')
        .select('encrypted_data, iv')
        .eq('id', noteId)
        .single()

      if (error || !note) {
        setError('Note not found or already destroyed')
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

      // Delete the note after successful decryption (self-destruct)
      await supabase
        .from('secure_notes')
        .delete()
        .eq('id', noteId)

    } catch (err) {
      console.error('Decryption failed:', err)
      setError('Failed to decrypt note. It may have been tampered with or already destroyed.')
    }
    setDecrypting(false)
  }

  if (decrypting) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', background: '#000', minHeight: '100vh' }}>
        <div style={{ color: '#fff', fontFamily: MONO, fontSize: '1.2rem', marginBottom: '20px' }}>
          DECRYPTING NOTE...
        </div>
        <div style={{ color: '#333', fontFamily: MONO }}>
          This may take a moment
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', background: '#000', minHeight: '100vh' }}>
        <div style={{ color: '#ff4444', fontFamily: MONO, fontSize: '1.2rem', marginBottom: '20px' }}>
          ⚠ ERROR
        </div>
        <div style={{ color: '#666', fontFamily: MONO }}>
          {error}
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '40px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <TypewriterText text="SECURE NOTE" style={MONO} />
          <p style={{ color: '#444', fontFamily: MONO, marginTop: '10px' }}>
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
            fontFamily: MONO,
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
    </div>
  )
}