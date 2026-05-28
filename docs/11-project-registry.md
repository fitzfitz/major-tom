# 11. Project Registry

## Phase 2 Scope

The project registry is the first user-facing mission-control feature.

It lets the user register Git-based projects with enough metadata for later agent workflow phases.

## Current MVP Behavior

The registry currently supports:

- list projects
- create project
- view selected project details
- store repository URL
- store default branch
- store tech stack notes
- store validation commands
- store forbidden paths
- store high-risk paths

## API Endpoints

```txt
GET  /api/projects
GET  /api/projects/:projectId
POST /api/projects
```

## UI Behavior

The UI provides:

- project creation form
- project list
- selected project detail panel
- validation/safety rule fields

## Temporary Storage Note

For this slice, project records are stored in memory inside the API process.

Persistent PostgreSQL storage is intentionally deferred until the database/migration structure is introduced in a later approved task.

## Deferrals

- no database persistence yet
- no Git cloning yet
- no agent execution yet
- no authentication yet
- no project edit/delete yet
