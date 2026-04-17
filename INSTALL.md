# Установка Claude Office Dashboard

Расширение визуализирует работу субагентов Claude Code как «офис с комнатами». Состоит из двух частей:

1. **Хуки** Claude Code (Python-скрипт + `~/.claude/settings.json`) — пишут события в `~/.claude/agent-events.jsonl`.
2. **VSCode-расширение** — читает JSONL и рисует дашборд.

---

## Часть 1. Установка на новой машине

### Требования

- VSCode ≥ 1.85
- Claude Code CLI (любая версия с поддержкой `SubagentStart`/`SubagentStop`/`Stop` хуков)
- Python 3 в `PATH` (на Windows — обычно идёт с Python.org installer; на Linux/macOS — `python3`)
- (опционально) Node.js + npx — для панели Plan usage через `ccusage`

### Шаг 1. Хук-скрипт на user-level

Файл-эмиттер событий должен лежать в `~/.claude/hooks/emit-agent-event.py`.

**Windows (PowerShell):**

```powershell
$dst = "$env:USERPROFILE\.claude\hooks"
New-Item -ItemType Directory -Force -Path $dst | Out-Null
Copy-Item "D:\path\to\claude-office-dashboard\hooks\emit-agent-event.py" "$dst\"
```

**Linux/macOS (bash):**

```bash
mkdir -p ~/.claude/hooks
cp /path/to/claude-office-dashboard/hooks/emit-agent-event.py ~/.claude/hooks/
```

Если на Linux команда `python` указывает на Python 2 — поправь `~/.claude/settings.json` ниже, заменив `python` на `python3`.

### Шаг 2. Регистрация хуков в `~/.claude/settings.json`

Открой (или создай) `~/.claude/settings.json` и добавь блок `hooks`. Если файл уже есть — мерджи аккуратно, не затирая остальные настройки.

```json
{
  "hooks": {
    "SubagentStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python \"$HOME/.claude/hooks/emit-agent-event.py\" agent_start",
            "timeout": 5
          }
        ]
      }
    ],
    "SubagentStop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python \"$HOME/.claude/hooks/emit-agent-event.py\" agent_stop",
            "timeout": 5
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python \"$HOME/.claude/hooks/emit-agent-event.py\" session_stop",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

`$HOME` Claude Code раскрывает сам — работает и в Windows, и в Unix-shell.

### Шаг 3. Проверка хука

Запусти любую сессию Claude Code и спавни короткий субагент. После этого:

```powershell
# Windows
Get-Content "$env:USERPROFILE\.claude\agent-events.jsonl" -Tail 5
```

```bash
# Linux/macOS
tail -5 ~/.claude/agent-events.jsonl
```

Должны быть строки вида:

```json
{"ts":"2026-04-17T14:23:11.000Z","event":"agent_start","session":"...","cwd":"/path/to/project","agent":"backend-lead","task":"backend-lead"}
{"ts":"2026-04-17T14:23:14.000Z","event":"agent_stop","session":"...","cwd":"/path/to/project","agent":"backend-lead","task":"...","result":"success"}
```

Если строк нет — смотри `~/.claude/hook-debug.json` (Claude Code пишет туда последние ошибки хуков).

### Шаг 4. Установка VSCode-расширения

Возьми последний `.vsix` из `D:\Code projects\claude-office-dashboard\` (на момент написания — `claude-office-dashboard-0.7.0.vsix`).

**Windows (PowerShell):**

```powershell
& 'C:\Users\<user>\AppData\Local\Programs\Microsoft VS Code\bin\code.cmd' `
  --install-extension 'D:\path\to\claude-office-dashboard-0.7.0.vsix' `
  --force
```

**Linux/macOS:**

```bash
code --install-extension /path/to/claude-office-dashboard-0.7.0.vsix --force
```

Затем `Ctrl+Shift+P` → **Developer: Reload Window**.

### Шаг 5. Проверка

В Activity Bar (левая полоса VSCode) появится иконка домика — это панель **Claude Office**. Клик по ней откроет дашборд. На пустой машине будет «Лобби пустует» — это норма, события появятся когда Claude Code запустит первый субагент.

`View → Output → Claude Office` — лог расширения, в нём при старте видна строка `cwd filter = <путь к workspace>`.

---

## Часть 2. Настройка под новый проект

В большинстве случаев **ничего настраивать не нужно** — просто открой проект в VSCode, и дашборд сам отфильтрует события по `cwd` текущего workspace (`claudeOffice.scope = workspace` по умолчанию).

Кастомизация нужна, только если:
- В проекте свои субагенты с именами, которых нет в дефолтном маппинге.
- Хочется видеть ВСЕ окна VSCode в одной панели (отключить per-window isolation).

### Свои агенты → свои комнаты

Известные комнаты: `directors`, `backend`, `frontend`, `qa`, `security`, `devops`, `integrations`, `ai-lab`, `lobby`.

Открой `Ctrl+,` (Settings) → **Workspace** tab → ищи `claudeOffice.agentRooms` → **Edit in settings.json**:

```json
{
  "claudeOffice.agentRooms": {
    "my-custom-billing-agent": "backend",
    "ux-research-agent": "frontend",
    "compliance-checker": "security"
  }
}
```

Маппинг мерджится поверх дефолта. Изменения подхватываются на лету (без Reload).

Если агент не указан явно и его имя не подходит под эвристику суффиксов (`*-lead`, `*-specialist`, `*-director`, токены `react/django/docker/qa/security/...`) — он попадёт в **Лобби**.

### Отключить per-window изоляцию

Если хочешь видеть события из всех окон VSCode сразу (старое поведение до v0.7.0):

```json
{
  "claudeOffice.scope": "global"
}
```

Это можно поставить либо глобально (User Settings), либо точечно для одного workspace.

### Настройка лимитов Plan usage

```json
{
  "claudeOffice.usage.enabled": true,
  "claudeOffice.usage.pollSeconds": 90,
  "claudeOffice.usage.limitBlockUsd": 50,
  "claudeOffice.usage.limitWeeklyUsd": 200,
  "claudeOffice.usage.limitWeeklyOpusUsd": 100
}
```

`0` для лимита = не показывать прогресс-бар, только цифру в долларах. Для работы панели нужен `npx` в PATH (используется `ccusage@latest`).

---

## Часть 3. Тест после установки

1. Открой проект в VSCode → Activity Bar → **Claude Office**.
2. В Output-панели проверь строку `cwd filter = <твой проект>`.
3. Запусти Claude Code в этом проекте, попроси спавнить любой субагент.
4. В дашборде должна появиться фигурка в соответствующей комнате (working → done через 5 сек → idle).
5. Если события не приходят — `Ctrl+Shift+P` → **Claude Office: Clear Events** (сбросит старый кэш) и повтори.

---

## Troubleshooting

| Симптом | Причина | Что делать |
|---|---|---|
| Дашборд пустой, в Output `cwd filter = ...` есть | Хуки не пишут события | Проверь `~/.claude/agent-events.jsonl` — растёт ли файл |
| `agent-events.jsonl` пустой | Хуки не зарегистрированы | Перепроверь `~/.claude/settings.json`, рестарт Claude Code |
| Кириллица в `task` ломается (`Р¤Р°Р№Р»`) | Старый `emit-agent-event.py` без UTF-8 fix | Скопируй свежий скрипт из `hooks/emit-agent-event.py` (с `sys.stdin.buffer.read().decode("utf-8")`) |
| События приходят, но не отображаются | Cwd-фильтр режет всё | В Output смотри строку `cwd filter`. Если путь не совпадает с workspace — поставь `claudeOffice.scope = global` для проверки |
| Агент всегда в Лобби | Имя не в маппинге и не подходит под эвристику | Добавь в `claudeOffice.agentRooms` явно |
| Plan usage показывает `--` | `npx ccusage` не отвечает за 30 сек | Запусти вручную `npx --yes ccusage@latest blocks --active --json` — увидишь реальную ошибку |

---

## Обновление расширения

```powershell
# Windows
& 'C:\Users\<user>\AppData\Local\Programs\Microsoft VS Code\bin\code.cmd' `
  --install-extension 'D:\path\to\claude-office-dashboard-X.Y.Z.vsix' `
  --force
```

Затем **Developer: Reload Window**. Хуки обновлять отдельно — только если меняется сам `emit-agent-event.py` (например, новый формат событий).
