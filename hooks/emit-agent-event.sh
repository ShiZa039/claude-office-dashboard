#!/bin/bash
# Emit agent event to JSONL file for Claude Office Dashboard.
# Usage: piped from Claude Code hooks (SubagentStart/SubagentStop/Stop)
# Arg 1: event type (agent_start / agent_stop / session_stop)

EVENT_TYPE="${1:-unknown}"
EVENT_FILE="$HOME/.claude/agent-events.jsonl"
INPUT=$(cat)

TS=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")
SESSION=$(echo "$INPUT" | jq -r '.session_id // "unknown"' 2>/dev/null)

case "$EVENT_TYPE" in
  agent_start)
    AGENT=$(echo "$INPUT" | jq -r '.subagent_type // "general-purpose"' 2>/dev/null)
    TASK=$(echo "$INPUT" | jq -r '.description // ""' 2>/dev/null | head -c 80)
    echo "{\"ts\":\"$TS\",\"event\":\"agent_start\",\"agent\":\"$AGENT\",\"task\":\"$TASK\",\"session\":\"$SESSION\"}" >> "$EVENT_FILE"
    ;;
  agent_stop)
    AGENT=$(echo "$INPUT" | jq -r '.subagent_type // "general-purpose"' 2>/dev/null)
    TASK=$(echo "$INPUT" | jq -r '.description // ""' 2>/dev/null | head -c 80)
    echo "{\"ts\":\"$TS\",\"event\":\"agent_stop\",\"agent\":\"$AGENT\",\"task\":\"$TASK\",\"result\":\"success\",\"session\":\"$SESSION\"}" >> "$EVENT_FILE"
    ;;
  session_stop)
    echo "{\"ts\":\"$TS\",\"event\":\"session_stop\",\"session\":\"$SESSION\"}" >> "$EVENT_FILE"
    ;;
esac
