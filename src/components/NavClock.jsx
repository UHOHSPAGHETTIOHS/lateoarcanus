import { useEffect, useState } from 'react'

export default function NavClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <span style={{
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: '0.7rem',
      color: '#333',
      letterSpacing: '2px',
    }}>
      SYS {pad(time.getHours())}:{pad(time.getMinutes())}:{pad(time.getSeconds())}
    </span>
  )
}