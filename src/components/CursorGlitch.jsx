import { useEffect, useRef } from 'react'

export default function CursorGlitch() {
  const mousePos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY }

      // cursor trail dot
      const dot = document.createElement('div')
      dot.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: 4px;
        height: 4px;
        background: white;
        border-radius: 50%;
        pointer-events: none;
        z-index: 99997;
        transform: translate(-50%, -50%);
        opacity: 0.6;
        transition: opacity 0.5s ease, transform 0.5s ease;
      `
      document.body.appendChild(dot)
      requestAnimationFrame(() => {
        setTimeout(() => {
          dot.style.opacity = '0'
          dot.style.transform = 'translate(-50%, -50%) scale(0.1)'
          setTimeout(() => dot.remove(), 500)
        }, 30)
      })
    }

    const spawnGlitch = (x, y, count = 1) => {
      for (let i = 0; i < count; i++) {
        const el  = document.createElement('div')
        const w   = Math.random() * 70 + 8
        const h   = Math.random() * 3 + 1
        const ox  = (Math.random() - 0.5) * 100
        const oy  = (Math.random() - 0.5) * 100
        const op  = Math.random() * 0.55 + 0.15
        const dur = Math.random() * 120 + 60

        el.style.cssText = `
          position: fixed;
          left: ${x + ox}px;
          top: ${y + oy}px;
          width: ${w}px;
          height: ${h}px;
          background: white;
          opacity: ${op};
          pointer-events: none;
          z-index: 99998;
          transform: translateX(${(Math.random() - 0.5) * 12}px);
          transition: opacity ${dur}ms ease;
        `
        document.body.appendChild(el)
        requestAnimationFrame(() => {
          setTimeout(() => {
            el.style.opacity = '0'
            setTimeout(() => el.remove(), dur)
          }, dur * 0.4)
        })
      }

      if (Math.random() > 0.6) {
        const chars = '01アイウエオ#@!%X'
        const txt   = Array.from({ length: Math.floor(Math.random() * 5 + 2) })
          .map(() => chars[Math.floor(Math.random() * chars.length)])
          .join('')

        const tel = document.createElement('div')
        tel.innerText = txt
        tel.style.cssText = `
          position: fixed;
          left: ${x + (Math.random() - 0.5) * 90}px;
          top: ${y + (Math.random() - 0.5) * 90}px;
          color: white;
          font-family: 'Share Tech Mono', monospace;
          font-size: ${Math.random() * 8 + 7}px;
          opacity: ${Math.random() * 0.5 + 0.2};
          pointer-events: none;
          z-index: 99998;
          white-space: nowrap;
          transition: opacity 120ms ease;
        `
        document.body.appendChild(tel)
        setTimeout(() => {
          tel.style.opacity = '0'
          setTimeout(() => tel.remove(), 120)
        }, 100)
      }
    }

    const ambientInterval = setInterval(() => {
      if (Math.random() > 0.55) {
        spawnGlitch(
          mousePos.current.x,
          mousePos.current.y,
          Math.floor(Math.random() * 2) + 1
        )
      }
    }, 280)

    const handleClick = (e) => {
      spawnGlitch(e.clientX, e.clientY, 10)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
      clearInterval(ambientInterval)
    }
  }, [])

  return null
}