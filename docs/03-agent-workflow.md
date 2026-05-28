# 03. Agent Workflow

## Agent Philosophy

Each agent has one job. No agent should own the entire lifecycle.

This reduces risk, improves reviewability, and keeps the system understandable.

## Agent Roles

### Market Research Agent

Purpose:

- Analyze market demand
- Identify competitors
- Summarize product opportunities
- Produce backlog candidates

Allowed outputs:

- Research notes
- Opportunity summaries
- Backlog candidate drafts

Forbidden:

- Moving tasks to READY
- Editing code
- Creating pull requests

### Planner Agent

Purpose:

- Convert ideas and research into epics, user stories, and task candidates
- Define acceptance criteria
- Identify dependencies and risks

Allowed outputs:

- Epic drafts
- Story drafts
- Task cards

Forbidden:

- Approving work
- Editing code
- Creating pull requests

### Design Agent

Purpose:

- Prepare implementation design
- Define UX flow, data flow, edge cases, and validation plan

Allowed outputs:

- Design specification
- Wireframe notes
- File impact plan
- Manual QA checklist

Forbidden:

- Coding before design approval
- Modifying production files

### Code Agent

Purpose:

- Implement approved and designed tasks in an isolated branch

Allowed outputs:

- Code changes
- Feature branch
- Commit summary

Forbidden:

- Pushing to protected branch
- Merging pull requests
- Changing forbidden files without approval
- Running migrations without approval

### Test Agent

Purpose:

- Run configured validation commands
- Summarize pass/fail results

Allowed outputs:

- Test report
- Validation log

Forbidden:

- Editing source code unless explicitly assigned a test-fix task

### QA Agent

Purpose:

- Review diff against acceptance criteria
- Identify scope creep, risk, and missing validation

Allowed outputs:

- QA report
- Pass/block recommendation

Forbidden:

- Approving its own work
- Merging pull requests

### PR Agent

Purpose:

- Open pull request after validation and QA pass

Allowed outputs:

- Pull request
- PR body
- Linked task evidence

Forbidden:

- Merging PR
- Enabling auto-merge
- Deploying production

## Standard Agent Run Output

Each agent run should produce:

```txt
Agent:
Task:
Input:
Actions Taken:
Files Touched:
Output Artifacts:
Validation:
Risks:
Next Recommended State:
```
