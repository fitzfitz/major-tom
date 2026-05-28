import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

const emptyForm = {
  name: '',
  repoUrl: '',
  defaultBranch: 'main',
  techStack: '',
  validationCommands: 'npm run lint\nnpm run build',
  forbiddenPaths: '.env\n.env.*',
  highRiskPaths: 'auth\ndatabase migrations\ndeployment',
}

function App() {
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? projects[0] ?? null,
    [projects, selectedProjectId],
  )

  async function loadProjects() {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`${apiBaseUrl}/api/projects`)

      if (!response.ok) {
        throw new Error('Unable to load projects')
      }

      const data = await response.json()
      setProjects(data.projects ?? [])
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`${apiBaseUrl}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message ?? 'Unable to create project')
      }

      setProjects((current) => [data.project, ...current])
      setSelectedProjectId(data.project.id)
      setForm(emptyForm)
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Major Tom</p>
        <h1>Project registry is online.</h1>
        <p className="lede">
          Register Git-based projects with their repository URL, default branch, validation commands, and safety rules.
        </p>
      </section>

      <section className="grid">
        <form className="card form" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow">New project</p>
            <h2>Register a project</h2>
          </div>

          <label>
            Project name
            <input
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="RuangRapi"
            />
          </label>

          <label>
            Repository URL
            <input
              value={form.repoUrl}
              onChange={(event) => updateField('repoUrl', event.target.value)}
              placeholder="https://github.com/owner/repo.git"
            />
          </label>

          <label>
            Default branch
            <input
              value={form.defaultBranch}
              onChange={(event) => updateField('defaultBranch', event.target.value)}
              placeholder="main"
            />
          </label>

          <label>
            Tech stack
            <textarea
              value={form.techStack}
              onChange={(event) => updateField('techStack', event.target.value)}
              placeholder="React, TypeScript, Vite, Supabase"
            />
          </label>

          <label>
            Validation commands
            <textarea
              value={form.validationCommands}
              onChange={(event) => updateField('validationCommands', event.target.value)}
            />
          </label>

          <label>
            Forbidden paths
            <textarea
              value={form.forbiddenPaths}
              onChange={(event) => updateField('forbiddenPaths', event.target.value)}
            />
          </label>

          <label>
            High-risk paths
            <textarea
              value={form.highRiskPaths}
              onChange={(event) => updateField('highRiskPaths', event.target.value)}
            />
          </label>

          {error ? <p className="error">{error}</p> : null}

          <button disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Registering...' : 'Register project'}
          </button>
        </form>

        <section className="card">
          <div>
            <p className="eyebrow">Registry</p>
            <h2>Projects</h2>
          </div>

          {isLoading ? <p className="muted">Loading projects...</p> : null}

          {!isLoading && projects.length === 0 ? (
            <p className="muted">No projects registered yet.</p>
          ) : null}

          <div className="project-list">
            {projects.map((project) => (
              <button
                className={project.id === selectedProject?.id ? 'project active' : 'project'}
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                type="button"
              >
                <strong>{project.name}</strong>
                <span>{project.repoUrl}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="card detail-card">
          <div>
            <p className="eyebrow">Detail</p>
            <h2>{selectedProject ? selectedProject.name : 'No project selected'}</h2>
          </div>

          {selectedProject ? (
            <dl className="details">
              <dt>Repository</dt>
              <dd>{selectedProject.repoUrl}</dd>

              <dt>Default branch</dt>
              <dd>{selectedProject.defaultBranch}</dd>

              <dt>Tech stack</dt>
              <dd>{selectedProject.techStack || 'Not specified'}</dd>

              <dt>Validation commands</dt>
              <dd>{selectedProject.validationCommands.join(', ') || 'None'}</dd>

              <dt>Forbidden paths</dt>
              <dd>{selectedProject.forbiddenPaths.join(', ') || 'None'}</dd>

              <dt>High-risk paths</dt>
              <dd>{selectedProject.highRiskPaths.join(', ') || 'None'}</dd>
            </dl>
          ) : (
            <p className="muted">Select or create a project to see its registry details.</p>
          )}
        </section>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
