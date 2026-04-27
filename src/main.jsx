import { createRoot } from 'react-dom/client'
import App from './App'
import SecureNotePage from './pages/SecureNotePage'
import './index.css'

const path = window.location.pathname

// If this is a secure note link, render the secure note page
if (path.startsWith('/secure-note/')) {
  createRoot(document.getElementById('root')).render(<SecureNotePage />)
} else {
  createRoot(document.getElementById('root')).render(<App />)
}