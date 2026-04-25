import { useEffect, useState } from 'react'

export default function EyeTransition({ onComplete }) {
  const [phase, setPhase] = useState('fadein')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('lookleft'),  600)
    const t2 = setTimeout(() => setPhase('lookright'), 1100)
    const t3 = setTimeout(() => setPhase('center'),    1600)
    const t4 = setTimeout(() => setPhase('blink'),     2000)
    const t5 = setTimeout(() => setPhase('open'),  2350)
const t6 = setTimeout(() => setPhase('zoom'),  3000)  // was 2700
const t7 = setTimeout(() => setPhase('white'), 3500)  // was 3200
const t8 = setTimeout(() => setPhase('fadeout'), 3900) // was 3600
const t9 = setTimeout(() => onComplete(), 4500)        // was 3900
    return () => [t1,t2,t3,t4,t5,t6,t7,t8,t9].forEach(clearTimeout)
  }, [])

  const blinking = phase === 'blink'
  const zooming  = phase === 'zoom' || phase === 'white' || phase === 'fadeout'
  const isWhite  = phase === 'white' || phase === 'fadeout'
 const showText = phase === 'open' || phase === 'zoom' || phase === 'white'

  const pupilX = phase === 'lookleft'  ? '42px'
               : phase === 'lookright' ? '78px'
               : '60px'

  const irisX  = phase === 'lookleft'  ? '46px'
               : phase === 'lookright' ? '74px'
               : '60px'

  return (
    <div style={{
      position:        'fixed',
      inset:           0,
      zIndex:          9999,
      display:         'flex',
      flexDirection:   'column',
      alignItems:      'center',
      justifyContent:  'center',
      marginTop:       '-10vh',
      backgroundColor: isWhite ? '#fff' : '#000',
      opacity:         phase === 'fadeout' ? 0 : 1,
      transition:      isWhite
                         ? 'background-color 0.4s ease'
                         : phase === 'fadeout'
                         ? 'opacity 0.4s ease'
                         : 'none',
      overflow:        'hidden',
    }}>

      <svg
        width="130"
        height="70"
        viewBox="0 0 120 60"
        style={{
          opacity:    phase === 'fadein' ? 0 : 1,
          transform:  phase === 'fadein' ? 'scale(0.7)' : 'scale(1)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
          overflow:   'visible',
        }}
      >
        {/* White almond eye shape */}
        <path
          d="M60,6 Q90,2 114,30 Q90,58 60,58 Q30,58 6,30 Q30,2 60,6 Z"
          fill="white"
        />

        {/* Angry brow cut */}
        <path
          d="M6,30 Q30,2 60,6 Q90,2 114,30 Q100,18 60,20 Q20,18 6,30 Z"
          fill="black"
        />

        {/* Iris */}
        <circle
          cx={irisX}
          cy="32"
          r="16"
          fill="black"
          style={{ transition: 'cx 0.3s ease' }}
        />

        {/* White pupil */}
        <circle
          cx={pupilX}
          cy="32"
          r="8"
          fill="white"
          style={{
            transformOrigin: `${pupilX} 32px`,
            transform:  zooming ? 'scale(150)' : 'scale(1)',
            transition: zooming
              ? 'transform 0.8s cubic-bezier(0.2, 0, 0.8, 1)'
              : 'cx 0.3s ease',
          }}
        />

        {/* Top eyelid */}
        <path
          d="M60,6 Q90,2 114,30 Q60,30 6,30 Q30,2 60,6 Z"
          fill="black"
          style={{
            transformOrigin: '60px 6px',
            transform:  blinking ? 'scaleY(1)' : 'scaleY(0)',
            transition: blinking
              ? 'transform 0.18s ease-in'
              : 'transform 0.22s ease-out',
          }}
        />

        {/* Bottom eyelid */}
        <path
          d="M6,30 Q30,58 60,58 Q90,58 114,30 Q60,30 6,30 Z"
          fill="black"
          style={{
            transformOrigin: '60px 58px',
            transform:  blinking ? 'scaleY(1)' : 'scaleY(0)',
            transition: blinking
              ? 'transform 0.18s ease-in'
              : 'transform 0.22s ease-out',
          }}
        />
      </svg>

      {/* Text below eye */}
      <div style={{
        marginTop:   '30px',
        fontFamily:  "'Share Tech Mono', monospace",
        fontSize:    '0.85rem',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        color:       isWhite ? '#ffffff' : '#fff',
        opacity:     showText ? 1 : 0,
        transform:   showText ? 'translateY(0px)' : 'translateY(10px)',
        transition:  'opacity 0.5s ease, transform 0.5s ease',
      }}>
        Don't let them see you
      </div>

    </div>
  )
}