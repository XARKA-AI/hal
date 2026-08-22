import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/poppins/latin-400.css'
import '@fontsource/poppins/latin-600.css'
import '@fontsource/poppins/latin-700.css'
import './index.css'
import App from './App.tsx'

// Pair with the build-time `media=print` stylesheet rewrite in vite.config.ts.
for (const link of document.querySelectorAll<HTMLLinkElement>('link[data-css="all"]')) {
  link.media = 'all'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
