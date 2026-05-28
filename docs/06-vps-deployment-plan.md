# 06. VPS Deployment Plan

## Starting Assumption

The VPS is raw but already has Docker installed.

## MVP Deployment

Use Docker Compose first.

Do not begin with Kubernetes.

## Recommended Services

```txt
reverse-proxy
postgres
redis
mission-api
mission-ui
agent-worker
```

## Example Service Responsibilities

### reverse-proxy

Routes HTTPS traffic to the UI and API.

Recommended options:

- Caddy
- Traefik

### postgres

Stores projects, tasks, approvals, agent runs, artifacts, and audit events.

### redis

Queues agent jobs and tracks transient worker state.

### mission-api

Controls:

- authentication
- task lifecycle
- approval gates
- agent dispatch
- Git integration commands
- audit trail

### mission-ui

Provides:

- project dashboard
- Kanban board
- task detail
- approval buttons
- agent run logs

### agent-worker

Runs agent jobs in bounded workspaces.

## Docker Compose Skeleton

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: major_tom
      POSTGRES_USER: major_tom
      POSTGRES_PASSWORD: change_me
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    volumes:
      - redis_data:/data

  mission-api:
    build: ./mission-api
    depends_on:
      - postgres
      - redis

  mission-ui:
    build: ./mission-ui
    depends_on:
      - mission-api

  agent-worker:
    build: ./agent-worker
    depends_on:
      - postgres
      - redis
    volumes:
      - ./workspaces:/workspaces

volumes:
  postgres_data:
  redis_data:
```

## Deployment Safety Notes

- Do not expose Redis publicly.
- Do not expose Postgres publicly.
- Put the UI/API behind HTTPS.
- Use non-root containers where practical.
- Keep agent workspaces separate from system files.
- Rotate tokens used for Git provider access.
