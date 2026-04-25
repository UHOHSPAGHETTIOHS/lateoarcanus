import { useEffect, useState } from 'react'

const LINES = [
  '> INITIALIZING LATEOARCANUS v2.4.1...',
  '> LOADING ENCRYPTION MODULES...',
  '> ESTABLISHING SECURE TUNNEL...',
  '> MASKING IDENTITY...',
  '> SCANNING FOR SURVEILLANCE...',
  '> PURGING DIGITAL FOOTPRINT...',
  '> DEPLOYING ALIAS NETWORK...',
  '> ALL SYSTEMS NOMINAL.',
  '> WELCOME. YOU ARE HIDDEN.',
]

export default function BootSequence({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([])
  const [currentLine, setCurrentLine]   = useState('')
  const [lineIndex, setLineIndex]       = useState(0)
  const [charIndex, setCharIndex]       = useState(0)
  const [fading, setFading]             = useState(false)

  useEffect(() => {
    if (lineIndex >= LINES.length) {
      setTimeout(() => setFading(true), 600)
      setTimeout(() => onComplete(), 1200)
      return
    }

    const line = LINES[lineIndex]

    if (charIndex < line.length) {
      const t = setTimeout(() => {
        setCurrentLine(prev => prev + line[charIndex])
        setCharIndex(c => c + 1)
      }, 28)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setVisibleLines(prev => [...prev, line])
        setCurrentLine('')
        setCharIndex(0)
        setLineIndex(i => i + 1)
      }, 120)
      return () => clearTimeout(t)
    }
  }, [lineIndex, charIndex])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: fading ? 0 : 1,
      transition: fading ? 'opacity 0.6s ease' : 'none',
    }}>
      <style>{`
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>

      <div style={{
        width: '100%',
        maxWidth: '600px',
        padding: '40px',
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '0.85rem',
        letterSpacing: '1px',
        lineHeight: '2',
      }}>
        <div style={{
          color: '#fff',
          marginBottom: '20px',
          fontSize: '1.1rem',
          letterSpacing: '4px',
        }}>
          LATEOARCANUS
        </div>

        {visibleLines.map((line, i) => (
          <div key={i} style={{ color: '#444' }}>{line}</div>
        ))}

        {lineIndex < LINES.length && (
          <div style={{ color: '#fff' }}>
            {currentLine}
            <span style={{ animation: 'blink-cursor 0.7s step-end infinite' }}>█</span>
          </div>
        )}
      </div>
    </div>
  )
}