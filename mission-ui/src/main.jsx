import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

const projectFormDefaults = {
  name: '',
  repoUrl: '',
  defaultBranch: 'main',
  techStack: '',
  validationCommands: 'npm run lint\nnpm run build',
  forbiddenPaths: '.env\n.env.*',
  highRiskPaths: 'auth\ndatabase migrations\ndeployment',
}

const taskFormDefaults = {
  title: '',
  description: '',
  type: 'implementation',
  priority: 'medium',
  riskLevel: 'low',
  acceptanceCriteria: '',
}

const boardColumns = ['IDEA', 'BACKLOG_CANDIDATE', 'READY', 'DESIGN_IN_PROGRESS', 'DESIGN_REVIEW', 'CODE_READY', 'CODE_IN_PROGRESS', 'TEST_IN_PROGRESS', 'QA_REVIEW', 'PR_READY', 'DONE', 'BLOCKED']
const defaultAgentTypes = ['market-research', 'planner', 'design', 'code', 'test', 'qa', 'pr']

function formatStatus(status) {
  return String(status ?? '').toLowerCase().replaceAll('_', ' ')
}

function App() {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [agentTypes, setAgentTypes] = useState(defaultAgentTypes)
  const [allowedTransitions, setAllowedTransitions] = useState({})
  const [allowedAgentStatuses, setAllowedAgentStatuses] = useState({})
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [projectForm, setProjectForm] = useState(projectFormDefaults)
  const [taskForm, setTaskForm] = useState(taskFormDefaults)
  const [approvalName, setApprovalName] = useState('local-owner')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? projects[0] ?? null,
    [projects, selectedProjectId],
  )

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? tasks[0] ?? null,
    [tasks, selectedTaskId],
  )

  const tasksByStatus = useMemo(() => {
    return boardColumns.reduce((result, status) => {
      result[status] = tasks.filter((task) => task.status === status)
      return result
    }, {})
  }, [tasks])

  async function loadProjects() {
    const response = await fetch(`${apiBaseUrl}/api/projects`)
    if (!response.ok) throw new Error('Unable to load projects')
    const data = await response.json()
    setProjects(data.projects ?? [])
    setSelectedProjectId((current) => current ?? data.projects?.[0]?.id ?? null)
  }

  async function loadTasks(projectId = selectedProjectId) {
    const query = projectId ? `?projectId=${projectId}` : ''
    const response = await fetch(`${apiBaseUrl}/api/tasks${query}`)
    if (!response.ok) throw new Error('Unable to load tasks')
    const data = await response.json()
    setTasks(data.tasks ?? [])
    setSelectedTaskId((current) => current ?? data.tasks?.[0]?.id ?? null)
  }

  async function loadStatuses() {
    const response = await fetch(`${apiBaseUrl}/api/task-statuses`)
    if (!response.ok) throw new Error('Unable to load task statuses')
    const data = await response.json()
    setAllowedTransitions(data.allowedTransitions ?? {})
  }

  async function loadAgentTypes() {
    const response = await fetch(`${apiBaseUrl}/api/agent-types`)
    if (!response.ok) throw new Error('Unable to load agent types')
    const data = await response.json()
    setAgentTypes(data.agentTypes ?? defaultAgentTypes)
    setAllowedAgentStatuses(data.allowedAgentStatuses ?? {})
  }

  async function loadInitialData() {
    setIsLoading(true)
    setError('')
    try {
      await Promise.all([loadProjects(), loadStatuses(), loadAgentTypes()])
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (!selectedProjectId) return
    loadTasks(selectedProjectId).catch((loadError) => setError(loadError.message))
  }, [selectedProjectId])

  function updateProjectField(field, value) {
    setProjectForm((current) => ({ ...current, [field]: value }))
  }

  function updateTaskField(field, value) {
    setTaskForm((current) => ({ ...current, [field]: value }))
  }

  async function handleProjectSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      const response = await fetch(`${apiBaseUrl}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectForm),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message ?? 'Unable to create project')
      setProjects((current) => [data.project, ...current])
      setSelectedProjectId(data.project.id)
      setProjectForm(projectFormDefaults)
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleTaskSubmit(event) {
    event.preventDefault()
    if (!selectedProject) return
    setIsSubmitting(true)
    setError('')
    try {
      const response = await fetch(`${apiBaseUrl}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...taskForm, projectId: selectedProject.id }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message ?? 'Unable to create task')
      setTasks((current) => [data.task, ...current])
      setSelectedTaskId(data.task.id)
      setTaskForm(taskFormDefaults)
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function transitionTask(task, toStatus) {
    setError('')
    try {
      const response = await fetch(`${apiBaseUrl}/api/tasks/${task.id}/transitions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toStatus,
          approvedBy: approvalName,
          note: `Moved to ${toStatus} from the local mission control UI.`,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message ?? 'Unable to transition task')
      setTasks((current) => current.map((item) => (item.id === data.task.id ? data.task : item)))
      setSelectedTaskId(data.task.id)
    } catch (transitionError) {
      setError(transitionError.message)
    }
  }

  async function runAgent(task, agentType) {
    setError('')
    try {
      const response = await fetch(`${apiBaseUrl}/api/tasks/${task.id}/agent-runs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentType }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message ?? 'Unable to run agent')
      setTasks((current) => current.map((item) => (item.id === data.task.id ? data.task : item)))
      setSelectedTaskId(data.task.id)
    } catch (agentError) {
      setError(agentError.message)
    }
  }

  function canRunAgent(task, agentType) {
    return (allowedAgentStatuses[agentType] ?? []).includes(task.status)
  }

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Major Tom</p>
        <h1>Agent run framework is online.</h1>
        <p className="lede">
          Trigger safe deterministic agent runs, inspect outputs, and keep every run tied to a task record.
        </p>
      </section>

      {error ? <p className="error global-error">{error}</p> : null}

      <section className="grid control-grid">
        <form className="card form" onSubmit={handleProjectSubmit}>
          <div><p className="eyebrow">Project registry</p><h2>Register a project</h2></div>
          <label>Project name<input value={projectForm.name} onChange={(event) => updateProjectField('name', event.target.value)} /></label>
          <label>Repository URL<input value={projectForm.repoUrl} onChange={(event) => updateProjectField('repoUrl', event.target.value)} /></label>
          <label>Default branch<input value={projectForm.defaultBranch} onChange={(event) => updateProjectField('defaultBranch', event.target.value)} /></label>
          <label>Tech stack<textarea value={projectForm.techStack} onChange={(event) => updateProjectField('techStack', event.target.value)} /></label>
          <button disabled={isSubmitting} type="submit">Register project</button>
        </form>

        <form className="card form" onSubmit={handleTaskSubmit}>
          <div><p className="eyebrow">Task intake</p><h2>Create a task</h2><p className="muted">Project: {selectedProject?.name ?? 'None selected'}</p></div>
          <label>Task title<input value={taskForm.title} onChange={(event) => updateTaskField('title', event.target.value)} /></label>
          <label>Description<textarea value={taskForm.description} onChange={(event) => updateTaskField('description', event.target.value)} /></label>
          <label>Risk level<select value={taskForm.riskLevel} onChange={(event) => updateTaskField('riskLevel', event.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
          <label>Acceptance criteria<textarea value={taskForm.acceptanceCriteria} onChange={(event) => updateTaskField('acceptanceCriteria', event.target.value)} /></label>
          <button disabled={isSubmitting || !selectedProject} type="submit">Create task</button>
        </form>

        <section className="card">
          <div><p className="eyebrow">Projects</p><h2>Active registry</h2></div>
          {isLoading ? <p className="muted">Loading...</p> : null}
          <div className="project-list">
            {projects.map((project) => (
              <button className={project.id === selectedProject?.id ? 'project active' : 'project'} key={project.id} onClick={() => setSelectedProjectId(project.id)} type="button">
                <strong>{project.name}</strong><span>{project.repoUrl}</span>
              </button>
            ))}
          </div>
        </section>
      </section>

      <section className="approval-bar card">
        <label>Approval name<input value={approvalName} onChange={(event) => setApprovalName(event.target.value)} /></label>
        <p className="muted">Approval-gated transitions require this value before the API allows the move.</p>
      </section>

      <section className="board">
        {boardColumns.map((status) => (
          <div className="column" key={status}>
            <h3>{formatStatus(status)}</h3>
            <div className="task-stack">
              {(tasksByStatus[status] ?? []).map((task) => (
                <article className="task-card" key={task.id}>
                  <button className="task-title" onClick={() => setSelectedTaskId(task.id)} type="button">{task.title}</button>
                  <p>{task.description || 'No description.'}</p>
                  <span className={`badge ${task.riskLevel}`}>{task.riskLevel} risk</span>
                  <div className="transition-row">
                    {(allowedTransitions[task.status] ?? []).map((target) => <button key={target} onClick={() => transitionTask(task, target)} type="button">{formatStatus(target)}</button>)}
                  </div>
                  <div className="agent-row">
                    {agentTypes.map((agentType) => (
                      <button disabled={!canRunAgent(task, agentType)} key={agentType} onClick={() => runAgent(task, agentType)} type="button">{agentType}</button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="card detail-card">
        <div><p className="eyebrow">Task detail</p><h2>{selectedTask?.title ?? 'No task selected'}</h2></div>
        {selectedTask ? (
          <div className="detail-layout">
            <dl className="details">
              <dt>Status</dt><dd>{formatStatus(selectedTask.status)}</dd>
              <dt>Risk</dt><dd>{selectedTask.riskLevel}</dd>
              <dt>Approvals</dt><dd>{selectedTask.approvals.length}</dd>
              <dt>Transitions</dt><dd>{selectedTask.transitions.length}</dd>
              <dt>Agent runs</dt><dd>{selectedTask.agentRuns.length}</dd>
            </dl>
            <div>
              <h3>Agent runs</h3>
              <ul className="history-list">
                {selectedTask.agentRuns.map((run) => (
                  <li key={run.id}>
                    <strong>{run.agentType}</strong>: {run.outputSummary ?? run.status}
                    <br />Recommended next state: {formatStatus(run.recommendedNextState ?? selectedTask.status)}
                  </li>
                ))}
              </ul>
              <h3>Transition history</h3>
              <ul className="history-list">
                {selectedTask.transitions.map((transition) => (
                  <li key={transition.id}>{formatStatus(transition.fromStatus)} → {formatStatus(transition.toStatus)}{transition.requiresApproval ? ' with approval' : ''}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : <p className="muted">Select a task to inspect agent runs and transition history.</p>}
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
