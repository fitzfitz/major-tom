# 00. Product Brief

## Product Name

Major Tom

## One-line Description

Major Tom is a self-hosted mission control system for managing multiple Git-based projects with approval-gated AI agents.

## Problem

Solo builders and small teams increasingly use AI coding agents, but the workflow often becomes scattered across chats, repositories, terminals, documents, and manual task lists.

The larger risk is uncontrolled automation:

- Agents working without clear task approval
- Code changes with no acceptance criteria
- Pull requests without traceable reasoning
- Risky migrations or infrastructure edits
- No audit trail of who or what approved work
- No clear separation between research, planning, coding, QA, and release

## Target User

The MVP targets a technical founder or senior developer who manages multiple Git-based projects and wants AI assistance without surrendering control.

## Primary Jobs To Be Done

1. Register multiple Git repositories as managed projects.
2. Turn research and ideas into backlog candidates.
3. Approve selected backlog items into ready tasks.
4. Let agents prepare design specs, code branches, validation reports, QA reviews, and pull requests.
5. Keep humans responsible for risky transitions such as approval, merge, deploy, and production change.

## Product Philosophy

Major Tom is not a fully autonomous replacement for the developer.

It is a command center where agents become specialized crew members and the user remains mission commander.

## MVP Success Criteria

The MVP is successful when a user can:

- Register at least one project.
- Create and approve a task through a Kanban lifecycle.
- Run a design agent on an approved task.
- Run a coding agent in an isolated branch.
- Run validation commands.
- Generate a QA report.
- Open a pull request with traceable context.
- Prevent agents from merging or deploying without approval.
