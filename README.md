# Claude Office Dashboard

> VSCode-расширение, визуализирующее работу субагентов [Claude Code](https://docs.claude.com/claude-code) как карту офиса с комнатами. Каждый субагент появляется фигуркой в своей «комнате» (Backend, Frontend, QA, Security, DevOps, AI-lab и т.д.), пульсирует пока работает, и отмечается галочкой по завершении.

**Текущая версия:** `v0.7.0` · per-window isolation, Activity Bar auto-start, Plan usage panel, timeline picker.

---

## Зачем это

Когда оркестрируешь несколько субагентов параллельно — теряешь представление о том, кто чем занят и сколько ещё ждать. Этот дашборд даёт:

- **Карту офиса** — кто работает прямо сейчас и в каком модуле.
- **Timeline** (Canvas) — кто запускался когда, окно настраивается (5 мин — 6 часов).
- **Activity log** — последние 50 событий start/stop.
- **Plan usage** — текущий 5-часовой блок + неделя + неделя Opus, через `ccusage`.
- **Per-window isolation** — каждое окно VSCode видит только свои субагенты, фильтр по `cwd` workspace.

## Как это работает

```
Claude Code hooks → ~/.claude/agent-events.jsonl → VSCode extension → Webview
   (SubagentStart/Stop, Stop)        ↑                  ↑
                    Python emit-agent-event.py    fs.watch + polling
```

1. Хуки Claude Code запускают `~/.claude/hooks/emit-agent-event.py`, который дописывает JSONL-событие.
2. Расширение слушает файл (`fs.watch` + polling 1 сек) и держит in-memory стейт агентов.
3. Webview рисует карту, timeline и счётчики; обновления через `postMessage`.
4. Cwd-фильтр (`claudeOffice.scope = workspace`) отбрасывает события из других окон VSCode.

## Комнаты и маппинг агентов

| Комната | Агенты-примеры |
|---------|----------------|
| Кабинет директора | technical-director, product-director, delivery-director |
| Серверная | backend-lead, database-lead, celery-tasks-specialist |
| Дизайн-студия | frontend-lead, react-components-specialist, ux-designer |
| QA-лаборатория | qa-lead, pytest-specialist, integration-test-specialist |
| Штаб безопасности | security-lead, auth-hardening-specialist, secrets-scanner |
| DevOps-бункер | devops-lead, docker-compose-specialist, nginx-specialist |
| Переговорная | integrations-lead, 1c-integration-specialist, telegram-bot-specialist |
| AI-лаборатория | ai-lead, llm-integration-specialist |
| Лобби | все неизвестные агенты (fallback) |

Маппинг расширяется через `claudeOffice.agentRooms` в settings.json (см. [INSTALL.md](INSTALL.md#свои-агенты--свои-комнаты)).

## Установка

Полная инструкция — [INSTALL.md](INSTALL.md).

Кратко (Windows):

```powershell
# 1. Хук-скрипт
$dst = "$env:USERPROFILE\.claude\hooks"
New-Item -ItemType Directory -Force -Path $dst | Out-Null
Copy-Item .\hooks\emit-agent-event.py "$dst\"

# 2. Регистрация хуков в ~/.claude/settings.json (см. INSTALL.md, шаг 2)

# 3. Установка расширения
code --install-extension .\claude-office-dashboard-0.7.0.vsix --force
```

После Reload Window иконка домика появится в Activity Bar.

## Конфигурация

| Setting | Default | Описание |
|---------|---------|----------|
| `claudeOffice.scope` | `workspace` | `workspace` = только это окно (фильтр по cwd); `global` = все окна |
| `claudeOffice.agentRooms` | `{}` | Кастомный маппинг агентов в комнаты, мерджится поверх дефолта |
| `claudeOffice.eventsFile` | `~/.claude/agent-events.jsonl` | Путь к JSONL-файлу событий |
| `claudeOffice.usage.enabled` | `true` | Включить Plan usage панель (требует `npx`) |
| `claudeOffice.usage.pollSeconds` | `90` | Интервал обновления usage |
| `claudeOffice.usage.limitBlockUsd` | `0` | Лимит на 5-часовой блок (0 = только цифра без прогрессбара) |
| `claudeOffice.usage.limitWeeklyUsd` | `0` | Лимит на неделю |
| `claudeOffice.usage.limitWeeklyOpusUsd` | `0` | Лимит на неделю по Opus |

## Команды

- `Claude Office: Show Dashboard` — фокус на панель в Activity Bar
- `Claude Office: Open Dashboard in Editor` — открыть как обычную вкладку (параллельно sidebar)
- `Claude Office: Clear Events` — сброс кэша событий

## Разработка

```bash
git clone https://github.com/ShiZa039/claude-office-dashboard.git
cd claude-office-dashboard
npm install
npm run compile        # tsc → out/
npm test               # eventParser + types + agentState тесты
npx @vscode/vsce package  # собрать .vsix
```

Архитектура подробно — [PLAN.md](PLAN.md).
Дорожная карта — [ROADMAP.md](ROADMAP.md).

## Системные требования

- VSCode ≥ 1.85
- Claude Code CLI с поддержкой `SubagentStart`/`SubagentStop`/`Stop` хуков
- Python 3 в `PATH`
- (опционально) Node.js + `npx` — для Plan usage панели

## Известные ограничения

- `SubagentStart` не передаёт `description`/`prompt` ([anthropics/claude-code#19170](https://github.com/anthropics/claude-code/issues/19170)) — поле `task` заполняется из `last_assistant_message` в `agent_stop`.
- `npx ccusage` имеет холодный старт ~5 сек при первом запуске.
- Звуковые эффекты не планируются.

## Лицензия

TBD — см. [ROADMAP.md](ROADMAP.md).
