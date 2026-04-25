import { useEffect, useState } from 'react'

export default function Redacted({ children }) {
  const [revealed, setRevealed] = useState(false)
  const [flicker, setFlicker]   = useState(false)

  useEffect(() => {
    if (revealed) return
    const interval = setInterval(() => {
      if (Math.random() > 0.75) {
        setFlicker(true)
        setTimeout(() => setFlicker(false), Math.random() * 100 + 40)
      }
    }, Math.random() * 1200 + 600)
    return () => clearInterval(interval)
  }, [revealed])

  return (
    <span
      onClick={() => setRevealed(r => !r)}
      title={revealed ? 'Click to redact' : 'Click to reveal'}
      style={{
        position: 'relative',
        display: 'inline-block',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <span style={{ opacity: revealed ? 1 : 0, transition: 'opacity 0.1s' }}>
        {children}
      </span>
      {!revealed && (
        <span style={{
          position: 'absolute',
          inset: '0 -2px',
          background: flicker ? 'transparent' : '#fff',
          display: 'block',
        }}/>
      )}
    </span>
  )
}