# 12. Kanban Lifecycle

## Phase 3 Scope

The Kanban lifecycle is the first approval-gated task workflow in Major Tom.

## Current MVP Behavior

This slice supports:

- creating tasks for a project
- viewing tasks grouped by status
- moving tasks through allowed state transitions
- blocking invalid transitions
- requiring approval for approval-gated transitions
- storing transition history
- storing approval records
- storing audit events

## API Endpoints

```txt
GET  /api/task-statuses
GET  /api/tasks
GET  /api/tasks?projectId=:projectId
GET  /api/tasks/:taskId
POST /api/tasks
POST /api/tasks/:taskId/transitions
```

## Approval-Gated Transitions

```txt
BACKLOG_CANDIDATE -> READY
DESIGN_REVIEW -> CODE_READY
QA_REVIEW -> PR_READY
PR_READY -> DONE
```

High-risk tasks also require approval for transitions.

## UI Behavior

The UI provides:

- task creation form
- horizontal Kanban board
- transition buttons per task
- approval name input
- selected task detail panel
- transition history display

## Temporary Storage Note

For this slice, tasks, approvals, transitions, and audit events are stored in memory inside the API process.

Persistent PostgreSQL storage remains deferred until a database/migration task is explicitly approved.

## Deferrals

- no database persistence yet
- no authentication yet
- no drag-and-drop board yet
- no agent execution yet
- no PR automation yet
