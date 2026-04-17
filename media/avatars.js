// Agent avatar SVGs 14x14 — per-role icons
// noqa: secret
window.__AGENT_AVATARS = {
  // ── Directors: crown ──
  "director": "<svg viewBox=\"0 0 14 14\"><path d=\"M2 10l1.5-4L5.5 8 7 4l1.5 4 2-2L12 10z\" fill=\"currentColor\" opacity=\"0.3\"/><path d=\"M2 10l1.5-4L5.5 8 7 4l1.5 4 2-2L12 10H2z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\" stroke-linejoin=\"round\"/><rect x=\"2\" y=\"10\" width=\"10\" height=\"2\" rx=\"0.5\" fill=\"currentColor\" opacity=\"0.5\"/></svg>",

  // ── Leads: person with star badge ──
  "lead": "<svg viewBox=\"0 0 14 14\"><circle cx=\"7\" cy=\"4\" r=\"2.2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\"/><path d=\"M3 12.5c0-2.5 1.8-4 4-4s4 1.5 4 4\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\" stroke-linecap=\"round\"/><circle cx=\"10.5\" cy=\"3.5\" r=\"1.8\" fill=\"currentColor\" opacity=\"0.25\"/><path d=\"M10.5 2l.4.9h1l-.8.6.3 1-.9-.7-.9.7.3-1-.8-.6h1z\" fill=\"currentColor\"/></svg>",

  // ── Backend dev: gear ──
  "gear": "<svg viewBox=\"0 0 14 14\"><circle cx=\"7\" cy=\"7\" r=\"2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\"/><path d=\"M6.2 1.5h1.6l.3 1.5.9.4 1.3-.8 1.1 1.1-.8 1.3.4.9 1.5.3v1.6l-1.5.3-.4.9.8 1.3-1.1 1.1-1.3-.8-.9.4-.3 1.5H6.2l-.3-1.5-.9-.4-1.3.8-1.1-1.1.8-1.3-.4-.9-1.5-.3V6.2l1.5-.3.4-.9-.8-1.3L3.6 2.6l1.3.8.9-.4z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"0.9\"/></svg>",

  // ── Database: cylinder ──
  "database": "<svg viewBox=\"0 0 14 14\"><ellipse cx=\"7\" cy=\"3.5\" rx=\"4\" ry=\"1.8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\"/><path d=\"M3 3.5v7c0 1 1.8 1.8 4 1.8s4-.8 4-1.8v-7\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\"/><path d=\"M3 7c0 1 1.8 1.8 4 1.8s4-.8 4-1.8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"0.8\" opacity=\"0.5\"/></svg>",

  // ── Serializer/API: braces {} ──
  "api": "<svg viewBox=\"0 0 14 14\"><path d=\"M4.5 2C3.5 2 3 2.8 3 3.5v2.3C3 6.5 2 7 2 7s1 .5 1 1.2v2.3c0 .7.5 1.5 1.5 1.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><path d=\"M9.5 2c1 0 1.5.8 1.5 1.5v2.3C11 6.5 12 7 12 7s-1 .5-1 1.2v2.3c0 .7-.5 1.5-1.5 1.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/></svg>",

  // ── Service layer: layers ──
  "layers": "<svg viewBox=\"0 0 14 14\"><path d=\"M7 2L1.5 5.5 7 9l5.5-3.5z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\" stroke-linejoin=\"round\"/><path d=\"M1.5 7.5L7 11l5.5-3.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\" stroke-linejoin=\"round\"/><path d=\"M1.5 9.5L7 13l5.5-3.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"0.9\" stroke-linejoin=\"round\" opacity=\"0.5\"/></svg>",

  // ── Signals/workflow: lightning bolt ──
  "bolt": "<svg viewBox=\"0 0 14 14\"><path d=\"M8 1L3.5 7.5H7L6 13l4.5-6.5H7z\" fill=\"currentColor\" opacity=\"0.15\"/><path d=\"M8 1L3.5 7.5H7L6 13l4.5-6.5H7z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\" stroke-linejoin=\"round\"/></svg>",

  // ── Migrations: arrow-up-from-line ──
  "migrate": "<svg viewBox=\"0 0 14 14\"><path d=\"M7 2v8\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><path d=\"M4 5l3-3 3 3\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M3 12h8\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/></svg>",

  // ── ORM/optimizer: speedometer ──
  "speed": "<svg viewBox=\"0 0 14 14\"><path d=\"M2 10a5.5 5.5 0 0 1 10 0\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\" stroke-linecap=\"round\"/><path d=\"M7 10l2-4\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><circle cx=\"7\" cy=\"10\" r=\"1\" fill=\"currentColor\"/></svg>",

  // ── Frontend: monitor with code ──
  "monitor": "<svg viewBox=\"0 0 14 14\"><rect x=\"1.5\" y=\"1.5\" width=\"11\" height=\"8\" rx=\"1\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\"/><path d=\"M5 5l-1.5 1.5L5 8M9 5l1.5 1.5L9 8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M5 12h4M7 9.5v2.5\" stroke=\"currentColor\" stroke-width=\"1\" stroke-linecap=\"round\"/></svg>",

  // ── React components: atom ──
  "atom": "<svg viewBox=\"0 0 14 14\"><ellipse cx=\"7\" cy=\"7\" rx=\"5\" ry=\"2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"0.9\" transform=\"rotate(-30 7 7)\"/><ellipse cx=\"7\" cy=\"7\" rx=\"5\" ry=\"2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"0.9\" transform=\"rotate(30 7 7)\"/><ellipse cx=\"7\" cy=\"7\" rx=\"5\" ry=\"2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"0.9\"/><circle cx=\"7\" cy=\"7\" r=\"1.2\" fill=\"currentColor\"/></svg>",

  // ── State management: store/box ──
  "store": "<svg viewBox=\"0 0 14 14\"><rect x=\"2\" y=\"3\" width=\"10\" height=\"8\" rx=\"1\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\"/><path d=\"M2 6h10\" stroke=\"currentColor\" stroke-width=\"0.8\"/><circle cx=\"7\" cy=\"8.5\" r=\"1.2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1\"/></svg>",

  // ── UX designer: palette ──
  "palette": "<svg viewBox=\"0 0 14 14\"><path d=\"M7 1.5A5.5 5.5 0 0 0 1.5 7c0 3 2.5 5.5 5.5 5.5.8 0 1.3-.5 1.3-1s-.4-.8-.4-1.2c0-.6.5-1 1.1-1H10c2.2 0 2.5-1.2 2.5-2.8A5.5 5.5 0 0 0 7 1.5z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\"/><circle cx=\"5\" cy=\"5.5\" r=\"0.9\" fill=\"currentColor\"/><circle cx=\"8\" cy=\"4.5\" r=\"0.9\" fill=\"currentColor\"/><circle cx=\"4\" cy=\"8\" r=\"0.9\" fill=\"currentColor\"/></svg>",

  // ── QA: magnifying glass + check ──
  "qa-check": "<svg viewBox=\"0 0 14 14\"><circle cx=\"6\" cy=\"6\" r=\"3.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\"/><path d=\"M9 9l3.5 3.5\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><path d=\"M4.5 6l1 1.2L8 5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>",

  // ── Test/pytest: flask ──
  "flask": "<svg viewBox=\"0 0 14 14\"><path d=\"M5.5 1.5h3M5.5 1.5v3.5L2 11c-.3.5 0 1.5 1 1.5h8c1 0 1.3-1 1-1.5L8.5 5V1.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M4 9.5h6\" stroke=\"currentColor\" stroke-width=\"0.8\" opacity=\"0.5\"/></svg>",

  // ── Coverage/analysis: pie chart ──
  "chart": "<svg viewBox=\"0 0 14 14\"><circle cx=\"7\" cy=\"7.5\" r=\"4.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\"/><path d=\"M7 3v4.5h4.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\" stroke-linecap=\"round\"/><path d=\"M7 7.5l-3 3.5\" stroke=\"currentColor\" stroke-width=\"0.8\" opacity=\"0.4\"/></svg>",

  // ── Bug hunter: crosshair ──
  "crosshair": "<svg viewBox=\"0 0 14 14\"><circle cx=\"7\" cy=\"7\" r=\"4\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\"/><path d=\"M7 1.5v2M7 10.5v2M1.5 7h2M10.5 7h2\" stroke=\"currentColor\" stroke-width=\"1.1\" stroke-linecap=\"round\"/><circle cx=\"7\" cy=\"7\" r=\"1\" fill=\"currentColor\"/></svg>",

  // ── Security: lock ──
  "lock": "<svg viewBox=\"0 0 14 14\"><rect x=\"3\" y=\"6\" width=\"8\" height=\"6\" rx=\"1\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\"/><path d=\"M5 6V4.5a2 2 0 0 1 4 0V6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\" stroke-linecap=\"round\"/><circle cx=\"7\" cy=\"9.2\" r=\"1\" fill=\"currentColor\"/></svg>",

  // ── Shield: for security auditors ──
  "shield": "<svg viewBox=\"0 0 14 14\"><path d=\"M7 1.5L2.5 3.5v3.5c0 3 2 5.2 4.5 5.5 2.5-.3 4.5-2.5 4.5-5.5V3.5z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\" stroke-linejoin=\"round\"/><path d=\"M5 7l1.5 1.5L9.5 5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>",

  // ── Eye: for scanners/watchers ──
  "eye": "<svg viewBox=\"0 0 14 14\"><path d=\"M1 7s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\" stroke-linejoin=\"round\"/><circle cx=\"7\" cy=\"7\" r=\"1.8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\"/><circle cx=\"7\" cy=\"7\" r=\"0.7\" fill=\"currentColor\"/></svg>",

  // ── Key: for permissions/auth ──
  "key": "<svg viewBox=\"0 0 14 14\"><circle cx=\"9.5\" cy=\"4.5\" r=\"2.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\"/><path d=\"M7.5 6.5L2 12h2.5v-2H7v-2l.5-.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>",

  // ── DevOps: terminal ──
  "terminal": "<svg viewBox=\"0 0 14 14\"><rect x=\"1.5\" y=\"2\" width=\"11\" height=\"10\" rx=\"1.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\"/><path d=\"M4 6l2 1.5L4 9\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M7.5 9h3\" stroke=\"currentColor\" stroke-width=\"1.1\" stroke-linecap=\"round\"/></svg>",

  // ── Docker: container/box with whale ──
  "container": "<svg viewBox=\"0 0 14 14\"><rect x=\"2\" y=\"5\" width=\"10\" height=\"7\" rx=\"1\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\"/><path d=\"M4 5V3h2v2M6 5V2h2v3M8 5V3h2v2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"0.9\"/><path d=\"M4 8h2M6 8h2M8 8h2\" stroke=\"currentColor\" stroke-width=\"0.8\" opacity=\"0.4\"/></svg>",

  // ── Nginx: web/globe ──
  "globe": "<svg viewBox=\"0 0 14 14\"><circle cx=\"7\" cy=\"7\" r=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\"/><ellipse cx=\"7\" cy=\"7\" rx=\"2.2\" ry=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"0.8\"/><path d=\"M2 7h10M2.5 4.5h9M2.5 9.5h9\" stroke=\"currentColor\" stroke-width=\"0.7\" opacity=\"0.5\"/></svg>",

  // ── CI/CD: loop/cycle arrows ──
  "cycle": "<svg viewBox=\"0 0 14 14\"><path d=\"M11 5.5A4 4 0 0 0 3.5 5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\" stroke-linecap=\"round\"/><path d=\"M3 8.5A4 4 0 0 0 10.5 9\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\" stroke-linecap=\"round\"/><path d=\"M5.5 3.5L3.5 5l2 1.5M8.5 10.5l2-1.5-2-1.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>",

  // ── Backup: download/save ──
  "backup": "<svg viewBox=\"0 0 14 14\"><path d=\"M7 1.5v7\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><path d=\"M4.5 6L7 8.5 9.5 6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M2 10.5v1.5h10v-1.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>",

  // ── Integrations: plug ──
  "plug": "<svg viewBox=\"0 0 14 14\"><path d=\"M4.5 1.5v3M9.5 1.5v3M3 4.5h8v2.5c0 2.5-1.8 4.5-4 4.5S3 9.5 3 7z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M7 11.5V13\" stroke=\"currentColor\" stroke-width=\"1.2\" stroke-linecap=\"round\"/></svg>",

  // ── 1C: calculator ──
  "calc": "<svg viewBox=\"0 0 14 14\"><rect x=\"2.5\" y=\"1.5\" width=\"9\" height=\"11\" rx=\"1\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\"/><rect x=\"4\" y=\"3\" width=\"6\" height=\"2.5\" rx=\"0.3\" fill=\"currentColor\" opacity=\"0.2\"/><circle cx=\"5\" cy=\"8\" r=\"0.6\" fill=\"currentColor\"/><circle cx=\"7\" cy=\"8\" r=\"0.6\" fill=\"currentColor\"/><circle cx=\"9\" cy=\"8\" r=\"0.6\" fill=\"currentColor\"/><circle cx=\"5\" cy=\"10.5\" r=\"0.6\" fill=\"currentColor\"/><circle cx=\"7\" cy=\"10.5\" r=\"0.6\" fill=\"currentColor\"/><circle cx=\"9\" cy=\"10.5\" r=\"0.6\" fill=\"currentColor\"/></svg>",

  // ── Telegram: paper plane ──
  "plane": "<svg viewBox=\"0 0 14 14\"><path d=\"M1.5 6.5L12 2 9 12.5l-2.5-4L1.5 6.5z\" fill=\"currentColor\" opacity=\"0.1\"/><path d=\"M1.5 6.5L12 2 9 12.5l-2.5-4L1.5 6.5zM6.5 8.5L12 2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1\" stroke-linejoin=\"round\"/></svg>",

  // ── Email: envelope ──
  "mail": "<svg viewBox=\"0 0 14 14\"><rect x=\"1.5\" y=\"3\" width=\"11\" height=\"8\" rx=\"1\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\"/><path d=\"M1.5 3l5.5 4.5L12.5 3\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\" stroke-linejoin=\"round\"/></svg>",

  // ── Payment: credit card ──
  "card": "<svg viewBox=\"0 0 14 14\"><rect x=\"1.5\" y=\"3\" width=\"11\" height=\"8\" rx=\"1\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\"/><path d=\"M1.5 6h11\" stroke=\"currentColor\" stroke-width=\"1.2\"/><path d=\"M4 9h3\" stroke=\"currentColor\" stroke-width=\"1\" stroke-linecap=\"round\" opacity=\"0.5\"/></svg>",

  // ── AI brain ──
  "brain": "<svg viewBox=\"0 0 14 14\"><path d=\"M7 12V7M7 7c0-2-1.5-3.5-3-3.5S1.5 4.5 1.5 6c0 1 .5 1.8 1.2 2.3C2 9 2 10 3 10.5c.8.4 2.2.5 4 1.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1\" stroke-linecap=\"round\"/><path d=\"M7 7c0-2 1.5-3.5 3-3.5S12.5 4.5 12.5 6c0 1-.5 1.8-1.2 2.3C12 9 12 10 11 10.5c-.8.4-2.2.5-4 1.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1\" stroke-linecap=\"round\"/></svg>",

  // ── LLM: chat bubble with spark ──
  "chat-ai": "<svg viewBox=\"0 0 14 14\"><path d=\"M2 2h10v7.5H5L2 12V2z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\" stroke-linejoin=\"round\"/><path d=\"M7 4v2.5M5.5 5.5l3-1M5.5 5l3 1\" stroke=\"currentColor\" stroke-width=\"0.9\" stroke-linecap=\"round\"/></svg>",

  // ── Prompt: pencil ──
  "pencil": "<svg viewBox=\"0 0 14 14\"><path d=\"M2 10l6.5-6.5 2 2L4 12H2v-2z\" fill=\"currentColor\" opacity=\"0.1\"/><path d=\"M2 10l6.5-6.5 2 2L4 12H2v-2zM7 5l2 2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\" stroke-linejoin=\"round\"/></svg>",

  // ── Safety: warning triangle ──
  "warning": "<svg viewBox=\"0 0 14 14\"><path d=\"M7 1.5L1 12h12z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.1\" stroke-linejoin=\"round\"/><path d=\"M7 5.5v3\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><circle cx=\"7\" cy=\"10.2\" r=\"0.7\" fill=\"currentColor\"/></svg>",

  // ── Module: box/package ──
  "package": "<svg viewBox=\"0 0 14 14\"><path d=\"M7 1.5L1.5 4.5v5L7 12.5l5.5-3v-5z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1\" stroke-linejoin=\"round\"/><path d=\"M7 7.5v5M1.5 4.5L7 7.5l5.5-3M4.2 3L9.8 6\" stroke=\"currentColor\" stroke-width=\"0.8\" stroke-linejoin=\"round\"/></svg>",

  // ── Person (generic/explore/general) ──
  "person": "<svg viewBox=\"0 0 14 14\"><circle cx=\"7\" cy=\"4\" r=\"2.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\"/><path d=\"M2.5 13c0-3 2-5 4.5-5s4.5 2 4.5 5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\" stroke-linecap=\"round\"/></svg>",
};

// ── Agent name → avatar key mapping ──
window.__AGENT_AVATAR_MAP = {
  // Directors
  "technical-director": "director",
  "product-director": "director",
  "delivery-director": "director",

  // Backend leads
  "backend-lead": "lead",
  "database-lead": "database",
  "frontend-lead": "lead",
  "qa-lead": "lead",
  "security-lead": "lead",
  "devops-lead": "lead",
  "integrations-lead": "lead",
  "ai-lead": "lead",
  "release-lead": "lead",

  // Backend specialists
  "celery-tasks-specialist": "bolt",
  "service-layer-specialist": "layers",
  "orm-optimizer": "speed",
  "migrations-specialist": "migrate",
  "drf-serializer-specialist": "api",
  "signals-specialist": "bolt",
  "api-designer": "api",
  "soft-delete-auditor": "eye",
  "logging-auditor": "eye",
  "weasyprint-specialist": "flask",
  "workflow-engine-specialist": "bolt",
  "approvals-specialist": "shield",
  "notifications-specialist": "mail",
  "async-realtime-specialist": "bolt",
  "decimal-money-specialist": "calc",
  "type-annotations-specialist": "api",
  "caching-specialist": "speed",
  "performance-specialist": "speed",
  "scalability-specialist": "speed",
  "refactoring-specialist": "layers",
  "tech-debt-specialist": "chart",

  // Module owners
  "crm-module-specialist": "package",
  "orders-module-specialist": "package",
  "warehouse-module-specialist": "package",
  "mes-module-specialist": "package",
  "finance-module-specialist": "package",
  "payroll-module-specialist": "package",

  // Frontend specialists
  "react-components-specialist": "atom",
  "react-state-specialist": "store",
  "ux-designer": "palette",
  "accessibility-specialist": "eye",
  "i18n-specialist": "globe",

  // QA specialists
  "pytest-specialist": "flask",
  "integration-test-specialist": "flask",
  "test-coverage-analyst": "chart",
  "edge-case-hunter": "crosshair",

  // Security specialists
  "auth-hardening-specialist": "key",
  "secrets-scanner": "eye",
  "security-auditor": "shield",
  "permissions-specialist": "key",
  "data-protection-specialist": "lock",
  "container-hardening-specialist": "container",
  "dependency-auditor": "eye",
  "infra-security-specialist": "shield",
  "rate-limit-specialist": "shield",
  "sql-injection-hunter": "crosshair",
  "threat-modeling-specialist": "crosshair",
  "152fz-specialist": "lock",

  // DevOps specialists
  "docker-compose-specialist": "container",
  "nginx-specialist": "globe",
  "ci-cd-pipeline-specialist": "cycle",
  "deployment-strategy-specialist": "cycle",
  "backup-recovery-specialist": "backup",
  "iac-specialist": "terminal",
  "incident-response-specialist": "warning",
  "observability-specialist": "chart",
  "structured-logging-specialist": "terminal",
  "alerting-specialist": "warning",
  "apm-specialist": "chart",
  "mcp-docker-health": "container",
  "media-files-specialist": "backup",
  "postgres-schema-specialist": "database",

  // Integration specialists
  "1c-integration-specialist": "calc",
  "telegram-bot-specialist": "plane",
  "payment-gateway-specialist": "card",
  "email-integration-specialist": "mail",
  "edo-specialist": "mail",
  "fns-ofd-specialist": "calc",
  "data-migration-specialist": "migrate",

  // AI specialists
  "llm-integration-specialist": "chat-ai",
  "ai-prompt-engineering-specialist": "pencil",
  "ai-safety-specialist": "warning",

  // Docs
  "api-docs-specialist": "api",
  "tech-docs-specialist": "pencil",
  "onboarding-specialist": "person",
  "reporting-specialist": "chart",
  "bi-integration-specialist": "chart",

  // Generic
  "Explore": "eye",
  "general-purpose": "person",
  "claude-code-guide": "chat-ai",
  "Plan": "layers",
};
