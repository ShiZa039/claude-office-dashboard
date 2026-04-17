/** Raw event from JSONL file */
export interface AgentEvent {
  ts: string;
  event: 'agent_start' | 'agent_stop' | 'session_stop';
  agent: string;
  task?: string;
  result?: string;
  session?: string;
}

/** Computed agent state for display */
export interface AgentState {
  name: string;
  state: 'idle' | 'working' | 'done' | 'error';
  task?: string;
  room: string;
  lastActivity?: string;
}

/** Message sent from extension to webview */
export type WebviewMessage =
  | { type: 'agent_update' | 'full_state'; agents: Record<string, AgentState> }
  | { type: 'usage_update'; data: unknown }
  | { type: 'usage_error'; message: string };

/** Agent-to-room mapping */
export const AGENT_ROOMS: Record<string, string> = {
  // Directors
  'technical-director': 'directors',
  'product-director': 'directors',
  'delivery-director': 'directors',

  // Backend
  'backend-lead': 'backend',
  'database-lead': 'backend',
  'celery-tasks-specialist': 'backend',
  'service-layer-specialist': 'backend',
  'orm-optimizer': 'backend',
  'migrations-specialist': 'backend',
  'drf-serializer-specialist': 'backend',
  'signals-specialist': 'backend',
  'api-designer': 'backend',

  // Frontend
  'frontend-lead': 'frontend',
  'react-components-specialist': 'frontend',
  'react-state-specialist': 'frontend',
  'ux-designer': 'frontend',
  'accessibility-specialist': 'frontend',

  // QA
  'qa-lead': 'qa',
  'pytest-specialist': 'qa',
  'integration-test-specialist': 'qa',
  'test-coverage-analyst': 'qa',
  'edge-case-hunter': 'qa',

  // Security
  'security-lead': 'security',
  'auth-hardening-specialist': 'security',
  'secrets-scanner': 'security',
  'security-auditor': 'security',
  'permissions-specialist': 'security',
  'data-protection-specialist': 'security',

  // DevOps
  'devops-lead': 'devops',
  'docker-compose-specialist': 'devops',
  'nginx-specialist': 'devops',
  'ci-cd-pipeline-specialist': 'devops',
  'backup-recovery-specialist': 'devops',

  // Integrations
  'integrations-lead': 'integrations',
  '1c-integration-specialist': 'integrations',
  'telegram-bot-specialist': 'integrations',
  'payment-gateway-specialist': 'integrations',
  'email-integration-specialist': 'integrations',

  // AI Lab
  'ai-lead': 'ai-lab',
  'llm-integration-specialist': 'ai-lab',
  'ai-prompt-engineering-specialist': 'ai-lab',
  'ai-safety-specialist': 'ai-lab',

  // Module owners
  'crm-module-specialist': 'backend',
  'orders-module-specialist': 'backend',
  'warehouse-module-specialist': 'backend',
  'mes-module-specialist': 'backend',
  'finance-module-specialist': 'backend',
  'payroll-module-specialist': 'backend',
};

export function getRoomForAgent(agentName: string): string {
  return AGENT_ROOMS[agentName] ?? 'lobby';
}
