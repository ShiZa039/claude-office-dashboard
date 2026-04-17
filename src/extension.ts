import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { EventWatcher } from './eventWatcher';
import { AgentStateStore } from './agentState';
import { OfficeDashboardProvider } from './webview/provider';
import { UsageWatcher } from './usageWatcher';
import { getRoomForAgent } from './types';

function buildRoomResolver(): (name: string) => string {
  const customMap = vscode.workspace
    .getConfiguration('claudeOffice')
    .get<Record<string, string>>('agentRooms', {});
  return (name) => getRoomForAgent(name, customMap);
}

function currentCwdFilter(): string | null {
  const scope = vscode.workspace
    .getConfiguration('claudeOffice')
    .get<string>('scope', 'workspace');
  if (scope === 'global') return null;
  const folder = vscode.workspace.workspaceFolders?.[0];
  return folder ? folder.uri.fsPath : null;
}

let watcher: EventWatcher | null = null;
let store: AgentStateStore | null = null;
let usageWatcher: UsageWatcher | null = null;
const log = vscode.window.createOutputChannel('Claude Office');

export function activate(context: vscode.ExtensionContext) {
  store = new AgentStateStore();
  store.setRoomResolver(buildRoomResolver());
  store.setCwdFilter(currentCwdFilter());
  log.appendLine(`Claude Office: cwd filter = ${currentCwdFilter() ?? '(global, no filter)'}`);
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

  const viewRegistration = vscode.window.registerWebviewViewProvider(
    OfficeDashboardProvider.viewId,
    provider,
    { webviewOptions: { retainContextWhenHidden: true } },
  );

  const showCmd = vscode.commands.registerCommand('claudeOffice.showDashboard', () => {
    provider.show();
  });

  const openInEditorCmd = vscode.commands.registerCommand('claudeOffice.openInEditor', () => {
    provider.openInEditor();
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

  const usageEnabled = vscode.workspace
    .getConfiguration('claudeOffice')
    .get<boolean>('usage.enabled', true);

  if (usageEnabled) {
    usageWatcher = new UsageWatcher(
      log,
      (snapshot) => provider.updateUsage(snapshot),
      (message) => provider.reportUsageError(message),
    );
    usageWatcher.start();
  }

  const cfgChange = vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('claudeOffice.agentRooms') && store) {
      store.setRoomResolver(buildRoomResolver());
    }
    if (e.affectsConfiguration('claudeOffice.scope') && store) {
      store.setCwdFilter(currentCwdFilter());
      store.clear();
      provider.updateAgents(store.getSnapshot());
    }
    if (!e.affectsConfiguration('claudeOffice.usage')) return;
    const enabled = vscode.workspace
      .getConfiguration('claudeOffice')
      .get<boolean>('usage.enabled', true);
    if (enabled && !usageWatcher) {
      usageWatcher = new UsageWatcher(
        log,
        (snapshot) => provider.updateUsage(snapshot),
        (message) => provider.reportUsageError(message),
      );
      usageWatcher.start();
    } else if (!enabled && usageWatcher) {
      usageWatcher.stop();
      usageWatcher = null;
    } else if (enabled && usageWatcher) {
      usageWatcher.restart();
    }
  });

  context.subscriptions.push(viewRegistration, showCmd, openInEditorCmd, clearCmd, cfgChange);
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
  if (usageWatcher) {
    usageWatcher.stop();
    usageWatcher = null;
  }
}
