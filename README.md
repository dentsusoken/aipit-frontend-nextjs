# 🧱 Frontend Next.js DevContainer Starter with Nginx & PostgreSQL

このリポジトリは、Next.js アプリケーションを Docker DevContainer でローカル開発し、ECS (Fargate) へ本番デプロイできる構成を提供します。
Nginx をリバースプロキシとして使用し、PostgreSQL + Prisma による DB 操作（※）を行います。

（※）PostgreSQL + Prisma による DB 操作について

- 「PostgreSQL + Prisma による DB 操作」については 20250604 時点の状態では機能しない。\
  （GitHub Actions による検証時に Prisma 関連のライブラリをコメントアウトしたため）
- そのため、DB 操作を確認したい場合は、以下修正のうえ、README の手順を実施すること。
  - app/src/app/page.tsx：1,3,7,14~22 行目のコメントアウトを外す
  - app/.env：7 行目のコメントアウトを外す

---

## ✅ 使用技術スタック

| 技術           | 用途                                          |
| -------------- | --------------------------------------------- |
| Next.js        | フロントエンド/SSR                            |
| Prisma         | ORM / DB マイグレーション                     |
| PostgreSQL     | データベース                                  |
| Keycloak       | 認証・認可サーバー（OIDC）                    |
| Nginx          | リバースプロキシ                              |
| Docker         | コンテナ化                                    |
| DevContainer   | ローカル開発環境                              |
| ECS (Fargate)  | 本番デプロイ先                                |
| GitHub Actions | AWS 環境への自動デプロイ                      |
| husky          | Git フックを使ったコミット前チェック          |
| lint-staged    | ステージされたファイルのみに Lint/Format 適用 |
| Prettier       | コードフォーマッター（整形ツール）            |
| ESlint         | コードの静的解析（ルール違反の検出）          |

---

## ⚙️ アプリケーションの起動

### 🔧 前提

- Docker / Docker Compose
- VS Code + Remote Containers 拡張
- WSL2（推奨）

---

### 🛠 Dev Container の起動

1. リポジトリをクローンします：

   ```bash
   git clone https://github.com/dentsusoken/aipit-frontend-nextjs.git
   cd nextjs-app-devcontainer
   ```

2. VS Code でプロジェクトを開き、  
   コマンドパレットで「**Reopen in Container**」を選択

   > 初回起動時に `npm install` が自動実行されます  
   > 起動のたびに `npx prisma migrate dev` が自動実行されます

### 🌐 アクセス確認

- アプリ: http://localhost:8080
- Prisma Studio: http://localhost:5555 （手動で起動 npx prisma studio）
- Keycloak: http://localhost:18080 （管理者: admin/password）

- nginx がリバースプロキシとして app（Next.js）に転送します
- localhost:3000 へ直接アクセスも可能（Next.js 単体）

## 🧬 Prisma 操作

### マイグレーション（初回）

Dev Container の postStartCommand により起動時に自動実行されますが、手動で実行したい場合：

```bash
npx prisma migrate dev --name init
```

### Prisma Studio（GUI）

```bash
npx prisma studio
```

→ ブラウザで http://localhost:5555 にアクセスし、データベースの内容を GUI で閲覧・編集できます。

---

## 🔐 Keycloak（認証・認可）

### アクセス情報

- 管理コンソール: http://localhost:18080
- 管理者アカウント: `admin` / `password`
- OIDC エンドポイント: http://localhost:18080/realms/oidc-mock

### 設定ファイル

- `keycloak/realm.json`: Keycloak レルム設定ファイル

### 設定手順

1. 管理コンソールにアクセスし、管理者アカウントでログインする。
2. 画面左側のメニューバーから Manage realms をクリックし Manage realms 画面を開く。
3. Create realm ボタンをクリックし、realm 登録モーダルを開く。
4. Resource file に上記、設定ファイルを指定し Create ボタンをクリック。
5. `oidc-mock` realm が作成されたことを確認。
6. Manage realms 画面で`oidc-mock`をクリックし Current realm を変更。（すでに`oidc-mock`が Current realm の場合は不要）
7. 画面左側のメニューバーから Manage > Users をクリックし Users 画面を開く。
8. Add user ボタンをクリックし、ユーザー登録画面を開く。
9. General と aipit-metadata の項目をすべて入力し Create ボタンをクリック。
10. User 画面で作成したユーザーをクリックし、当該ユーザーの詳細画面を開く。
11. Credentials タブの Set password ボタンをクリックし、パスワード設定モーダルを開く。
12. 各項目を入力し Save ボタンをクリック。（Temporary を On にすると初回ログイン時にパスワードの再設定を要求されます。）

## 🗃️ データベース接続情報

.env ファイル（app/.env）で管理：

```env
DATABASE_URL="postgresql://root:root@db:5432/sampledb"
```

| 項目           | 値                        |
| -------------- | ------------------------- |
| ユーザー名     | `user`                    |
| パスワード     | `password`                |
| ホスト         | `db`（docker サービス名） |
| ポート         | `5432`                    |
| データベース名 | `sampledb`                |

Docker Compose 内の PostgreSQL 設定と同期しています。

## 🚢 本番構成（ECS/Fargate）

- app/Dockerfile はマルチステージ構成（開発/本番）
- 本番用ビルド例：

```bash
docker build -f app/Dockerfile --target prod -t my-next-app .
```

- Nginx は nginx/prod.conf を使用して / へのリバースプロキシを提供
- 本番用ビルド例：

```bash
docker build -f nginx/Dockerfile -t my-nginx-proxy ./nginx
```

- ECR にプッシュ後、ECS Fargate での構築に対応

## 🧹 コード品質チェック（ESlint/Prettier）

このプロジェクトでは、コミット時に自動で Eslint と Prettier によるチェックが行われるよう、以下のツールを導入しています：

- husky：Git フックの管理
- lint-staged：ステージされたファイルのみに対して、リントやフォーマットを実行

### 🔄 自動実行される処理

`git Commit`を実行するタイミングで以下が動作します：

1. ステージされたファイル（`git add`されたファイル）のみ対象
2. Prettier によるコードフォーマット
3. ESlint によるコードリント

通常の開発フローでは、開発者が`app/src/app`配下の実装ファイルに対して個別に`npx eslint .`や`npx prettier . --check`を実行することが想定されます。
本仕組みにより、**最終的なコミット直前のチェック**として自動実行されるため、意図しないスタイルの崩れやリントエラーを含むファイルのコミットを防止することできます。
※なお、コマンド実行による自動修正は行わない方針としました

### 🛠️ 導入済であることの確認方法

- `.husky/`ディレクトリが存在し、`pre-commit`ファイルがあること
- `package.json`に`lint-staged`の設定があること

## 📁 ディレクトリ構成

```bash
.
├── .github/workflows/    # GitHub Actionsによる自動デプロイ設定
│   └── store-front_deploy.yaml
├── .husky                # Gitフック用スクリプト（pre-commit等）
│   ├── _/husky.sh
│   └── pre-commit
├── app/                  # Next.js + Prisma アプリ
│   ├── Dockerfile
│   ├── .env
│   ├── prisma/
│   ├── public/
│   └── src/
├── keycloak/             # Keycloak設定ファイル
├── nginx/                # Nginx 開発・本番設定
│   ├── nginx.dev.conf
│   ├── nginx.prod.conf
│   └── Dockerfile
├── .devcontainer/        # VS Code DevContainer 設定
│   └── devcontainer.json
├── docker-compose.yml
└── README.md
```

## 📝 ライセンス

This project is licensed under the MIT License.
