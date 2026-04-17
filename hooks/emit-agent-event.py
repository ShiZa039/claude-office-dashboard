"""Emit agent event to JSONL file for Claude Office Dashboard.

Reads hook JSON from stdin, writes event to ~/.claude/agent-events.jsonl.
Usage: python emit-agent-event.py <event_type>
  event_type: agent_start | agent_stop | session_stop
"""
import json
import sys
import os
from datetime import datetime, timezone

def main():
    event_type = sys.argv[1] if len(sys.argv) > 1 else "unknown"
    event_file = os.path.join(os.path.expanduser("~"), ".claude", "agent-events.jsonl")

    # Ensure directory exists
    os.makedirs(os.path.dirname(event_file), exist_ok=True)

    try:
        raw = sys.stdin.buffer.read().decode("utf-8", errors="replace")
        data = json.loads(raw) if raw.strip() else {}
    except (json.JSONDecodeError, Exception):
        data = {}

    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")
    session = data.get("session_id", "unknown")
    cwd = data.get("cwd", "")

    event = {"ts": ts, "event": event_type, "session": session, "cwd": cwd}

    if event_type in ("agent_start", "agent_stop"):
        event["agent"] = data.get("agent_name", data.get("agent_type", "general-purpose"))
        if event_type == "agent_stop":
            msg = data.get("last_assistant_message", "")
            event["task"] = msg[:80] if msg else ""
            event["result"] = "success"
        else:
            event["task"] = data.get("agent_name", "")

    with open(event_file, "a", encoding="utf-8") as f:
        f.write(json.dumps(event, ensure_ascii=False) + "\n")

if __name__ == "__main__":
    main()
