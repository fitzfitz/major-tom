import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

function App() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Major Tom</p>
        <h1>Mission control for approval-gated agent work.</h1>
        <p className="lede">
          The Phase 1 foundation is online: UI, API, PostgreSQL, and Redis are wired for the next build slices.
        </p>
        <div className="panel">
          <span>API base URL</span>
          <code>{apiBaseUrl}</code>
        </div>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
