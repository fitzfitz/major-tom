import cors from '@fastify/cors'
import Fastify from 'fastify'
import { randomUUID } from 'node:crypto'

const app = Fastify({ logger: true })

await app.register(cors, { origin: true })

const now = () => new Date().toISOString()

const taskStatuses = [
  'IDEA',
  'RESEARCH_REQUESTED',
  'RESEARCH_DONE',
  'BACKLOG_CANDIDATE',
  'READY',
  'DESIGN_IN_PROGRESS',
  'DESIGN_REVIEW',
  'CODE_READY',
  'CODE_IN_PROGRESS',
  'TEST_IN_PROGRESS',
  'QA_REVIEW',
  'PR_READY',
  'DONE',
  'BLOCKED',
  'CANCELLED',
]

const agentTypes = [
  'market-research',
  'planner',
  'design',
  'code',
  'test',
  'qa',
  'pr',
]

const allowedAgentStatuses = {
  'market-research': ['IDEA', 'RESEARCH_REQUESTED'],
  planner: ['RESEARCH_DONE', 'BACKLOG_CANDIDATE', 'READY'],
  design: ['READY', 'DESIGN_IN_PROGRESS', 'DESIGN_REVIEW'],
  code: ['CODE_READY', 'CODE_IN_PROGRESS'],
  test: ['CODE_IN_PROGRESS', 'TEST_IN_PROGRESS'],
  qa: ['TEST_IN_PROGRESS', 'QA_REVIEW'],
  pr: ['PR_READY'],
}

const approvalRequiredTransitions = new Set([
  'BACKLOG_CANDIDATE->READY',
  'DESIGN_REVIEW->CODE_READY',
  'QA_REVIEW->PR_READY',
  'PR_READY->DONE',
])

const allowedTransitions = {
  IDEA: ['RESEARCH_REQUESTED', 'BLOCKED', 'CANCELLED'],
  RESEARCH_REQUESTED: ['RESEARCH_DONE', 'BLOCKED', 'CANCELLED'],
  RESEARCH_DONE: ['BACKLOG_CANDIDATE', 'BLOCKED', 'CANCELLED'],
  BACKLOG_CANDIDATE: ['READY', 'BLOCKED', 'CANCELLED'],
  READY: ['DESIGN_IN_PROGRESS', 'BLOCKED', 'CANCELLED'],
  DESIGN_IN_PROGRESS: ['DESIGN_REVIEW', 'BLOCKED', 'CANCELLED'],
  DESIGN_REVIEW: ['CODE_READY', 'BLOCKED', 'CANCELLED'],
  CODE_READY: ['CODE_IN_PROGRESS', 'BLOCKED', 'CANCELLED'],
  CODE_IN_PROGRESS: ['TEST_IN_PROGRESS', 'BLOCKED', 'CANCELLED'],
  TEST_IN_PROGRESS: ['QA_REVIEW', 'BLOCKED', 'CANCELLED'],
  QA_REVIEW: ['PR_READY', 'BLOCKED', 'CANCELLED'],
  PR_READY: ['DONE', 'BLOCKED', 'CANCELLED'],
  DONE: [],
  BLOCKED: ['IDEA', 'READY', 'CANCELLED'],
  CANCELLED: [],
}

const projects = [
  {
    id: randomUUID(),
    name: 'Major Tom',
    slug: 'major-tom',
    repoUrl: 'https://github.com/fitzfitz/major-tom.git',
    defaultBranch: 'main',
    techStack: 'React, Vite, Fastify, PostgreSQL, Redis, Docker',
    validationCommands: ['docker compose up --build', 'curl http://localhost:3000/health'],
    forbiddenPaths: ['.env', '.env.*', 'production credentials'],
    highRiskPaths: ['deployment', 'auth', 'database migrations', 'billing'],
    status: 'active',
    createdAt: now(),
  },
]

const tasks = []
const taskTransitions = []
const approvals = []
const auditEvents = []
const agentRuns = []

function toSlug(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean)
  if (typeof value === 'string') return value.split('\n').map((item) => item.trim()).filter(Boolean)
  return []
}

function findProject(projectId) {
  return projects.find((item) => item.id === projectId)
}

function findTask(taskId) {
  return tasks.find((item) => item.id === taskId)
}

function transitionKey(fromStatus, toStatus) {
  return `${fromStatus}->${toStatus}`
}

function requiresApproval(fromStatus, toStatus, riskLevel) {
  return approvalRequiredTransitions.has(transitionKey(fromStatus, toStatus)) || riskLevel === 'high'
}

function recordAuditEvent(entityType, entityId, eventType, metadata = {}, actorType = 'user') {
  const event = {
    id: randomUUID(),
    entityType,
    entityId,
    eventType,
    actorType,
    actorId: actorType === 'agent' ? metadata.agentType ?? 'agent' : 'local-owner',
    metadata,
    createdAt: now(),
  }
  auditEvents.unshift(event)
  return event
}

function serializeTask(task) {
  return {
    ...task,
    transitions: taskTransitions.filter((item) => item.taskId === task.id),
    approvals: approvals.filter((item) => item.taskId === task.id),
    agentRuns: agentRuns.filter((item) => item.taskId === task.id),
    auditEvents: auditEvents.filter((item) => item.entityType === 'task' && item.entityId === task.id),
  }
}

function buildAgentOutput(agentType, task) {
  const base = {
    filesChanged: [],
    artifactsCreated: [],
    validation: 'Not run. This Phase 4 worker is deterministic and does not modify files.',
    risks: ['No real model call has been made.', 'No repository changes have been made.'],
  }

  if (agentType === 'planner') {
    return {
      ...base,
      summary: `Planner prepared a task breakdown for: ${task.title}`,
      actionsTaken: [
        'Reviewed task title and description.',
        'Prepared acceptance-criteria oriented implementation notes.',
        'Kept output scoped to planning only.',
      ],
      recommendedNextState: task.status === 'RESEARCH_DONE' ? 'BACKLOG_CANDIDATE' : task.status,
    }
  }

  if (agentType === 'design') {
    return {
      ...base,
      summary: `Design agent drafted an implementation approach for: ${task.title}`,
      actionsTaken: [
        'Reviewed task scope.',
        'Prepared UI/API impact notes.',
        'Flagged validation and manual QA expectations.',
      ],
      recommendedNextState: task.status === 'READY' ? 'DESIGN_IN_PROGRESS' : task.status,
    }
  }

  return {
    ...base,
    summary: `${agentType} agent produced a safe placeholder report for: ${task.title}`,
    actionsTaken: ['Created an agent run record.', 'Recorded a safe deterministic report.', 'Avoided external side effects.'],
    recommendedNextState: task.status,
  }
}

function completeAgentRun(run) {
  const task = findTask(run.taskId)

  if (!task) {
    run.status = 'failed'
    run.errorMessage = 'Task disappeared before agent run processing.'
    run.finishedAt = now()
    return run
  }

  const output = buildAgentOutput(run.agentType, task)
  run.status = 'completed'
  run.outputSummary = output.summary
  run.actionsTaken = output.actionsTaken
  run.filesChanged = output.filesChanged
  run.artifactsCreated = output.artifactsCreated
  run.validation = output.validation
  run.risks = output.risks
  run.recommendedNextState = output.recommendedNextState
  run.finishedAt = now()

  recordAuditEvent('task', task.id, 'agent_run.completed', {
    agentType: run.agentType,
    agentRunId: run.id,
  }, 'agent')

  return run
}

const seedTask = {
  id: randomUUID(),
  projectId: projects[0].id,
  title: 'Implement Kanban task lifecycle and approvals',
  description: 'Create the first task state machine and approval-gated Kanban workflow.',
  type: 'implementation',
  status: 'READY',
  priority: 'high',
  riskLevel: 'medium',
  acceptanceCriteria: [
    'User can create a task for a project.',
    'User can view tasks grouped by status.',
    'Invalid state transitions are rejected.',
    'Human approval is required for approval-gated transitions.',
  ],
  approvedBy: 'local-owner',
  branchName: null,
  prUrl: null,
  createdAt: now(),
  updatedAt: now(),
}

tasks.push(seedTask)
recordAuditEvent('task', seedTask.id, 'task.created', { status: seedTask.status })

app.get('/health', async () => ({ status: 'ok', service: 'mission-api' }))

app.get('/api/status', async () => ({
  name: 'Major Tom Mission API',
  phase: 'agent-run-framework',
  databaseConfigured: Boolean(process.env.DATABASE_URL),
  redisConfigured: Boolean(process.env.REDIS_URL),
}))

app.get('/api/projects', async () => ({ projects }))

app.get('/api/projects/:projectId', async (request, reply) => {
  const project = findProject(request.params.projectId)
  if (!project) return reply.code(404).send({ message: 'Project not found' })
  return { project }
})

app.post('/api/projects', async (request, reply) => {
  const body = request.body ?? {}
  const name = String(body.name ?? '').trim()
  const repoUrl = String(body.repoUrl ?? '').trim()
  const defaultBranch = String(body.defaultBranch ?? 'main').trim() || 'main'

  if (!name) return reply.code(400).send({ message: 'Project name is required' })
  if (!repoUrl) return reply.code(400).send({ message: 'Repository URL is required' })

  const project = {
    id: randomUUID(),
    name,
    slug: toSlug(name),
    repoUrl,
    defaultBranch,
    techStack: String(body.techStack ?? '').trim(),
    validationCommands: normalizeList(body.validationCommands),
    forbiddenPaths: normalizeList(body.forbiddenPaths),
    highRiskPaths: normalizeList(body.highRiskPaths),
    status: 'active',
    createdAt: now(),
  }

  projects.unshift(project)
  return reply.code(201).send({ project })
})

app.get('/api/task-statuses', async () => ({ statuses: taskStatuses, allowedTransitions }))
app.get('/api/agent-types', async () => ({ agentTypes, allowedAgentStatuses }))

app.get('/api/tasks', async (request) => {
  const projectId = request.query?.projectId
  const filteredTasks = projectId ? tasks.filter((task) => task.projectId === projectId) : tasks
  return { tasks: filteredTasks.map(serializeTask) }
})

app.get('/api/tasks/:taskId', async (request, reply) => {
  const task = findTask(request.params.taskId)
  if (!task) return reply.code(404).send({ message: 'Task not found' })
  return { task: serializeTask(task) }
})

app.post('/api/tasks', async (request, reply) => {
  const body = request.body ?? {}
  const projectId = String(body.projectId ?? '').trim()
  const title = String(body.title ?? '').trim()

  if (!findProject(projectId)) return reply.code(400).send({ message: 'A valid project is required' })
  if (!title) return reply.code(400).send({ message: 'Task title is required' })

  const status = taskStatuses.includes(body.status) ? body.status : 'IDEA'
  const riskLevel = ['low', 'medium', 'high'].includes(body.riskLevel) ? body.riskLevel : 'low'

  const task = {
    id: randomUUID(),
    projectId,
    title,
    description: String(body.description ?? '').trim(),
    type: String(body.type ?? 'implementation').trim(),
    status,
    priority: String(body.priority ?? 'medium').trim(),
    riskLevel,
    acceptanceCriteria: normalizeList(body.acceptanceCriteria),
    approvedBy: null,
    branchName: null,
    prUrl: null,
    createdAt: now(),
    updatedAt: now(),
  }

  tasks.unshift(task)
  recordAuditEvent('task', task.id, 'task.created', { status: task.status })
  return reply.code(201).send({ task: serializeTask(task) })
})

app.post('/api/tasks/:taskId/transitions', async (request, reply) => {
  const task = findTask(request.params.taskId)
  if (!task) return reply.code(404).send({ message: 'Task not found' })

  const body = request.body ?? {}
  const toStatus = String(body.toStatus ?? '').trim()
  const note = String(body.note ?? '').trim()
  const approvedBy = String(body.approvedBy ?? '').trim()

  if (!taskStatuses.includes(toStatus)) return reply.code(400).send({ message: 'Invalid target status' })

  const allowedTargetStatuses = allowedTransitions[task.status] ?? []
  if (!allowedTargetStatuses.includes(toStatus)) {
    return reply.code(400).send({
      message: `Transition from ${task.status} to ${toStatus} is not allowed`,
      allowedTransitions: allowedTargetStatuses,
    })
  }

  const approvalRequired = requiresApproval(task.status, toStatus, task.riskLevel)
  let approval = null

  if (approvalRequired) {
    if (!approvedBy) return reply.code(400).send({ message: 'This transition requires approval' })
    approval = {
      id: randomUUID(),
      taskId: task.id,
      approvalType: transitionKey(task.status, toStatus),
      approvedBy,
      approvedAt: now(),
      notes: note,
      riskLevel: task.riskLevel,
    }
    approvals.unshift(approval)
  }

  const fromStatus = task.status
  task.status = toStatus
  task.approvedBy = approval?.approvedBy ?? task.approvedBy
  task.updatedAt = now()

  const transition = {
    id: randomUUID(),
    taskId: task.id,
    fromStatus,
    toStatus,
    actorType: 'user',
    actorId: 'local-owner',
    requiresApproval: approvalRequired,
    approvalId: approval?.id ?? null,
    notes: note,
    createdAt: now(),
  }

  taskTransitions.unshift(transition)
  recordAuditEvent('task', task.id, 'task.transitioned', { fromStatus, toStatus, requiresApproval: approvalRequired })
  return { task: serializeTask(task) }
})

app.get('/api/agent-runs', async (request) => {
  const taskId = request.query?.taskId
  const filteredRuns = taskId ? agentRuns.filter((run) => run.taskId === taskId) : agentRuns
  return { agentRuns: filteredRuns }
})

app.get('/api/agent-runs/:agentRunId', async (request, reply) => {
  const agentRun = agentRuns.find((run) => run.id === request.params.agentRunId)
  if (!agentRun) return reply.code(404).send({ message: 'Agent run not found' })
  return { agentRun }
})

app.post('/api/tasks/:taskId/agent-runs', async (request, reply) => {
  const task = findTask(request.params.taskId)
  if (!task) return reply.code(404).send({ message: 'Task not found' })

  const body = request.body ?? {}
  const agentType = String(body.agentType ?? '').trim()

  if (!agentTypes.includes(agentType)) return reply.code(400).send({ message: 'Invalid agent type' })

  const allowedStatuses = allowedAgentStatuses[agentType] ?? []
  if (!allowedStatuses.includes(task.status)) {
    return reply.code(400).send({
      message: `${agentType} agent is not allowed to run while task is ${task.status}`,
      allowedStatuses,
    })
  }

  const run = {
    id: randomUUID(),
    taskId: task.id,
    agentType,
    status: 'queued',
    inputPrompt: String(body.inputPrompt ?? `Run ${agentType} agent for task: ${task.title}`).trim(),
    outputSummary: null,
    actionsTaken: [],
    filesChanged: [],
    artifactsCreated: [],
    validation: null,
    risks: [],
    recommendedNextState: null,
    startedAt: now(),
    finishedAt: null,
    errorMessage: null,
    costEstimate: 0,
  }

  agentRuns.unshift(run)
  recordAuditEvent('task', task.id, 'agent_run.queued', { agentType, agentRunId: run.id }, 'agent')

  run.status = 'running'
  completeAgentRun(run)

  return reply.code(201).send({ agentRun: run, task: serializeTask(task) })
})

const port = Number(process.env.PORT ?? 3000)
const host = '0.0.0.0'

try {
  await app.listen({ port, host })
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
