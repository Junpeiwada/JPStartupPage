import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { getStartPageHtml } from './startPageHtml';

export interface ProjectEntry {
  name: string;
  path: string;
  isGit: boolean;
}

export interface RecentEntry {
  path: string;
  openedAt: number;
}

const RECENT_KEY = 'recentProjects';
const RECENT_STORE_MAX = 50;

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('jpstartuppage.show', () => showStartPage(context))
  );

  const config = vscode.workspace.getConfiguration('jpstartuppage');
  const isEmptyWindow = !vscode.workspace.workspaceFolders;
  if (config.get<boolean>('showOnStartup', true) && isEmptyWindow) {
    showStartPage(context);
  }
}

export function deactivate(): void {}

function expandHome(p: string): string {
  return p.startsWith('~') ? path.join(os.homedir(), p.slice(1)) : p;
}

function scanProjects(): ProjectEntry[] {
  const config = vscode.workspace.getConfiguration('jpstartuppage');
  const roots = config.get<string[]>('scanRoots', ['~/Documents/Project']);
  const entries: ProjectEntry[] = [];
  for (const root of roots) {
    const rootPath = expandHome(root);
    let dirents: fs.Dirent[];
    try {
      dirents = fs.readdirSync(rootPath, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const d of dirents) {
      if (!d.isDirectory() || d.name.startsWith('.')) {
        continue;
      }
      const full = path.join(rootPath, d.name);
      entries.push({
        name: d.name,
        path: full,
        isGit: fs.existsSync(path.join(full, '.git')),
      });
    }
  }
  entries.sort((a, b) => a.name.localeCompare(b.name, 'ja', { sensitivity: 'base' }));
  return entries;
}

function getRecents(context: vscode.ExtensionContext): RecentEntry[] {
  const config = vscode.workspace.getConfiguration('jpstartuppage');
  const count = config.get<number>('recentCount', 10);
  return context.globalState
    .get<RecentEntry[]>(RECENT_KEY, [])
    .filter((r) => fs.existsSync(r.path))
    .sort((a, b) => b.openedAt - a.openedAt)
    .slice(0, count);
}

async function recordRecent(context: vscode.ExtensionContext, projectPath: string): Promise<void> {
  const recents = context.globalState
    .get<RecentEntry[]>(RECENT_KEY, [])
    .filter((r) => r.path !== projectPath);
  recents.push({ path: projectPath, openedAt: Date.now() });
  await context.globalState.update(RECENT_KEY, recents.slice(-RECENT_STORE_MAX));
}

function showStartPage(context: vscode.ExtensionContext): void {
  const panel = vscode.window.createWebviewPanel(
    'jpStartupPage',
    'Startup Page',
    vscode.ViewColumn.One,
    { enableScripts: true }
  );

  const sendData = (): void => {
    void panel.webview.postMessage({
      type: 'data',
      projects: scanProjects(),
      recents: getRecents(context),
    });
  };

  panel.webview.html = getStartPageHtml();
  panel.webview.onDidReceiveMessage(
    async (msg: { type: string; path?: string; newWindow?: boolean }) => {
      if (msg.type === 'ready' || msg.type === 'refresh') {
        sendData();
      } else if (msg.type === 'open' && msg.path) {
        await recordRecent(context, msg.path);
        await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(msg.path), {
          forceNewWindow: !!msg.newWindow,
        });
      }
    },
    undefined,
    context.subscriptions
  );
}
