"""Debug: dump raw stdin from Claude Code hook to a file."""
import sys
import os
import json

debug_file = os.path.join(os.path.expanduser("~"), ".claude", "hook-debug.json")
raw = sys.stdin.read()
with open(debug_file, "w", encoding="utf-8") as f:
    f.write(raw)
