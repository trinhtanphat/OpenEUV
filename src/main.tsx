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
import './v2-fab.css'
import './completion.css'
import './fourier.css'
import './education-v4.css'
import './fab-v4.css'
import './search.css'
import './provenance-v5.css'
import './vacuum-v5.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
