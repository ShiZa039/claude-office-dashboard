/** Raw event from JSONL file */
export interface AgentEvent {
  ts: string;
  event: 'agent_start' | 'agent_stop' | 'session_stop';
  agent: string;
  task?: string;
  result?: string;
  session?: string;
  /** Working directory Claude Code was invoked from; used for per-window isolation. */
  cwd?: string;
}

/** Computed agent state for display */
export interface AgentState {
  name: string;
  state: 'idle' | 'working' | 'done' | 'error';
  task?: string;
  room: string;
  lastActivity?: string;
  cwd?: string;
}

/** Message sent from extension to webview */
export type WebviewMessage =
  | { type: 'agent_update' | 'full_state'; agents: Record<string, AgentState> }
  | { type: 'usage_update'; data: unknown }
  | { type: 'usage_error'; message: string };

/** Known room ids — keep in sync with media/icons.js and office.html data-room attrs. */
export const KNOWN_ROOMS = [
  'directors',
  'backend',
  'frontend',
  'qa',
  'security',
  'devops',
  'integrations',
  'ai-lab',
  'lobby',
] as const;

/** Default mapping for agents shipped with the BAZA.CRM profile. */
export const DEFAULT_AGENT_ROOMS: Record<string, string> = {
  'technical-director': 'directors',
  'product-director': 'directors',
  'delivery-director': 'directors',

  'backend-lead': 'backend',
  'database-lead': 'backend',
  'celery-tasks-specialist': 'backend',
  'service-layer-specialist': 'backend',
  'orm-optimizer': 'backend',
  'migrations-specialist': 'backend',
  'drf-serializer-specialist': 'backend',
  'signals-specialist': 'backend',
  'api-designer': 'backend',

  'frontend-lead': 'frontend',
  'react-components-specialist': 'frontend',
  'react-state-specialist': 'frontend',
  'ux-designer': 'frontend',
  'accessibility-specialist': 'frontend',

  'qa-lead': 'qa',
  'pytest-specialist': 'qa',
  'integration-test-specialist': 'qa',
  'test-coverage-analyst': 'qa',
  'edge-case-hunter': 'qa',

  'security-lead': 'security',
  'auth-hardening-specialist': 'security',
  'secrets-scanner': 'security',
  'security-auditor': 'security',
  'permissions-specialist': 'security',
  'data-protection-specialist': 'security',

  'devops-lead': 'devops',
  'docker-compose-specialist': 'devops',
  'nginx-specialist': 'devops',
  'ci-cd-pipeline-specialist': 'devops',
  'backup-recovery-specialist': 'devops',

  'integrations-lead': 'integrations',
  '1c-integration-specialist': 'integrations',
  'telegram-bot-specialist': 'integrations',
  'payment-gateway-specialist': 'integrations',
  'email-integration-specialist': 'integrations',

  'ai-lead': 'ai-lab',
  'llm-integration-specialist': 'ai-lab',
  'ai-prompt-engineering-specialist': 'ai-lab',
  'ai-safety-specialist': 'ai-lab',

  'crm-module-specialist': 'backend',
  'orders-module-specialist': 'backend',
  'warehouse-module-specialist': 'backend',
  'mes-module-specialist': 'backend',
  'finance-module-specialist': 'backend',
  'payroll-module-specialist': 'backend',
};

/** Keyword-based fallback for unknown agent names (ordered: most specific first). */
const KEYWORD_RULES: Array<{ keywords: string[]; room: string }> = [
  { room: 'directors', keywords: ['director'] },
  { room: 'ai-lab', keywords: ['ai', 'llm', 'prompt', 'claude', 'anthropic'] },
  {
    room: 'security',
    keywords: ['security', 'auth', 'secret', 'permission', 'threat', 'hardening', 'iac'],
  },
  {
    room: 'devops',
    keywords: [
      'devops', 'docker', 'nginx', 'ci', 'cd', 'backup', 'deploy', 'apm',
      'observability', 'alerting', 'scalability', 'ratelimit',
    ],
  },
  { room: 'qa', keywords: ['qa', 'test', 'pytest', 'coverage', 'edge'] },
  {
    room: 'frontend',
    keywords: ['frontend', 'react', 'ui', 'ux', 'accessibility', 'a11y', 'i18n', 'media'],
  },
  {
    room: 'integrations',
    keywords: ['integration', 'webhook', '1c', 'telegram', 'email', 'payment', 'edo', 'ofd', 'notifications'],
  },
  {
    room: 'backend',
    keywords: [
      'backend', 'django', 'orm', 'database', 'sql', 'celery', 'service',
      'signals', 'migration', 'migrations', 'drf', 'serializer', 'viewset',
      'fsm', 'workflow', 'decimal',
    ],
  },
];

/** Infer a room from an unknown agent name by matching known keyword tokens. */
export function inferRoomByName(name: string): string {
  const lower = name.toLowerCase();
  const tokens = new Set(lower.split(/[-_/.]+/).filter(Boolean));
  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some((kw) => tokens.has(kw))) {
      return rule.room;
    }
  }
  return 'lobby';
}

/**
 * Resolve an agent to its room. Precedence:
 * 1. `customMap` (user settings) — direct hit wins
 * 2. `DEFAULT_AGENT_ROOMS` — built-in mapping for BAZA.CRM profile
 * 3. `inferRoomByName` — keyword heuristic
 * 4. `'lobby'` — fallback for anything unknown
 */
export function getRoomForAgent(
  agentName: string,
  customMap?: Record<string, string>,
): string {
  if (customMap && customMap[agentName]) return customMap[agentName];
  if (DEFAULT_AGENT_ROOMS[agentName]) return DEFAULT_AGENT_ROOMS[agentName];
  return inferRoomByName(agentName);
}
