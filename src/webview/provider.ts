import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { AgentState } from '../types';

export class OfficeDashboardProvider implements vscode.WebviewViewProvider {
  public static readonly viewId = 'claudeOffice.dashboard';

  private view: vscode.WebviewView | null = null;
  private webviewReady = false;
  private pendingState: { agents: Record<string, AgentState> } | null = null;
  private lastUsage: unknown = null;
  private lastUsageError: string | null = null;

  constructor(private extensionUri: vscode.Uri) {}

  /** Callback invoked when the webview signals it's ready */
  onReady?: () => void;

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ): void {
    this.view = webviewView;
    this.webviewReady = false;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'media')],
    };

    webviewView.webview.html = this.getHtml(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((msg) => {
      if (msg.type !== 'webview_ready') return;
      this.webviewReady = true;
      if (this.pendingState) {
        this.postToWebview(this.pendingState.agents);
        this.pendingState = null;
      }
      if (this.lastUsage !== null) {
        webviewView.webview.postMessage({ type: 'usage_update', data: this.lastUsage });
      } else if (this.lastUsageError) {
        webviewView.webview.postMessage({ type: 'usage_error', message: this.lastUsageError });
      }
      this.onReady?.();
    });

    webviewView.onDidDispose(() => {
      this.view = null;
      this.webviewReady = false;
    });
  }

  /** Focus the dashboard view in the Activity Bar. */
  show(): void {
    vscode.commands.executeCommand(`${OfficeDashboardProvider.viewId}.focus`);
  }

  updateAgents(agents: Record<string, AgentState>): void {
    if (this.view && this.webviewReady) {
      this.postToWebview(agents);
    } else {
      this.pendingState = { agents };
    }
  }

  updateUsage(data: unknown): void {
    this.lastUsage = data;
    this.lastUsageError = null;
    if (this.view && this.webviewReady) {
      this.view.webview.postMessage({ type: 'usage_update', data });
    }
  }

  reportUsageError(message: string): void {
    this.lastUsageError = message;
    if (this.view && this.webviewReady) {
      this.view.webview.postMessage({ type: 'usage_error', message });
    }
  }

  isVisible(): boolean {
    return this.view !== null && this.webviewReady;
  }

  private postToWebview(agents: Record<string, AgentState>): void {
    this.view?.webview.postMessage({ type: 'full_state', agents });
  }

  private getHtml(webview: vscode.Webview): string {
    const mediaPath = path.join(this.extensionUri.fsPath, 'media');
    const htmlPath = path.join(mediaPath, 'office.html');

    let html = fs.readFileSync(htmlPath, 'utf-8');

    const nonce = this.getNonce();

    const cssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'media', 'office.css'),
    );
    const jsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'media', 'office.js'),
    );
    const iconsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'media', 'icons.js'),
    );
    const avatarsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'media', 'avatars.js'),
    );

    html = html.replace('{{cssUri}}', cssUri.toString());
    html = html.replace('{{jsUri}}', jsUri.toString());
    html = html.replace('{{iconsUri}}', iconsUri.toString());
    html = html.replace('{{avatarsUri}}', avatarsUri.toString());
    html = html.replace(/\{\{cspSource\}\}/g, webview.cspSource);
    html = html.replace(/\{\{nonce\}\}/g, nonce);

    return html;
  }

  private getNonce(): string {
    let text = '';
    // noqa: secret — alphabet for nonce generation, not a secret
    const possible = 'ABCDEFGHIJKLMNOP' + 'QRSTUVWXYZabcdef' + 'ghijklmnopqrstuv' + 'wxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
