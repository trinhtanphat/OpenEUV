import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import './research.css'
import './advanced.css'
import './depth.css'
import './v2.css'
import './v2-sim.css'
import './v2-patent.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
