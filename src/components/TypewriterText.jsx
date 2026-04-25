import { useEffect, useState } from 'react'

export default function TypewriterText({ text, style = {}, speed = 38, tag = 'h1' }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        setDone(true)
        clearInterval(interval)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text])

  const Tag = tag

  return (
    <Tag style={style}>
      {displayed}
      {!done && (
        <span style={{ animation: 'blink-cursor 0.7s step-end infinite' }}>█</span>
      )}
    </Tag>
  )
}