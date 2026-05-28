# 09. Development Roadmap

## Phase 0: Specification

Goal:

- Establish product scope, architecture, safety rules, data model, and workflow.

Deliverables:

- Documentation set
- Reusable templates
- First implementation backlog

## Phase 1: Repo And App Foundation

Goal:

- Create a runnable skeleton.

Tasks:

- Create Docker Compose foundation.
- Create mission-api app.
- Create mission-ui app.
- Create database migration structure.
- Add basic health checks.
- Add local validation script.

## Phase 2: Project Registry

Goal:

- Register and view managed Git projects.

Tasks:

- Project table and API.
- Project create/list/detail UI.
- Store repo URL, default branch, tech stack, validation commands, and rules.

## Phase 3: Kanban Task Lifecycle

Goal:

- Manage tasks through a safe state machine.

Tasks:

- Task table and API.
- Kanban UI.
- Transition validation.
- Approval records.
- Audit events.

## Phase 4: Agent Run Framework

Goal:

- Dispatch agent jobs and record outputs.

Tasks:

- Redis queue.
- Agent worker service.
- Agent run records.
- Basic planner/design agent stub.
- Agent run log UI.

## Phase 5: Git Workspace Worker

Goal:

- Enable task-scoped branch creation.

Tasks:

- Clone repo.
- Create branch.
- Run configured commands.
- Capture validation output.
- Prevent forbidden paths.

## Phase 6: PR Workflow

Goal:

- Open traceable pull requests.

Tasks:

- Generate PR body.
- Push branch.
- Open PR.
- Link PR to task.
- Move task to PR_READY.

## Phase 7: Hardening

Goal:

- Make the system safer before real daily use.

Tasks:

- Improve permission checks.
- Improve audit views.
- Add workspace cleanup.
- Add credential storage policy.
- Add rate and cost limits.
- Add risk classification.
