import cors from '@fastify/cors'
import Fastify from 'fastify'
import { randomUUID } from 'node:crypto'

const app = Fastify({
  logger: true,
})

await app.register(cors, {
  origin: true,
})

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
    createdAt: new Date().toISOString(),
  },
]

function toSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map(String).map((item) => item.trim()).filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

app.get('/health', async () => {
  return {
    status: 'ok',
    service: 'mission-api',
  }
})

app.get('/api/status', async () => {
  return {
    name: 'Major Tom Mission API',
    phase: 'project-registry',
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    redisConfigured: Boolean(process.env.REDIS_URL),
  }
})

app.get('/api/projects', async () => {
  return {
    projects,
  }
})

app.get('/api/projects/:projectId', async (request, reply) => {
  const project = projects.find((item) => item.id === request.params.projectId)

  if (!project) {
    return reply.code(404).send({
      message: 'Project not found',
    })
  }

  return {
    project,
  }
})

app.post('/api/projects', async (request, reply) => {
  const body = request.body ?? {}
  const name = String(body.name ?? '').trim()
  const repoUrl = String(body.repoUrl ?? '').trim()
  const defaultBranch = String(body.defaultBranch ?? 'main').trim() || 'main'

  if (!name) {
    return reply.code(400).send({
      message: 'Project name is required',
    })
  }

  if (!repoUrl) {
    return reply.code(400).send({
      message: 'Repository URL is required',
    })
  }

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
    createdAt: new Date().toISOString(),
  }

  projects.unshift(project)

  return reply.code(201).send({
    project,
  })
})

const port = Number(process.env.PORT ?? 3000)
const host = '0.0.0.0'

try {
  await app.listen({ port, host })
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
