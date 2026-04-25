import { useEffect, useState } from 'react'

export default function PageGlitch({ onComplete }) {
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setGone(true),   280)
    const t2 = setTimeout(() => onComplete(),    380)
    return () => [t1, t2].forEach(clearTimeout)
  }, [])

  if (gone) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9998,
      pointerEvents: 'none',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes pg-flash {
          0%   { opacity: 0.5; }
          100% { opacity: 0; }
        }
        @keyframes pg-bar1 {
          0%   { transform: translateX(0px);   opacity: 0.8; clip-path: inset(8%  0 78% 0); }
          30%  { transform: translateX(-18px); opacity: 0.9; }
          60%  { transform: translateX(12px);  opacity: 0.7; }
          100% { transform: translateX(0px);   opacity: 0;   clip-path: inset(8%  0 78% 0); }
        }
        @keyframes pg-bar2 {
          0%   { transform: translateX(0px);  opacity: 0.7; clip-path: inset(35% 0 45% 0); }
          30%  { transform: translateX(22px); opacity: 0.8; }
          60%  { transform: translateX(-9px); opacity: 0.6; }
          100% { transform: translateX(0px);  opacity: 0;   clip-path: inset(35% 0 45% 0); }
        }
        @keyframes pg-bar3 {
          0%   { transform: translateX(0px);   opacity: 0.8; clip-path: inset(65% 0 15% 0); }
          30%  { transform: translateX(-12px); opacity: 0.9; }
          60%  { transform: translateX(16px);  opacity: 0.7; }
          100% { transform: translateX(0px);   opacity: 0;   clip-path: inset(65% 0 15% 0); }
        }
        @keyframes pg-noise {
          0%   { opacity: 0.06; transform: translate(0px, 0px); }
          20%  { opacity: 0.09; transform: translate(-2px, 1px); }
          40%  { opacity: 0.05; transform: translate(2px, -1px); }
          60%  { opacity: 0.08; transform: translate(-1px, 2px); }
          80%  { opacity: 0.04; transform: translate(1px, -2px); }
          100% { opacity: 0;    transform: translate(0px, 0px); }
        }
      `}</style>

      {/* Flash */}
      <div style={{
        position: 'absolute', inset: 0,
        background: '#fff',
        animation: 'pg-flash 0.28s ease forwards',
      }}/>

      {/* Glitch bars */}
      <div style={{
        position: 'absolute', inset: 0,
        background: '#fff',
        animation: 'pg-bar1 0.28s steps(3) forwards',
      }}/>
      <div style={{
        position: 'absolute', inset: 0,
        background: '#fff',
        animation: 'pg-bar2 0.28s steps(3) forwards 0.03s',
      }}/>
      <div style={{
        position: 'absolute', inset: 0,
        background: '#fff',
        animation: 'pg-bar3 0.28s steps(3) forwards 0.06s',
      }}/>

      {/* Noise overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
        animation: 'pg-noise 0.28s steps(3) forwards',
      }}/>
    </div>
  )
}