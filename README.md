# GraphQL + NestJS タスク管理アプリケーション

## 📋 プロジェクト概要

このプロジェクトは、GraphQL を使用したモダンなタスク管理アプリケーションです。  
NestJS をバックエンド API として、React + TypeScript をフロントエンドとして構築されています。

※本アプリは Udemy の講座をベースにリファクタリングを加えた状態となっております。

## 🏗️ アーキテクチャ

```
GraphQL_NestJS/
├── backend/     # NestJS + GraphQL API
└── frontend/    # React + TypeScript SPA
```

### バックエンド

- **NestJS** - Node.js フレームワーク
- **GraphQL** - API クエリ言語
- **Prisma** - データベース ORM
- **JWT** - 認証システム

### フロントエンド

- **React** - UI ライブラリ
- **TypeScript** - 型安全な開発
- **Vite** - 高速ビルドツール
- **Apollo Client** - GraphQL クライアント
- **Material-UI** - UI コンポーネント

## 🚀 クイックスタート

### 前提条件

- Node.js (v18 以上)
- Docker & Docker Compose
- PostgreSQL

### セットアップ

1. **リポジトリクローン**

   ```bash
   git clone <repository-url>
   cd GraphQL_NestJS
   ```

2. **バックエンド起動**

   ```bash
   cd backend
   npm install
   docker-compose up -d  # PostgreSQL起動
   npx prisma migrate deploy
   npm run start:dev
   ```

3. **フロントエンド起動**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📁 プロジェクト詳細

各ディレクトリの詳細な情報については、以下の README を参照してください：

- [バックエンド詳細](./backend/README.md)
- [フロントエンド詳細](./frontend/README.md)

## 🔧 主な機能

- ユーザー認証（サインアップ/サインイン）
- タスクの作成・編集・削除
- タスクステータス管理
- レスポンシブデザイン

## 📝 ライセンス

This project is for educational purposes.
