import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import BootSequence from './components/BootSequence'
import ScanlineOverlay from './components/ScanlineOverlay'
import MatrixRain from './components/MatrixRain'
import './App.css'

function App() {
  const [session, setSession]       = useState(null)
  const [showSignup, setShowSignup] = useState(false)
  const [loading, setLoading]       = useState(true)
  const [booting, setBooting]       = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
      if (data.session && !sessionStorage.getItem('booted')) {
        setBooting(true)
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session && !sessionStorage.getItem('booted')) {
        setBooting(true)
      }
    })
  }, [])

  const handleBootComplete = () => {
    sessionStorage.setItem('booted', 'true')
    setBooting(false)
  }

  if (loading) return (
    <div style={{
      background: '#000',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#333',
      fontFamily: "'Share Tech Mono', monospace"
    }}>
      ...
    </div>
  )

  return (
    <>
      {/* These sit at root level, never trapped by stacking contexts */}
      <MatrixRain />
      <ScanlineOverlay />

      {booting && <BootSequence onComplete={handleBootComplete} />}

      {!booting && (
        session
          ? <Dashboard />
          : showSignup
            ? <Signup onSwitch={() => setShowSignup(false)} />
            : <Login onSwitch={() => setShowSignup(true)} />
      )}
    </>
  )
}

export default App