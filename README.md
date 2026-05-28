# Major Tom

Autonomous mission control for approval-gated multi-project agent workflows.

Major Tom is a planned self-hosted system for managing multiple Git-based projects through a Kanban-style workflow where specialized agents can research, plan, design, code, test, QA, and prepare pull requests while human approval remains the safety boundary.

## MVP Mission

Build a safe, observable, approval-gated mission control layer for agent-assisted software development.

The MVP focuses on:

- Multi-project registry
- Kanban task lifecycle
- Human approval gates
- Agent role definitions
- Git branch and pull request workflow
- VPS/Docker deployment planning
- Security and permissions model
- Initial implementation roadmap

## Core Principle

Agents may propose, draft, branch, test, review, and open pull requests.

Agents must not approve their own work, merge to protected branches, run risky production changes, or deploy without explicit owner approval.

## Repository Structure

```txt
docs/
  00-product-brief.md
  01-mvp-scope.md
  02-system-architecture.md
  03-agent-workflow.md
  04-kanban-state-machine.md
  05-security-and-permissions.md
  06-vps-deployment-plan.md
  07-data-model.md
  08-integration-plan.md
  09-development-roadmap.md
  decisions/
    0001-mission-control-architecture.md
templates/
  task-card.md
  agent-run-report.md
  pr-review-checklist.md
```

## Status

Planning/specification phase.

Implementation should proceed only after the MVP documents are reviewed and approved.
