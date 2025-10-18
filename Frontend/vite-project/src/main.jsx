import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import TeamModal from './teamModal.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <TeamModal />
  </StrictMode>,
)
