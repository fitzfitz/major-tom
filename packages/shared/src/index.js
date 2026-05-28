export const taskStatuses = [
  'IDEA',
  'RESEARCH_REQUESTED',
  'RESEARCH_DONE',
  'BACKLOG_CANDIDATE',
  'READY',
  'DESIGN_IN_PROGRESS',
  'DESIGN_REVIEW',
  'CODE_READY',
  'CODE_IN_PROGRESS',
  'TEST_IN_PROGRESS',
  'QA_REVIEW',
  'PR_READY',
  'DONE',
  'BLOCKED',
  'CANCELLED',
]

export const boardColumns = [
  'IDEA',
  'BACKLOG_CANDIDATE',
  'READY',
  'DESIGN_IN_PROGRESS',
  'DESIGN_REVIEW',
  'CODE_READY',
  'CODE_IN_PROGRESS',
  'TEST_IN_PROGRESS',
  'QA_REVIEW',
  'PR_READY',
  'DONE',
  'BLOCKED',
]

export const riskLevels = ['low', 'medium', 'high']

export const agentTypes = [
  'market-research',
  'planner',
  'design',
  'code',
  'test',
  'qa',
  'pr',
]

export const allowedAgentStatuses = {
  'market-research': ['IDEA', 'RESEARCH_REQUESTED'],
  planner: ['RESEARCH_DONE', 'BACKLOG_CANDIDATE', 'READY'],
  design: ['READY', 'DESIGN_IN_PROGRESS', 'DESIGN_REVIEW'],
  code: ['CODE_READY', 'CODE_IN_PROGRESS'],
  test: ['CODE_IN_PROGRESS', 'TEST_IN_PROGRESS'],
  qa: ['TEST_IN_PROGRESS', 'QA_REVIEW'],
  pr: ['PR_READY'],
}

export const approvalRequiredTransitions = [
  'BACKLOG_CANDIDATE->READY',
  'DESIGN_REVIEW->CODE_READY',
  'QA_REVIEW->PR_READY',
  'PR_READY->DONE',
]

export const allowedTransitions = {
  IDEA: ['RESEARCH_REQUESTED', 'BLOCKED', 'CANCELLED'],
  RESEARCH_REQUESTED: ['RESEARCH_DONE', 'BLOCKED', 'CANCELLED'],
  RESEARCH_DONE: ['BACKLOG_CANDIDATE', 'BLOCKED', 'CANCELLED'],
  BACKLOG_CANDIDATE: ['READY', 'BLOCKED', 'CANCELLED'],
  READY: ['DESIGN_IN_PROGRESS', 'BLOCKED', 'CANCELLED'],
  DESIGN_IN_PROGRESS: ['DESIGN_REVIEW', 'BLOCKED', 'CANCELLED'],
  DESIGN_REVIEW: ['CODE_READY', 'BLOCKED', 'CANCELLED'],
  CODE_READY: ['CODE_IN_PROGRESS', 'BLOCKED', 'CANCELLED'],
  CODE_IN_PROGRESS: ['TEST_IN_PROGRESS', 'BLOCKED', 'CANCELLED'],
  TEST_IN_PROGRESS: ['QA_REVIEW', 'BLOCKED', 'CANCELLED'],
  QA_REVIEW: ['PR_READY', 'BLOCKED', 'CANCELLED'],
  PR_READY: ['DONE', 'BLOCKED', 'CANCELLED'],
  DONE: [],
  BLOCKED: ['IDEA', 'READY', 'CANCELLED'],
  CANCELLED: [],
}

export function formatStatus(status) {
  return String(status ?? '').toLowerCase().replaceAll('_', ' ')
}

export function transitionKey(fromStatus, toStatus) {
  return `${fromStatus}->${toStatus}`
}

export function requiresApproval(fromStatus, toStatus, riskLevel) {
  return approvalRequiredTransitions.includes(transitionKey(fromStatus, toStatus)) || riskLevel === 'high'
}
