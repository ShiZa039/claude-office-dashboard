# Claude Office Dashboard — VSCode Extension

> Визуальный дашборд работы агентов Claude Code в виде карты офиса.
> Агенты отображаются как персонажи, перемещающиеся по комнатам в реальном времени.

## Архитектура

```
Claude Code (hooks)          Файловая система           VSCode Extension
┌──────────────┐     write   ┌──────────────────┐  watch  ┌─────────────────┐
│ SubagentStart ├───────────►│                  │◄────────┤ FileWatcher     │
│ SubagentStop  ├───────────►│ agent-events.jsonl│         │      │          │
│ Stop          ├───────────►│                  │         │      ▼          │
└──────────────┘             └──────────────────┘         │ EventParser     │
                                                          │      │          │
                                                          │      ▼          │
                                                          │ AgentStateStore │
                                                          │      │          │
                                                          │      ▼          │
                                                          │ Webview (HTML)  │
                                                          │  ┌───────────┐  │
                                                          │  │ Карта     │  │
                                                          │  │ офиса     │  │
                                                          │  └───────────┘  │
                                                          └─────────────────┘
```

## Компонент 1: Хуки Claude Code

Настраиваются в проекте-потребителе (BAZA_CRM `.claude/settings.local.json`).
Пишут JSONL-события в `~/.claude/agent-events.jsonl`.

### Формат событий

```jsonl
{"ts":"2026-04-16T14:00:00.123Z","event":"agent_start","agent":"backend-lead","task":"writing apps/crm/models.py","session":"abc123"}
{"ts":"2026-04-16T14:00:05.456Z","event":"agent_stop","agent":"backend-lead","result":"success","session":"abc123"}
{"ts":"2026-04-16T14:00:06.000Z","event":"agent_start","agent":"qa-lead","task":"writing tests for crm","session":"abc123"}
{"ts":"2026-04-16T14:00:12.000Z","event":"session_stop","session":"abc123"}
```

### Поля

| Поле | Тип | Описание |
|------|-----|----------|
| `ts` | ISO 8601 | Время события |
| `event` | enum | `agent_start`, `agent_stop`, `session_stop` |
| `agent` | string | Имя субагента (из SubagentStart payload) |
| `task` | string | Описание задачи (из prompt, первые 80 символов) |
| `result` | string | `success` / `error` (только для agent_stop) |
| `session` | string | ID сессии Claude Code |

### Хук-скрипты

```bash
# hooks/emit-agent-event.sh
#!/bin/bash
# Читает JSON со stdin, извлекает нужные поля, дописывает в JSONL
INPUT=$(cat)
EVENT_FILE="$HOME/.claude/agent-events.jsonl"

EVENT_TYPE="$1"  # agent_start / agent_stop / session_stop
AGENT=$(echo "$INPUT" | jq -r '.agent_name // .subagent_type // "unknown"')
TASK=$(echo "$INPUT" | jq -r '.description // .prompt // ""' | head -c 80)
SESSION=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
TS=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")

echo "{\"ts\":\"$TS\",\"event\":\"$EVENT_TYPE\",\"agent\":\"$AGENT\",\"task\":\"$TASK\",\"session\":\"$SESSION\"}" >> "$EVENT_FILE"
```

## Компонент 2: VSCode Extension

### Структура проекта

```
claude-office-dashboard/
├── package.json            # Extension manifest
├── tsconfig.json
├── src/
│   ├── extension.ts        # activate/deactivate, команды
│   ├── eventWatcher.ts     # fs.watch на JSONL файл
│   ├── eventParser.ts      # Парсинг JSONL строк
│   ├── agentState.ts       # Стейт-машина агентов (idle/working/done/error)
│   └── webview/
│       ├── provider.ts     # WebviewViewProvider
│       └── panel.ts        # Создание/обновление webview
├── media/
│   ├── office.html         # HTML карты офиса
│   ├── office.css          # Стили
│   ├── office.js           # Логика отрисовки + анимации
│   └── avatars/            # SVG-аватарки агентов
│       ├── backend-lead.svg
│       ├── frontend-lead.svg
│       ├── qa-lead.svg
│       └── ...
└── test/
    └── eventParser.test.ts
```

### Карта офиса — комнаты

Каждый тип агента привязан к «комнате» на карте:

| Комната | Агенты |
|---------|--------|
| Серверная | backend-lead, database-lead, celery-tasks-specialist |
| Дизайн-студия | frontend-lead, react-components-specialist, ux-designer |
| QA-лаборатория | qa-lead, pytest-specialist, integration-test-specialist |
| Штаб безопасности | security-lead, auth-hardening-specialist, secrets-scanner |
| Кабинет директора | technical-director, product-director, delivery-director |
| DevOps-бункер | devops-lead, docker-compose-specialist, nginx-specialist |
| Переговорная | integrations-lead, 1c-integration-specialist, telegram-bot-specialist |
| AI-лаборатория | ai-lead, llm-integration-specialist, ai-prompt-engineering-specialist |

### Состояния агента (визуально)

| Состояние | Визуализация |
|-----------|-------------|
| `idle` | Серая иконка, в своей комнате |
| `working` | Цветная иконка + пульсация, в своей комнате |
| `done` | Зелёная галочка, затухает через 5 сек → idle |
| `error` | Красный крестик, мигает |

### Команды расширения

- `Claude Office: Show Dashboard` — открыть/показать панель
- `Claude Office: Clear Events` — очистить лог событий
- `Claude Office: Set Events File` — указать путь к JSONL

### API между extension и webview

Extension → Webview (postMessage):
```typescript
interface AgentUpdate {
  type: 'agent_update';
  agents: Record<string, {
    name: string;
    state: 'idle' | 'working' | 'done' | 'error';
    task?: string;
    room: string;
    lastActivity?: string;
  }>;
}
```

## Этапы реализации

### Этап 1 — MVP (файл + расширение + статичная карта)
- [ ] Scaffold VSCode extension (yo code → TypeScript)
- [ ] Хук-скрипт `emit-agent-event.sh`
- [ ] `eventWatcher.ts` — fs.watch + tail новых строк
- [ ] `eventParser.ts` — парсинг JSONL
- [ ] `agentState.ts` — Map<agentName, AgentState>
- [ ] `provider.ts` — WebviewViewProvider
- [ ] `office.html` — статичная карта с CSS Grid (комнаты)
- [ ] `office.js` — приём postMessage, обновление DOM
- [ ] Настройка хуков в BAZA_CRM
- [ ] Ручное тестирование: запустить агента → увидеть на карте

### Этап 2 — Полировка
- [ ] SVG-аватарки для каждого типа агента
- [ ] Анимации переходов (CSS transitions)
- [ ] Tooltip при наведении (задача, время)
- [ ] Счётчик: сколько агентов работало, сколько задач выполнено
- [ ] Auto-scroll лог событий внизу карты

### Этап 3 — Расширения
- [ ] Поддержка нескольких сессий (tabs/colors)
- [ ] История: timeline за сессию
- [ ] Звуковые эффекты (опционально, для fun)
- [ ] Публикация в VS Code Marketplace
