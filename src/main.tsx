import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Env-Var Validierung
const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'] as const
for (const key of required) {
  if (!import.meta.env[key]) {
    console.warn(`[config] Fehlende Umgebungsvariable: ${key}`)
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
