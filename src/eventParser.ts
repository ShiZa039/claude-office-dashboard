import { AgentEvent } from './types';

/**
 * Parse a single JSONL line into an AgentEvent.
 * Returns null if the line is invalid or empty.
 */
export function parseLine(line: string): AgentEvent | null {
  const trimmed = line.trim();
  if (!trimmed) {
    return null;
  }
  try {
    const obj = JSON.parse(trimmed);
    if (!obj.event || !obj.session) {
      return null;
    }
    return obj as AgentEvent;
  } catch {
    return null;
  }
}

/**
 * Parse multiple JSONL lines, skipping invalid ones.
 */
export function parseLines(text: string): AgentEvent[] {
  return text
    .split('\n')
    .map(parseLine)
    .filter((e): e is AgentEvent => e !== null);
}
