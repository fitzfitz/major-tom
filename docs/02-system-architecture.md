# 02. System Architecture

## Overview

Major Tom is a self-hosted orchestration layer that coordinates tasks, approvals, repositories, and specialized agents.

## Recommended MVP Stack

```txt
Frontend:       React + TypeScript + Vite
Backend:        Node.js/NestJS or Python/FastAPI
Database:       PostgreSQL
Queue:          Redis
Workers:        Dockerized agent workers
Git Provider:   GitHub first
Deployment:     Docker Compose on VPS
Reverse Proxy:  Caddy or Traefik
```

## Logical Components

```txt
Mission Control UI
  - Project list
  - Kanban board
  - Task detail
  - Agent run history
  - Approval controls

Mission Control API
  - Auth boundary
  - Project registry
  - Task state machine
  - Approval enforcement
  - Agent run orchestration
  - Audit records

Agent Queue
  - Dispatches work to workers
  - Stores pending/running/failed/completed jobs

Agent Workers
  - Research worker
  - Planning worker
  - Design worker
  - Code worker
  - Test worker
  - QA worker
  - PR worker

Git Integration
  - Clone repository
  - Create branch
  - Commit changes
  - Push branch
  - Open pull request

Storage
  - PostgreSQL for structured data
  - Git repository for code artifacts
  - File storage for logs and large artifacts if needed later
```

## MVP Deployment Shape

```txt
docker-compose.yml
  postgres
  redis
  mission-api
  mission-ui
  agent-worker
  reverse-proxy
```

## Security Boundary

The most important security boundary is not the model.

The most important boundary is the state machine and permission model.

Agents should be unable to perform disallowed transitions even if their model output asks for it.
