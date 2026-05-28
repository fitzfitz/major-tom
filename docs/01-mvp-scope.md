# 01. MVP Scope

## MVP Goal

Create the first safe version of Major Tom that can orchestrate approval-gated agent-assisted development for Git-based projects.

## In Scope

### Project Registry

- Add projects manually.
- Store project name, repo URL, default branch, stack, validation commands, and risk rules.
- Support multiple projects from day one at the data model level.

### Kanban Task Lifecycle

Support a controlled workflow:

```txt
IDEA
RESEARCH_REQUESTED
RESEARCH_DONE
BACKLOG_CANDIDATE
READY
DESIGN_IN_PROGRESS
DESIGN_REVIEW
CODE_READY
CODE_IN_PROGRESS
TEST_IN_PROGRESS
QA_REVIEW
PR_READY
DONE
BLOCKED
CANCELLED
```

### Human Approval Gates

Human approval is required for:

- BACKLOG_CANDIDATE -> READY
- DESIGN_REVIEW -> CODE_READY
- QA_REVIEW -> PR_READY
- PR_READY -> DONE
- Any migration, production, deployment, auth, permission, or secret-related change

### Agent Roles

Define these roles in the MVP:

- Market Research Agent
- Planner Agent
- Design Agent
- Code Agent
- Test Agent
- QA Agent
- PR Agent

### Git Workflow

- Clone project repository into an isolated workspace.
- Create feature branch per approved task.
- Commit only task-scoped changes.
- Push branch.
- Open pull request.
- Do not merge automatically.

### Validation

Each project defines validation commands.

Default commands:

```bash
npm run lint
npm run format:check
npm run build
git diff --check
```

### Audit Trail

Record:

- task transitions
- approvals
- agent runs
- generated artifacts
- validation results
- branch names
- pull request URLs

## Out of Scope For MVP

- Automatic production deploys
- Automatic PR merges
- Direct database migration execution
- Multi-tenant SaaS hosting
- Billing
- Complex marketplace of agents
- Full custom CI runner replacement
- Visual drag-and-drop workflow builder
- Automatic secret management beyond simple environment-based configuration
- Autonomous decision making for high-risk changes

## MVP Rule

The system may automate labor, but it must not automate authority.
