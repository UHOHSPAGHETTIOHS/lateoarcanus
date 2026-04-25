import { useEffect, useRef } from 'react'

export default function DNABackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    let scrollY = 0

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', () => { scrollY = window.scrollY })

    // particles
    const particles = Array.from({ length: 60 }, () => ({
      x:       Math.random() * window.innerWidth,
      y:       Math.random() * window.innerHeight,
      radius:  Math.random() * 1.2 + 0.4,
      speedX:  (Math.random() - 0.5) * 0.2,
      speedY:  (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.12 + 0.03,
    }))

    const DNA_WIDTH = 90
    const SPACING   = 24
    const RUNGS     = 50

    let time = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const cx = canvas.width / 2

      // DNA
      for (let i = 0; i < RUNGS; i++) {
        const y = ((i * SPACING + time * 0.6 + scrollY * 0.3) % (canvas.height + SPACING * 2)) - SPACING
        const angle  = i * 0.22 + time * 0.012
        const x1     = cx + Math.sin(angle) * DNA_WIDTH
        const x2     = cx - Math.sin(angle) * DNA_WIDTH
        const depth  = (Math.sin(angle) + 1) / 2

        // left node
        ctx.beginPath()
        ctx.arc(x1, y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${0.1 + depth * 0.15})`
        ctx.fill()

        // right node
        ctx.beginPath()
        ctx.arc(x2, y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${0.1 + (1 - depth) * 0.15})`
        ctx.fill()

        // rung
        ctx.beginPath()
        ctx.moveTo(x1, y)
        ctx.lineTo(x2, y)
        ctx.strokeStyle = `rgba(255,255,255,${0.03 + Math.abs(Math.cos(angle)) * 0.07})`
        ctx.lineWidth = 0.7
        ctx.stroke()

        // strand lines to next rung
        if (i < RUNGS - 1) {
          const nextY    = ((( i + 1) * SPACING + time * 0.6 + scrollY * 0.3) % (canvas.height + SPACING * 2)) - SPACING
          const nextAngle = (i + 1) * 0.22 + time * 0.012
          const nextX1   = cx + Math.sin(nextAngle) * DNA_WIDTH
          const nextX2   = cx - Math.sin(nextAngle) * DNA_WIDTH

          ctx.beginPath()
          ctx.moveTo(x1, y)
          ctx.lineTo(nextX1, nextY)
          ctx.strokeStyle = `rgba(255,255,255,0.07)`
          ctx.lineWidth = 0.8
          ctx.stroke()

          ctx.beginPath()
          ctx.moveTo(x2, y)
          ctx.lineTo(nextX2, nextY)
          ctx.strokeStyle = `rgba(255,255,255,0.07)`
          ctx.lineWidth = 0.8
          ctx.stroke()
        }
      }

      // particles
      particles.forEach(p => {
        p.x += p.speedX
        p.y += p.speedY
        if (p.x < 0)             p.x = canvas.width
        if (p.x > canvas.width)  p.x = 0
        if (p.y < 0)             p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`
        ctx.fill()
      })

      time++
      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
  <canvas
    ref={canvasRef}
    style={{
      position:      'fixed',
      top:           0,
      left:          0,
      width:         '100%',
      height:        '100%',
      zIndex:        -1,
      pointerEvents: 'none',
      display:       'block',
    }}
  />
)
}