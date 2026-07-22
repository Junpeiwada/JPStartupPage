export function getStartPageHtml(): string {
  return /* html */ `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Startup Page</title>
<style>
  :root {
    color-scheme: light dark;
  }
  body {
    font-family: var(--vscode-font-family);
    color: var(--vscode-foreground);
    background: var(--vscode-editor-background);
    margin: 0;
    padding: 0 16px;
  }
  .wrap {
    max-width: 760px;
    margin: 0 auto;
    padding: 32px 0 48px;
  }
  h1 {
    font-size: 22px;
    font-weight: 600;
    margin: 0 0 4px;
  }
  .subtitle {
    color: var(--vscode-descriptionForeground);
    font-size: 12px;
    margin: 0 0 20px;
  }
  #search {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 12px;
    font-size: 14px;
    color: var(--vscode-input-foreground);
    background: var(--vscode-input-background);
    border: 1px solid var(--vscode-input-border, transparent);
    border-radius: 6px;
    outline: none;
  }
  #search:focus {
    border-color: var(--vscode-focusBorder);
  }
  h2 {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--vscode-descriptionForeground);
    margin: 28px 0 8px;
  }
  .item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 10px;
    border-radius: 6px;
    cursor: pointer;
    user-select: none;
  }
  .item:hover {
    background: var(--vscode-list-hoverBackground);
  }
  .item.selected {
    background: var(--vscode-list-activeSelectionBackground);
    color: var(--vscode-list-activeSelectionForeground);
  }
  .item .name {
    font-size: 14px;
    white-space: nowrap;
  }
  .item .path {
    font-size: 11px;
    color: var(--vscode-descriptionForeground);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }
  .item.selected .path {
    color: inherit;
    opacity: 0.75;
  }
  .badge {
    font-size: 10px;
    line-height: 1;
    padding: 3px 6px;
    border-radius: 8px;
    background: var(--vscode-badge-background);
    color: var(--vscode-badge-foreground);
  }
  .empty {
    color: var(--vscode-descriptionForeground);
    font-size: 13px;
    padding: 6px 10px;
  }
  .hint {
    margin-top: 32px;
    font-size: 11px;
    color: var(--vscode-descriptionForeground);
  }
  kbd {
    font-family: inherit;
    background: var(--vscode-keybindingLabel-background, rgba(128,128,128,0.17));
    border-radius: 3px;
    padding: 1px 4px;
  }
</style>
</head>
<body>
  <div class="wrap">
    <h1>JP Startup Page</h1>
    <p class="subtitle" id="subtitle">読み込み中…</p>
    <input id="search" type="text" placeholder="プロジェクト名で絞り込み…" autofocus>
    <section id="recentSection" hidden>
      <h2>最近開いた</h2>
      <div id="recentList"></div>
    </section>
    <section>
      <h2 id="allHeading">すべてのプロジェクト</h2>
      <div id="projectList"></div>
    </section>
    <p class="hint">
      <kbd>↑</kbd><kbd>↓</kbd> 選択 / <kbd>Enter</kbd> 開く / <kbd>⌘Enter</kbd>・<kbd>⌘クリック</kbd> 新しいウィンドウで開く
    </p>
  </div>
<script>
  const vscode = acquireVsCodeApi();
  let projects = [];
  let recents = [];
  let selectedIndex = -1;

  const searchEl = document.getElementById('search');
  const recentSection = document.getElementById('recentSection');
  const recentList = document.getElementById('recentList');
  const projectList = document.getElementById('projectList');
  const allHeading = document.getElementById('allHeading');
  const subtitle = document.getElementById('subtitle');

  function basename(p) {
    return p.split('/').filter(Boolean).pop() || p;
  }

  function openProject(path, newWindow) {
    vscode.postMessage({ type: 'open', path: path, newWindow: !!newWindow });
  }

  function makeItem(entry, index) {
    const div = document.createElement('div');
    div.className = 'item';
    div.dataset.index = String(index);
    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = entry.name;
    const pathEl = document.createElement('span');
    pathEl.className = 'path';
    pathEl.textContent = entry.path;
    div.appendChild(name);
    div.appendChild(pathEl);
    if (entry.isGit) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = 'git';
      div.appendChild(badge);
    }
    div.addEventListener('click', (e) => {
      openProject(entry.path, e.metaKey || e.ctrlKey);
    });
    return div;
  }

  // 表示中の項目（recent + all を通し番号で連結）— キーボード選択用
  let visibleEntries = [];

  function render() {
    const filter = searchEl.value.trim().toLowerCase();
    visibleEntries = [];
    recentList.textContent = '';
    projectList.textContent = '';

    const projectByPath = new Map(projects.map((p) => [p.path, p]));

    // 最近開いた（フィルタ中は非表示にして全一覧の絞り込みに集中させる）
    const showRecent = !filter && recents.length > 0;
    recentSection.hidden = !showRecent;
    if (showRecent) {
      for (const r of recents) {
        const known = projectByPath.get(r.path);
        const entry = known || { name: basename(r.path), path: r.path, isGit: false };
        recentList.appendChild(makeItem(entry, visibleEntries.length));
        visibleEntries.push(entry);
      }
    }

    const filtered = filter
      ? projects.filter((p) => p.name.toLowerCase().includes(filter))
      : projects;
    allHeading.textContent = filter
      ? '検索結果 (' + filtered.length + ')'
      : 'すべてのプロジェクト (' + projects.length + ')';
    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = '該当するプロジェクトがありません';
      projectList.appendChild(empty);
    }
    for (const p of filtered) {
      projectList.appendChild(makeItem(p, visibleEntries.length));
      visibleEntries.push(p);
    }

    // フィルタ中は先頭を選択済みにして Enter 即オープンできるようにする
    selectedIndex = filter && visibleEntries.length > 0 ? 0 : -1;
    applySelection();
  }

  function applySelection() {
    const items = document.querySelectorAll('.item');
    items.forEach((el) => {
      el.classList.toggle('selected', Number(el.dataset.index) === selectedIndex);
    });
    const sel = document.querySelector('.item.selected');
    if (sel) {
      sel.scrollIntoView({ block: 'nearest' });
    }
  }

  searchEl.addEventListener('input', render);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (visibleEntries.length === 0) return;
      const delta = e.key === 'ArrowDown' ? 1 : -1;
      selectedIndex = Math.min(
        visibleEntries.length - 1,
        Math.max(0, selectedIndex + delta)
      );
      applySelection();
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < visibleEntries.length) {
        openProject(visibleEntries[selectedIndex].path, e.metaKey || e.ctrlKey);
      }
    } else if (e.key !== 'Tab' && document.activeElement !== searchEl) {
      searchEl.focus();
    }
  });

  window.addEventListener('message', (event) => {
    const msg = event.data;
    if (msg.type === 'data') {
      projects = msg.projects;
      recents = msg.recents;
      subtitle.textContent = projects.length + ' 個のプロジェクトを検出';
      render();
    }
  });

  vscode.postMessage({ type: 'ready' });
</script>
</body>
</html>`;
}
