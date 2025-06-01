# 🧱 Frontend Next.js DevContainer Starter with Nginx & MySQL

このリポジトリは、Next.js アプリケーションを Docker DevContainer でローカル開発し、ECS (Fargate) へ本番デプロイできる構成を提供します。  
Nginx をリバースプロキシとして使用し、MySQL + Prisma による DB 操作を行います。

---

## ✅ 使用技術スタック

| 技術       | 用途                   |
|------------|------------------------|
| Next.js    | フロントエンド/SSR     |
| Prisma     | ORM / DBマイグレーション |
| MySQL      | データベース           |
| Nginx      | リバースプロキシ       |
| Docker     | コンテナ化             |
| DevContainer | ローカル開発環境     |
| ECS (Fargate) | 本番デプロイ先       |

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
    git clone https://github.com/fcf-koga/nextjs-app-devcontainer.git
    cd nextjs-app-devcontainer
    ```

2. VS Code でプロジェクトを開き、  
   コマンドパレットで「**Reopen in Container**」を選択

    > 初回起動時に `npm install` が自動実行されます  
    > 起動のたびに `npx prisma migrate dev` が自動実行されます

---

## ⚙️ アプリケーションの起動

Dev Container のターミナルで以下を実行します：

```bash
npm run dev
```

### 🌐 アクセス確認
- アプリ: http://localhost:8080
- Prisma Studio: http://localhost:5555（手動で起動 npx prisma studio）

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

## 🗃️ データベース接続情報
.env ファイル（app/.env）で管理：

```env
DATABASE_URL="mysql://root:root@db:3306/sampledb"
```
| 項目      | 値                 |
| ------- | ----------------- |
| ユーザー名   | `root`            |
| パスワード   | `password`        |
| ホスト     | `db`（dockerサービス名） |
| ポート     | `3306`            |
| データベース名 | `sampledb`        |

Docker Compose 内の MySQL 設定と同期しています。

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

## 📁 ディレクトリ構成
```bash
.
├── app/                  # Next.js + Prisma アプリ
│   ├── Dockerfile
│   ├── .env
│   └── prisma/
├── nginx/                # Nginx 開発・本番設定
│   ├── Dockerfile
│   ├── nginx.dev.conf
│   └── nginx.prod.conf
├── .devcontainer/        # VS Code DevContainer 設定
│   ├── devcontainer.json
├── docker-compose.yml
└── README.md
```

## 📝 ライセンス
This project is licensed under the MIT License.
