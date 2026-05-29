export const endpoints = {
  projects: '/api/projects',
  taskStatuses: '/api/task-statuses',
  agentTypes: '/api/agent-types',
  tasks: '/api/tasks',
  taskTransitions: (taskId) => `/api/tasks/${taskId}/transitions`,
  taskAgentRuns: (taskId) => `/api/tasks/${taskId}/agent-runs`,
}
