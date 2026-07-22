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
    --accent: var(--vscode-focusBorder);
    --panel: var(--vscode-editorWidget-background, var(--vscode-editor-background));
    --border: var(--vscode-widget-border, var(--vscode-editorWidget-border, rgba(128,128,128,0.25)));
    --dim: var(--vscode-descriptionForeground);
    --mono: var(--vscode-editor-font-family, ui-monospace, monospace);
  }
  body {
    font-family: var(--vscode-font-family);
    color: var(--vscode-foreground);
    background: var(--vscode-editor-background);
    margin: 0;
    padding: 0 20px;
  }
  .wrap {
    max-width: 640px;
    margin: 0 auto;
    padding: 44px 0 40px;
    animation: rise 0.35s cubic-bezier(0.2, 0.7, 0.3, 1);
  }
  @keyframes rise {
    from { opacity: 0; transform: translateY(10px); }
  }
  @media (prefers-reduced-motion: reduce) {
    .wrap { animation: none; }
    * { transition: none !important; }
  }
  .head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin: 0 0 14px;
    padding: 0 4px;
  }
  h1 {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--dim);
    margin: 0;
  }
  .subtitle {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--dim);
    margin: 0;
  }
  .palette {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: 0 8px 32px var(--vscode-widget-shadow, rgba(0, 0, 0, 0.2));
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .palette:focus-within {
    border-color: color-mix(in srgb, var(--accent) 60%, transparent);
    box-shadow:
      0 8px 32px var(--vscode-widget-shadow, rgba(0, 0, 0, 0.2)),
      0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent);
  }
  .searchRow {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 16px;
    border-bottom: 1px solid var(--border);
    color: var(--dim);
  }
  .palette:focus-within .searchRow {
    color: var(--accent);
  }
  #search {
    flex: 1;
    min-width: 0;
    padding: 14px 0;
    font-family: inherit;
    font-size: 15px;
    color: var(--vscode-input-foreground, inherit);
    background: transparent;
    border: none;
    outline: none;
    caret-color: var(--accent);
  }
  #search::placeholder {
    color: var(--vscode-input-placeholderForeground, var(--dim));
  }
  .lists {
    padding: 8px;
  }
  h2 {
    font-family: var(--mono);
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--dim);
    margin: 0;
    padding: 10px 12px 6px;
  }
  section + section h2 {
    padding-top: 16px;
  }
  .item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
    content-visibility: auto;
    contain-intrinsic-size: auto 35px;
  }
  .item:hover {
    background: color-mix(in srgb, var(--vscode-foreground) 7%, transparent);
  }
  .item.selected {
    background: color-mix(in srgb, var(--accent) 14%, transparent);
    box-shadow: inset 2px 0 0 var(--accent);
  }
  .item .name {
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
  }
  .item .name mark {
    background: transparent;
    color: var(--accent);
    font-weight: 700;
  }
  .item .path {
    flex: 1;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--dim);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .badge {
    font-family: var(--mono);
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.05em;
    padding: 3px 6px;
    border-radius: 4px;
    color: var(--accent);
    background: color-mix(in srgb, var(--accent) 12%, transparent);
  }
  .empty {
    padding: 24px 12px;
    text-align: center;
    color: var(--dim);
    font-size: 13px;
  }
  .hints {
    display: flex;
    gap: 16px;
    padding: 10px 16px;
    border-top: 1px solid var(--border);
    font-family: var(--mono);
    font-size: 11px;
    color: var(--dim);
  }
  kbd {
    font-family: var(--mono);
    font-size: 10px;
    padding: 1px 5px;
    border: 1px solid var(--border);
    border-bottom-width: 2px;
    border-radius: 4px;
    background: color-mix(in srgb, var(--vscode-foreground) 5%, transparent);
  }
</style>
</head>
<body>
  <div class="wrap">
    <div class="head">
      <h1>JP Startup Page</h1>
      <p class="subtitle" id="subtitle">読み込み中…</p>
    </div>
    <div class="palette">
      <div class="searchRow">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.6"/>
          <path d="M10.8 10.8 L14 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
        <input id="search" type="text" placeholder="プロジェクトを検索…" autofocus>
      </div>
      <div class="lists">
        <section id="recentSection" hidden>
          <h2>最近開いた</h2>
          <div id="recentList"></div>
        </section>
        <section>
          <h2 id="allHeading">すべてのプロジェクト</h2>
          <div id="projectList"></div>
        </section>
      </div>
      <div class="hints">
        <span><kbd>↑</kbd><kbd>↓</kbd> 選択</span>
        <span><kbd>↵</kbd> 開く</span>
        <span><kbd>⌘↵</kbd>・<kbd>⌘クリック</kbd> 新しいウィンドウ</span>
      </div>
    </div>
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

  function makeName(entry, filter) {
    const name = document.createElement('span');
    name.className = 'name';
    const idx = filter ? entry.name.toLowerCase().indexOf(filter) : -1;
    if (idx >= 0) {
      name.append(entry.name.slice(0, idx));
      const m = document.createElement('mark');
      m.textContent = entry.name.slice(idx, idx + filter.length);
      name.appendChild(m);
      name.append(entry.name.slice(idx + filter.length));
    } else {
      name.textContent = entry.name;
    }
    return name;
  }

  function makeItem(entry, index, filter) {
    const div = document.createElement('div');
    div.className = 'item';
    div.dataset.index = String(index);
    div.title = entry.path;
    div.appendChild(makeName(entry, filter));
    const pathEl = document.createElement('span');
    pathEl.className = 'path';
    pathEl.textContent = entry.path;
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
        recentList.appendChild(makeItem(entry, visibleEntries.length, filter));
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
      projectList.appendChild(makeItem(p, visibleEntries.length, filter));
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

  // Webview では autofocus が効かないことがあるため、明示的にフォーカスする。
  // パネルがアクティブになった（iframe がフォーカスを得た）ときも検索欄へ移す
  searchEl.focus();
  window.addEventListener('focus', () => searchEl.focus());

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
      subtitle.textContent = projects.length + ' projects';
      render();
    }
  });

  vscode.postMessage({ type: 'ready' });
</script>
</body>
</html>`;
}
