import { useEffect, useState } from 'react'

export default function StabTransition({ onComplete }) {
  const [phase, setPhase] = useState('fadein')

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('drop'),    500),
      setTimeout(() => setPhase('impact'),  700),
      setTimeout(() => setPhase('bleed'),   960),
      setTimeout(() => setPhase('close'),   1400),
      setTimeout(() => setPhase('fadeout'), 1900),
      setTimeout(() => onComplete(),        2200),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const landed    = ['impact','bleed','close','fadeout'].includes(phase)
  const bleeding  = ['bleed','close','fadeout'].includes(phase)
  const closing   = ['close','fadeout'].includes(phase)
  const showText  = ['bleed','close'].includes(phase)
  const knifeGone = ['close','fadeout'].includes(phase)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#000',
      opacity: phase === 'fadeout' ? 0 : 1,
      transition: phase === 'fadeout' ? 'opacity 0.4s ease' : 'none',
    }}>

      <style>{`
        @keyframes stab-shake {
          0%,100% { transform: translate(0,0); }
          20%     { transform: translate(-7px, 5px); }
          40%     { transform: translate(7px, -5px); }
          60%     { transform: translate(-5px, 7px); }
          80%     { transform: translate(4px, -3px); }
        }
        @keyframes impact-flash {
          0%   { opacity: 0; }
          25%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes drip-a {
          from { stroke-dashoffset: 40; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes drip-b {
          from { stroke-dashoffset: 30; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes drip-c {
          from { stroke-dashoffset: 24; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes drip-drop-a {
          0%   { cy: 80px; r: 3px; opacity: 1; }
          100% { cy: 105px; r: 2px; opacity: 0; }
        }
        @keyframes pool-grow {
          from { rx: 0; ry: 0; opacity: 0; }
          to   { rx: 22px; ry: 5px; opacity: 0.7; }
        }
      `}</style>

      {/* Scene wrapper */}
      <div style={{
        position: 'relative',
        width: '220px', height: '220px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: phase === 'impact' ? 'stab-shake 0.25s ease' : 'none',
      }}>

        {/* Impact flash */}
        {phase === 'impact' && (
          <div style={{
            position: 'absolute', inset: '-20px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 60%)',
            animation: 'impact-flash 0.25s ease forwards',
            zIndex: 20, pointerEvents: 'none',
          }}/>
        )}

        {/* ── KNIFE (pure white drawn style) ── */}
        <svg
          width="28" height="100"
          viewBox="0 0 28 100"
          style={{
  position: 'absolute',
  top: (phase === 'fadein') ? '-140px' : landed ? '60px' : '-140px',
  left: '52%',
  transform: 'translateX(-50%) rotate(12deg) scaleY(-1)',
  transformOrigin: '50% 50%',
  transition: phase === 'drop'
    ? 'top 0.13s cubic-bezier(0.05, 0, 0.9, 1)'
    : knifeGone
    ? 'top 0.3s ease, opacity 0.25s ease'
    : 'none',
  opacity: phase === 'fadein' ? 0 : knifeGone ? 0 : 1,
  zIndex: 16,
}}
        >
          {/* All white, no fill — drawn look */}
          {/* Blade outline */}
          <polyline
            points="14,2 20,52 8,52 14,2"
            fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"
          />
          {/* Blade edge line (single edge) */}
          <line x1="14" y1="2" x2="20" y2="52"
            stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.4"
          />
          {/* Guard */}
          <rect x="5" y="52" width="18" height="4" rx="1"
            fill="none" stroke="white" strokeWidth="1.5"
          />
          {/* Handle outline */}
          <rect x="8" y="56" width="12" height="34" rx="2"
            fill="none" stroke="white" strokeWidth="1.5"
          />
          {/* Handle wrap lines */}
          <line x1="8" y1="64" x2="20" y2="64" stroke="white" strokeWidth="1" opacity="0.5"/>
          <line x1="8" y1="72" x2="20" y2="72" stroke="white" strokeWidth="1" opacity="0.5"/>
          <line x1="8" y1="80" x2="20" y2="80" stroke="white" strokeWidth="1" opacity="0.5"/>
          {/* Pommel */}
          <rect x="6" y="90" width="16" height="6" rx="2"
            fill="none" stroke="white" strokeWidth="1.5"
          />
        </svg>

        {/* ── EYE ── */}
        <svg
          width="150" height="90"
          viewBox="0 0 120 70"
          style={{
            position: 'relative', zIndex: 10,
            opacity: phase === 'fadein' ? 0 : 1,
            transform: phase === 'fadein' ? 'scale(0.7)' : 'scale(1)',
            transition: phase === 'fadein'
              ? 'opacity 0.45s ease, transform 0.45s ease'
              : 'none',
            overflow: 'visible',
          }}
        >
          {/* Eyeball */}
          <path
            d="M60,6 Q90,2 114,30 Q90,58 60,58 Q30,58 6,30 Q30,2 60,6 Z"
            fill="white"
            style={{ opacity: closing ? 0.1 : 1, transition: 'opacity 0.4s ease' }}
          />
          {/* Brow shadow */}
          <path
            d="M6,30 Q30,2 60,6 Q90,2 114,30 Q100,18 60,20 Q20,18 6,30 Z"
            fill="black"
          />
          {/* Iris */}
          <circle cx="60" cy="32" r="16" fill="black"
            style={{ opacity: closing ? 0.1 : 1, transition: 'opacity 0.4s ease' }}
          />
          {/* Pupil */}
          <circle cx="60" cy="32" r="8" fill="white"
            style={{ opacity: closing ? 0.1 : 1, transition: 'opacity 0.4s ease' }}
          />

          {/* Upper lid closing */}
          <path
            d="M60,6 Q90,2 114,30 Q60,30 6,30 Q30,2 60,6 Z"
            fill="black"
            style={{
              transformOrigin: '60px 6px',
              transform: closing ? 'scaleY(1)' : 'scaleY(0)',
              transition: closing ? 'transform 0.42s ease-in' : 'none',
            }}
          />
          {/* Lower lid closing */}
          <path
            d="M6,30 Q30,58 60,58 Q90,58 114,30 Q60,30 6,30 Z"
            fill="black"
            style={{
              transformOrigin: '60px 58px',
              transform: closing ? 'scaleY(1)' : 'scaleY(0)',
              transition: closing ? 'transform 0.42s ease-in' : 'none',
            }}
          />

          {/* ── BLOOD DRIPS from eye bottom ── */}
          {bleeding && (
            <>
              {/* Drip 1 — thick center */}
              <line
                x1="58" y1="57" x2="54" y2="97"
                stroke="white" strokeWidth="2.8" strokeLinecap="round"
                strokeDasharray="42"
                style={{ animation: 'drip-a 0.35s ease forwards' }}
              />
              {/* Drip 2 — left */}
              <line
                x1="42" y1="52" x2="38" y2="82"
                stroke="white" strokeWidth="2" strokeLinecap="round"
                strokeDasharray="32"
                style={{ animation: 'drip-b 0.3s ease 0.08s both' }}
              />
              {/* Drip 3 — right */}
              <line
                x1="75" y1="53" x2="78" y2="79"
                stroke="white" strokeWidth="1.6" strokeLinecap="round"
                strokeDasharray="28"
                style={{ animation: 'drip-c 0.28s ease 0.15s both' }}
              />
              {/* Drip 4 — far left thin */}
              <line
                x1="28" y1="44" x2="24" y2="64"
                stroke="white" strokeWidth="1.2" strokeLinecap="round"
                strokeDasharray="22"
                style={{ animation: 'drip-c 0.22s ease 0.22s both' }}
              />

              {/* Blood pool at bottom */}
              <ellipse
                cx="56" cy="100" rx="0" ry="0"
                fill="white" opacity="0"
                style={{ animation: 'pool-grow 0.4s ease 0.3s forwards' }}
              />
            </>
          )}
        </svg>
      </div>

      {/* Text */}
      <div style={{
        marginTop: '40px',
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '0.85rem',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        color: '#fff',
        opacity: showText ? 1 : 0,
        transform: showText ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}>
        Identity concealed
      </div>

    </div>
  )
}