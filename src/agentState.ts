import { AgentEvent, AgentState, getRoomForAgent } from './types';

const DONE_TIMEOUT_MS = 5000;

/**
 * Manages the state of all known agents.
 * Processes events and produces a snapshot for the webview.
 */
export class AgentStateStore {
  private agents: Map<string, AgentState> = new Map();
  private doneTimers: Map<string, NodeJS.Timeout> = new Map();

  processEvent(event: AgentEvent): void {
    switch (event.event) {
      case 'agent_start':
        this.clearDoneTimer(event.agent);
        this.agents.set(event.agent, {
          name: event.agent,
          state: 'working',
          task: event.task,
          room: getRoomForAgent(event.agent),
          lastActivity: event.ts,
        });
        break;

      case 'agent_stop': {
        const state = event.result === 'error' ? 'error' : 'done';
        this.agents.set(event.agent, {
          name: event.agent,
          state,
          task: event.task,
          room: getRoomForAgent(event.agent),
          lastActivity: event.ts,
        });
        // Auto-transition to idle after timeout
        this.scheduleDoneTimer(event.agent);
        break;
      }

      case 'session_stop':
        // All agents go idle
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

  clear(): void {
    for (const timer of this.doneTimers.values()) {
      clearTimeout(timer);
    }
    this.doneTimers.clear();
    this.agents.clear();
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
