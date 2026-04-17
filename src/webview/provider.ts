import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { AgentState } from '../types';

export class OfficeDashboardProvider {
  private panel: vscode.WebviewPanel | null = null;
  private webviewReady = false;
  private pendingState: { agents: Record<string, AgentState> } | null = null;
  private lastUsage: unknown = null;
  private lastUsageError: string | null = null;

  constructor(private extensionUri: vscode.Uri) {}

  /** Callback invoked when the webview signals it's ready */
  onReady?: () => void;

  show(): void {
    if (this.panel) {
      this.panel.reveal();
      return;
    }

    this.webviewReady = false;

    this.panel = vscode.window.createWebviewPanel(
      'claudeOffice',
      'Claude Office',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.joinPath(this.extensionUri, 'media'),
        ],
      }
    );

    this.panel.webview.html = this.getHtml(this.panel.webview);

    this.panel.webview.onDidReceiveMessage((msg) => {
      if (msg.type === 'webview_ready') {
        this.webviewReady = true;
        if (this.pendingState) {
          this.postToWebview(this.pendingState.agents);
          this.pendingState = null;
        }
        if (this.lastUsage !== null) {
          this.panel?.webview.postMessage({ type: 'usage_update', data: this.lastUsage });
        } else if (this.lastUsageError) {
          this.panel?.webview.postMessage({ type: 'usage_error', message: this.lastUsageError });
        }
        if (this.onReady) {
          this.onReady();
        }
      }
    });

    this.panel.onDidDispose(() => {
      this.panel = null;
      this.webviewReady = false;
    });
  }

  updateAgents(agents: Record<string, AgentState>): void {
    if (this.panel && this.webviewReady) {
      this.postToWebview(agents);
    } else {
      this.pendingState = { agents };
    }
  }

  updateUsage(data: unknown): void {
    this.lastUsage = data;
    this.lastUsageError = null;
    if (this.panel && this.webviewReady) {
      this.panel.webview.postMessage({ type: 'usage_update', data });
    }
  }

  reportUsageError(message: string): void {
    this.lastUsageError = message;
    if (this.panel && this.webviewReady) {
      this.panel.webview.postMessage({ type: 'usage_error', message });
    }
  }

  isVisible(): boolean {
    return this.panel !== null && this.webviewReady;
  }

  private postToWebview(agents: Record<string, AgentState>): void {
    if (this.panel) {
      this.panel.webview.postMessage({
        type: 'full_state',
        agents,
      });
    }
  }

  private getHtml(webview: vscode.Webview): string {
    const mediaPath = path.join(this.extensionUri.fsPath, 'media');
    const htmlPath = path.join(mediaPath, 'office.html');

    let html = fs.readFileSync(htmlPath, 'utf-8');

    // Generate nonce for CSP
    const nonce = this.getNonce();

    // Replace resource paths for CSP
    const cssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'media', 'office.css')
    );
    const jsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'media', 'office.js')
    );
    const iconsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'media', 'icons.js')
    );
    const avatarsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'media', 'avatars.js')
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
    // noqa: secret — this is an alphabet for nonce generation, not a secret
    const possible = 'ABCDEFGHIJKLMNOP' + 'QRSTUVWXYZabcdef' + 'ghijklmnopqrstuv' + 'wxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
