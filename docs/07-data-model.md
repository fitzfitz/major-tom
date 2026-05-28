# 07. Data Model

## Overview

The MVP data model supports projects, tasks, approvals, agent runs, artifacts, and audit events.

## Tables

### projects

```txt
id
name
slug
repo_url
default_branch
tech_stack
status
created_at
updated_at
```

### project_rules

```txt
id
project_id
validation_commands
forbidden_paths
high_risk_paths
requires_approval_for_migrations
requires_approval_for_dependencies
created_at
updated_at
```

### tasks

```txt
id
project_id
title
description
type
status
priority
risk_level
acceptance_criteria
branch_name
pr_url
created_by
approved_by
created_at
updated_at
```

### task_transitions

```txt
id
task_id
from_status
to_status
actor_type
actor_id
requires_approval
approval_id
notes
created_at
```

### approvals

```txt
id
task_id
approval_type
approved_by
approved_at
notes
risk_level
```

### agent_runs

```txt
id
task_id
agent_type
status
input_prompt
output_summary
started_at
finished_at
error_message
cost_estimate
```

### artifacts

```txt
id
task_id
agent_run_id
artifact_type
path_or_url
content_summary
created_at
```

### validation_runs

```txt
id
task_id
agent_run_id
command
status
output_excerpt
started_at
finished_at
```

### audit_events

```txt
id
entity_type
entity_id
event_type
actor_type
actor_id
metadata
created_at
```

## Notes

The data model should prefer explicit audit records over implicit state.

Every important action should be reconstructable later.
