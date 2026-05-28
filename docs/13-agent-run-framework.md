# 13. Agent Run Framework

## Phase 4 Scope

The agent run framework records safe, task-scoped agent activity without allowing autonomous code changes.

## Current MVP Behavior

This slice supports:

- listing supported agent types
- defining which task statuses each agent may run against
- triggering an agent run from a task
- recording run status
- recording input prompt
- recording deterministic output summary
- recording actions taken
- recording risks
- recording recommended next state
- showing runs in the task detail panel
- adding audit events for queued and completed runs

## API Endpoints

```txt
GET  /api/agent-types
GET  /api/agent-runs
GET  /api/agent-runs?taskId=:taskId
GET  /api/agent-runs/:agentRunId
POST /api/tasks/:taskId/agent-runs
```

## Agent Types

```txt
market-research
planner
design
code
test
qa
pr
```

## Safety Rule

Phase 4 agent runs are deterministic placeholders.

They do not:

- call an external model
- modify files
- clone repositories
- push branches
- open pull requests
- run deployment commands

## Deferrals

- real queue worker
- Redis-backed processing
- model provider integration
- repository workspace execution
- code-writing agents
- pull request automation
- persistent database storage
