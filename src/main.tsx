import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { registerOfflineShell } from './offline'
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
import './learning-checkpoints.css'
import './v6.css'
import './v7.css'
import './source-library.css'
import './literature-v8.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if (import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void registerOfflineShell().catch((error) => console.warn('OpenEUV offline shell registration failed', error))
  }, { once: true })
}
