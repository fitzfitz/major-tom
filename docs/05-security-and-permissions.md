# 05. Security And Permissions

## Core Security Principle

Agents are workers, not owners.

They execute approved work inside bounded environments. They should not hold broad authority.

## Required MVP Security Rules

1. Agents must not receive root SSH access.
2. Agents must run in isolated containers or disposable workspaces.
3. Agents must not access production secrets.
4. Agents must not push to protected branches.
5. Agents must not merge pull requests.
6. Agents must not deploy production.
7. Agents must not run database migrations without explicit approval.
8. Agents must not modify CI/CD secrets.
9. Agents must not bypass validation commands.
10. All agent actions must be logged.

## Project Risk Levels

### Low Risk

Examples:

- docs changes
- UI copy
- simple styling
- test-only additions
- read-only UI work

### Medium Risk

Examples:

- feature implementation
- repository refactor
- dependency addition
- API integration

### High Risk

Examples:

- auth
- authorization
- database migrations
- production deployment
- billing
- secrets
- infrastructure
- CI/CD permissions

## Forbidden By Default

Agents may not modify:

```txt
.env
.env.*
deployment secrets
production credentials
GitHub Actions secrets
database migration files
auth/RLS policies
billing/payment logic
infrastructure provisioning files
```

These can be allowed only when the task explicitly grants permission.

## Approval Model

Store approval records with:

- approver
- timestamp
- transition
- notes
- risk level
- task id

## Audit Requirement

Every task should answer:

```txt
Who approved this?
What agent acted on it?
What files changed?
What validation ran?
What PR was created?
What risks were identified?
```
