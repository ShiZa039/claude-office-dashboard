import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { EventWatcher } from './eventWatcher';
import { AgentStateStore } from './agentState';
import { OfficeDashboardProvider } from './webview/provider';

let watcher: EventWatcher | null = null;
let store: AgentStateStore | null = null;
const log = vscode.window.createOutputChannel('Claude Office');

export function activate(context: vscode.ExtensionContext) {
  store = new AgentStateStore();
  const provider = new OfficeDashboardProvider(context.extensionUri);

  const configPath = vscode.workspace
    .getConfiguration('claudeOffice')
    .get<string>('eventsFile');

  const eventsFile = configPath || path.join(os.homedir(), '.claude', 'agent-events.jsonl');
  log.appendLine(`Claude Office: watching ${eventsFile}`);

  const broadcastState = () => {
    if (!store) return;
    provider.updateAgents(store.getSnapshot());
  };

  store.onChange = broadcastState;
  store.start();

  watcher = new EventWatcher(eventsFile, (events) => {
    if (!store) return;
    for (const event of events) {
      store.processEvent(event);
    }
    broadcastState();
  });
  watcher.start();

  provider.onReady = broadcastState;

  const showCmd = vscode.commands.registerCommand('claudeOffice.showDashboard', () => {
    provider.show();
  });

  const clearCmd = vscode.commands.registerCommand('claudeOffice.clearEvents', () => {
    if (!store) return;
    store.clear();
    try {
      fs.writeFileSync(eventsFile, '');
    } catch {
      // ignore
    }
    broadcastState();
    vscode.window.showInformationMessage('Agent events cleared');
  });

  context.subscriptions.push(showCmd, clearCmd);
}

export function deactivate() {
  if (watcher) {
    watcher.stop();
    watcher = null;
  }
  if (store) {
    store.stop();
    store = null;
  }
}
