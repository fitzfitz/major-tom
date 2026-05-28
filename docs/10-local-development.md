# 10. Local Development

## Phase 1 Foundation

This document describes the first runnable Major Tom foundation.

## Services

```txt
postgres      PostgreSQL database
redis         Redis queue/cache foundation
mission-api   Fastify API service
mission-ui    Vite React UI service
```

## Run Locally

```bash
docker compose up --build
```

## URLs

```txt
UI:      http://localhost:5173
API:     http://localhost:3000
Health:  http://localhost:3000/health
Status:  http://localhost:3000/api/status
```

## Expected Health Response

```json
{
  "status": "ok",
  "service": "mission-api"
}
```

## Notes

- This is a development-only foundation.
- The database and Redis are wired but not yet used by application features.
- Do not use the development database password for production.
- Production deployment is intentionally deferred.
