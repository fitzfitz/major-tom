# 0001. Mission Control Architecture

## Status

Proposed

## Context

Major Tom needs to coordinate AI-assisted development across multiple Git repositories while preserving human authority over sensitive actions.

A naive autonomous workflow could create poor outcomes:

- uncontrolled code changes
- unclear task ownership
- missing validation
- unapproved schema changes
- direct merges
- production updates without review

## Decision

Major Tom will use an approval-gated mission control architecture.

The system will be composed of:

- Mission Control UI
- Mission Control API
- PostgreSQL
- Redis queue
- Dockerized agent workers
- Git provider integration

The Kanban state machine is the central authority for workflow control.

Agents are specialized by role and must operate within task-specific permissions.

## Consequences

Positive:

- safer automation
- clearer audit trail
- easier debugging
- better task traceability
- better fit for multiple projects

Negative:

- more initial architecture work
- slower than a fully autonomous agent
- requires explicit approval flows

## Non-Negotiable Constraint

Agents must not merge, deploy, or perform sensitive project changes without explicit human approval.
