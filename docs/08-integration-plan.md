# 08. Integration Plan

## GitHub

MVP Git provider.

Required capabilities:

- read repository metadata
- clone repository
- create branch
- push commits
- open pull request
- link task to pull request

Recommended GitHub rules:

- protect main branch
- require pull request review
- require status checks when CI exists
- prevent force pushes to main
- disable auto-merge for agent-created PRs unless explicitly approved later

## Model Providers

Major Tom should be model-provider agnostic.

Potential providers:

- OpenAI API
- Anthropic API
- OpenRouter
- local models through Ollama or vLLM

Important note:

ChatGPT Plus is not the same as API billing. Programmatic agent calls require API-capable model access.

## Kanban Tool Options

### Internal Kanban

Build into Major Tom.

Pros:

- full control over state machine
- easier approval enforcement
- better audit trail

Cons:

- more implementation work

### External Kanban

Use Plane, GitHub Issues, or Gitea Projects.

Pros:

- faster MVP
- existing UI

Cons:

- harder to enforce custom workflow

## Recommended MVP Choice

Start with internal task state in Major Tom.

Optionally mirror tasks to GitHub Issues later.

## Notification Integrations

Later candidates:

- email
- Slack
- Discord
- Telegram
- WhatsApp

Notifications are not required for MVP.
