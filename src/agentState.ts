import { AgentEvent, AgentState, getRoomForAgent } from './types';

const DONE_TIMEOUT_MS = 5000;
const STALE_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
const SWEEP_INTERVAL_MS = 30 * 1000;     // sweep every 30s

/**
 * Manages the state of all known agents.
 * Processes events and produces a snapshot for the webview.
 * - Single-session model: all agents live in one registry regardless of session.
 * - Stale guard: agent_start events older than STALE_TIMEOUT_MS never mark working.
 * - Periodic sweep moves working agents to idle if their last activity is stale.
 */
export class AgentStateStore {
  private agents: Map<string, AgentState> = new Map();
  private doneTimers: Map<string, NodeJS.Timeout> = new Map();
  private recentEvents: AgentEvent[] = [];
  private sweepTimer: NodeJS.Timeout | null = null;

  start(): void {
    if (this.sweepTimer) return;
    this.sweepTimer = setInterval(() => this.sweepStale(), SWEEP_INTERVAL_MS);
  }

  stop(): void {
    if (this.sweepTimer) {
      clearInterval(this.sweepTimer);
      this.sweepTimer = null;
    }
  }

  processEvent(event: AgentEvent): void {
    if (event.event === 'agent_start' || event.event === 'agent_stop') {
      this.recentEvents.push(event);
      if (this.recentEvents.length > 200) {
        this.recentEvents = this.recentEvents.slice(-200);
      }
    }

    switch (event.event) {
      case 'agent_start': {
        // Guard: if this start is older than STALE_TIMEOUT, don't resurrect working state.
        if (this.isStale(event.ts)) {
          if (!this.agents.has(event.agent)) {
            this.agents.set(event.agent, {
              name: event.agent,
              state: 'idle',
              room: getRoomForAgent(event.agent),
              lastActivity: event.ts,
            });
          }
          break;
        }
        this.clearDoneTimer(event.agent);
        this.agents.set(event.agent, {
          name: event.agent,
          state: 'working',
          task: event.task,
          room: getRoomForAgent(event.agent),
          lastActivity: event.ts,
        });
        break;
      }

      case 'agent_stop': {
        const state = event.result === 'error' ? 'error' : 'done';
        this.agents.set(event.agent, {
          name: event.agent,
          state,
          task: event.task,
          room: getRoomForAgent(event.agent),
          lastActivity: event.ts,
        });
        this.scheduleDoneTimer(event.agent);
        break;
      }

      case 'session_stop':
        // Any Stop hook resets all agents to idle — single-session model.
        for (const [name, agent] of this.agents) {
          this.clearDoneTimer(name);
          agent.state = 'idle';
          agent.task = undefined;
        }
        break;
    }
  }

  getSnapshot(): Record<string, AgentState> {
    const result: Record<string, AgentState> = {};
    for (const [name, state] of this.agents) {
      result[name] = { ...state };
    }
    return result;
  }

  getRecentEvents(): AgentEvent[] {
    return [...this.recentEvents];
  }

  clear(): void {
    for (const timer of this.doneTimers.values()) {
      clearTimeout(timer);
    }
    this.doneTimers.clear();
    this.agents.clear();
    this.recentEvents = [];
  }

  private isStale(ts: string): boolean {
    const t = Date.parse(ts);
    if (Number.isNaN(t)) return false;
    return Date.now() - t > STALE_TIMEOUT_MS;
  }

  private sweepStale(): void {
    let changed = false;
    const now = Date.now();
    for (const [name, agent] of this.agents) {
      if (agent.state !== 'working' || !agent.lastActivity) continue;
      const t = Date.parse(agent.lastActivity);
      if (!Number.isNaN(t) && now - t > STALE_TIMEOUT_MS) {
        this.clearDoneTimer(name);
        agent.state = 'idle';
        agent.task = undefined;
        changed = true;
      }
    }
    if (changed) this.onChange?.();
  }

  private scheduleDoneTimer(agentName: string): void {
    this.clearDoneTimer(agentName);
    const timer = setTimeout(() => {
      const agent = this.agents.get(agentName);
      if (agent && (agent.state === 'done' || agent.state === 'error')) {
        agent.state = 'idle';
        agent.task = undefined;
        this.onChange?.();
      }
      this.doneTimers.delete(agentName);
    }, DONE_TIMEOUT_MS);
    this.doneTimers.set(agentName, timer);
  }

  private clearDoneTimer(agentName: string): void {
    const existing = this.doneTimers.get(agentName);
    if (existing) {
      clearTimeout(existing);
      this.doneTimers.delete(agentName);
    }
  }

  /** Callback for timer-driven state changes */
  onChange?: () => void;
}
