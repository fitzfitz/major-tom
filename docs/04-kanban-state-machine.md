# 04. Kanban State Machine

## Purpose

The Kanban board is not only a visual board. It is the safety-critical workflow engine.

Every state transition must be explicit, auditable, and permission-controlled.

## States

### IDEA

Raw idea captured by user or agent.

### RESEARCH_REQUESTED

Research agent is allowed to investigate the idea.

### RESEARCH_DONE

Research is complete and ready for planning.

### BACKLOG_CANDIDATE

Planner has converted the idea into a possible task.

### READY

Human approved the task for design or implementation.

### DESIGN_IN_PROGRESS

Design agent is preparing the technical/product design.

### DESIGN_REVIEW

Design is ready for human review.

### CODE_READY

Human approved the design for implementation.

### CODE_IN_PROGRESS

Code agent is implementing the approved task.

### TEST_IN_PROGRESS

Validation commands are running.

### QA_REVIEW

QA agent is reviewing the work.

### PR_READY

Work is ready for pull request or pull request has been opened.

### DONE

Human accepted/merged/completed the work.

### BLOCKED

Work cannot continue due to dependency, failed validation, missing requirement, or approval issue.

### CANCELLED

Task is intentionally stopped.

## Transition Rules

```txt
IDEA -> RESEARCH_REQUESTED
RESEARCH_REQUESTED -> RESEARCH_DONE
RESEARCH_DONE -> BACKLOG_CANDIDATE
BACKLOG_CANDIDATE -> READY                 human approval required
READY -> DESIGN_IN_PROGRESS
DESIGN_IN_PROGRESS -> DESIGN_REVIEW
DESIGN_REVIEW -> CODE_READY                human approval required
CODE_READY -> CODE_IN_PROGRESS
CODE_IN_PROGRESS -> TEST_IN_PROGRESS
TEST_IN_PROGRESS -> QA_REVIEW
QA_REVIEW -> PR_READY                      human approval required
PR_READY -> DONE                           human approval required
any active state -> BLOCKED
any active state -> CANCELLED              human approval recommended
```

## High-Risk Override

Any task touching the following requires explicit elevated approval:

- authentication
- authorization
- secrets
- production deployment
- billing
- database migrations
- RLS or access policies
- CI/CD permissions
- infrastructure
- dependency upgrades with security impact

## Invariant

No agent can approve its own transition.
