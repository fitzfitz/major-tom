import cors from '@fastify/cors'
import Fastify from 'fastify'

const app = Fastify({
  logger: true,
})

await app.register(cors, {
  origin: true,
})

app.get('/health', async () => {
  return {
    status: 'ok',
    service: 'mission-api',
  }
})

app.get('/api/status', async () => {
  return {
    name: 'Major Tom Mission API',
    phase: 'foundation',
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    redisConfigured: Boolean(process.env.REDIS_URL),
  }
})

const port = Number(process.env.PORT ?? 3000)
const host = '0.0.0.0'

try {
  await app.listen({ port, host })
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
