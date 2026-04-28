import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import SecureNotePage from './pages/SecureNotePage'
import './index.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/secure-note/:id" element={<SecureNotePage />} />
      <Route path="*" element={<App />} />
    </Routes>
  </BrowserRouter>
)