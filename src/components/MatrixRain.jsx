export default function MatrixRain() {
  const chars = '01アイウエオカキクケコ#@%&タチツテト'.split('')
  const columns = 60

  return (
    <>
      <style>{`
        @keyframes matrix-fall {
          0%   { transform: translateY(-100vh); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>

      <div style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 5,
        pointerEvents: 'none',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-around',
      }}>
        {Array.from({ length: columns }).map((_, colIndex) => {
          const numChars = Math.floor(Math.random() * 15) + 8
          const duration = Math.random() * 6 + 4
          const delay    = Math.random() * 8

          return (
            <div
              key={colIndex}
              style={{
                display:       'flex',
                flexDirection: 'column',
                gap:           '4px',
                animation:     `matrix-fall ${duration}s linear ${delay}s infinite`,
                willChange:    'transform',
              }}
            >
              {Array.from({ length: numChars }).map((_, charIndex) => (
                <span
                  key={charIndex}
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize:   '13px',
                    color:      '#fff',
                    opacity:    Math.random() * 0.2 + 0.05,
                    lineHeight: '1.4',
                  }}
                >
                  {chars[Math.floor(Math.random() * chars.length)]}
                </span>
              ))}
            </div>
          )
        })}
      </div>
    </>
  )
}