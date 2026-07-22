# JPStartupPage

VSCode 用のカスタムスタートページ拡張。フォルダを開いていないウィンドウの起動時に、自分のプロジェクトフォルダ（既定: `~/Documents/Project` 直下）を自動スキャンした一覧ページを表示する。

## 機能

- **起動時に自動表示**: 空ウィンドウで VSCode を起動するとスタートページが開く
- **自動スキャン**: 設定したルートディレクトリ直下のフォルダを列挙（git リポジトリにはバッジ表示）
- **インクリメンタルサーチ**: 上部の検索ボックスで即時絞り込み。絞り込み中は先頭が選択済みなので、タイプして Enter だけで開ける
- **最近開いた履歴**: このページから開いたプロジェクトの直近10件を上部に表示（件数は設定可）
- **開き方**: クリック / Enter で現在のウィンドウ、⌘クリック / ⌘Enter で新しいウィンドウ
- コマンドパレット: `JP Startup Page: スタートページを開く`

## 設定（settings.json / Settings Sync で全マシンに同期される）

| 設定 | 既定値 | 説明 |
|---|---|---|
| `jpstartuppage.scanRoots` | `["~/Documents/Project"]` | スキャンするルートディレクトリ（複数可、直下1階層） |
| `jpstartuppage.showOnStartup` | `true` | 空ウィンドウ起動時に自動表示 |
| `jpstartuppage.recentCount` | `10` | 「最近開いた」の表示件数 |

「最近開いた」履歴は各マシンのローカル（globalState）に保存され、同期されない（マシンごとに作業が違うため意図的）。

## `activationEvents` が `"*"` である理由

VSCode は `"*"` を推奨せず警告を出すが、**意図的に選んでいる。戻さないこと。**

一時的に計測コードを仕込んで空ウィンドウ起動〜描画完了を実測した結果:

| 区間 | `onStartupFinished` | `"*"` |
|---|---|---|
| host 起動 → extension.js ロード | 1013 ms | 739 ms |
| ロード → activate（順番待ち） | **866 ms** | **8〜22 ms** |
| 拡張のコード全部 | 104 ms | 107 ms |
| **合計** | **1984 ms** | **869 ms** |

`onStartupFinished` は「他の拡張の後に並ぶ」宣言のため、コードが1行も動く前に約1.9秒を失っていた。`"*"` にすると順番待ちがほぼ消え、**約1.1秒（56%）短縮**。

警告が想定するリスク（重い拡張が全ウィンドウの起動を遅らせる）には該当しない。本体は約6KB、`activate` は即座に戻り、フォルダを開いているウィンドウでは webview すら生成しない。

なお残り時間の85%は「host 起動 → extension.js ロード」（739 ms）で、これは VSCode が extension host を立ち上げて拡張をスキャンし終えるまでの時間。**拡張側からは手が出せないため、コードの最適化はここで打ち止め。**`scanProjects` は76件で 3.5〜5.2 ms しかかかっておらず、最適化しても無意味（実測で確認済み）。

## 開発

```bash
npm install
npm run compile     # TypeScript コンパイル
npm run watch       # 監視コンパイル
```

VSCode でこのフォルダを開いて F5（拡張機能開発ホスト）で動作確認。

## インストール（VSIX）

```bash
npm run install-local   # コンパイル → VSIX 生成 → この VSCode にインストール（一発）
```

VSCode から実行する場合は ⌘⇧P →「Tasks: Run Task」→「npm: install-local」。
インストール後はウィンドウをリロード（⌘⇧P →「Developer: Reload Window」）すると反映される。

個別に実行したい場合:

```bash
npm run package     # jpstartuppage-x.y.z.vsix を生成
code --install-extension jpstartuppage-*.vsix --force
```

## 複数マシンへの配布

現状は private リポジトリ＋VSIX の手動インストール。将来的に VS Code Marketplace に公開すれば、Settings Sync の拡張同期で全マシンに自動インストール・自動更新される（要 Azure DevOps パブリッシャー登録、拡張は公開になる）。
