# 14. Monorepo Architecture

## Phase 4.5A Scope

Major Tom now uses a Turborepo-style monorepo layout.

This prepares the project for multiple deployable apps and shared mission-control packages before the Git workspace worker is implemented.

## Structure

```txt
apps/
  api/
    Fastify API service
  web/
    Vite React web application

packages/
  shared/
    Shared task statuses, transition rules, agent types, risk levels, and helpers
```

## Root Workspace Files

```txt
package.json
pnpm-workspace.yaml
turbo.json
```

## Package Names

```txt
@major-tom/api
@major-tom/web
@major-tom/shared
```

## Shared Package Responsibilities

`@major-tom/shared` owns mission-control rules that must remain consistent across apps:

- task statuses
- board columns
- allowed state transitions
- approval-gated transitions
- risk levels
- agent types
- allowed task statuses per agent type
- status formatting helper
- transition key helper
- approval requirement helper

## App Responsibilities

### apps/api

Owns:

- Fastify server
- API routes
- in-memory stores for the current MVP
- task transition enforcement
- agent run records

Imports mission-control rules from `@major-tom/shared`.

### apps/web

Owns:

- Vite React UI
- project registry page prototype
- task intake prototype
- Kanban board prototype
- agent run controls
- task detail panel

Imports shared board columns and status formatting from `@major-tom/shared`.

## Docker Compose

Docker Compose now builds app services from the monorepo root:

```txt
api -> apps/api/Dockerfile
web -> apps/web/Dockerfile
```

Service names are simplified to:

```txt
api
web
postgres
redis
```

## Deferrals

This architecture slice intentionally does not include:

- Mission Control shell redesign
- route-based UI navigation
- Git workspace worker
- database persistence
- real external model calls
- production deployment hardening
