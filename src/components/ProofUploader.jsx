import { useState } from 'react'
import { supabase } from '../supabase'

export default function ProofUploader({ brokerId, brokerName, onUpload }) {
  const [uploading, setUploading] = useState(false)
  const [url, setUrl] = useState(null)

  const uploadProof = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${brokerId}_${Date.now()}.${fileExt}`
    const filePath = `removal-proofs/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('proofs')
      .upload(filePath, file)

    if (uploadError) {
      alert('Upload failed: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('proofs')
      .getPublicUrl(filePath)

    await supabase.from('removal_attempts').update({
      proof_url: publicUrl,
      status: 'completed',
      completed_at: new Date().toISOString()
    }).eq('user_id', user.id).eq('broker_id', brokerId)

    setUrl(publicUrl)
    setUploading(false)
    if (onUpload) onUpload(publicUrl)
  }

  return (
    <div style={{ marginTop: '8px' }}>
      {url ? (
        <div style={{ color: '#666', fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace" }}>
          [ PROOF UPLOADED ]
        </div>
      ) : (
        <label style={{ 
          display: 'inline-block',
          background: 'transparent',
          border: '1px solid #222',
          color: '#444',
          padding: '6px 12px',
          cursor: 'pointer',
          fontSize: '0.7rem',
          fontFamily: "'Share Tech Mono', monospace"
        }}>
          {uploading ? '[ UPLOADING... ]' : '[ UPLOAD PROOF ]'}
          <input 
            type="file" 
            accept="image/*,.pdf" 
            onChange={uploadProof}
            style={{ display: 'none' }}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  )
}