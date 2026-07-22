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

## 開発

```bash
npm install
npm run compile     # TypeScript コンパイル
npm run watch       # 監視コンパイル
```

VSCode でこのフォルダを開いて F5（拡張機能開発ホスト）で動作確認。

## インストール（VSIX）

```bash
npm run package     # jpstartuppage-x.y.z.vsix を生成
code --install-extension jpstartuppage-*.vsix
```

## 複数マシンへの配布

現状は private リポジトリ＋VSIX の手動インストール。将来的に VS Code Marketplace に公開すれば、Settings Sync の拡張同期で全マシンに自動インストール・自動更新される（要 Azure DevOps パブリッシャー登録、拡張は公開になる）。
