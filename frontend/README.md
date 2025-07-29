---
marp: true
---

# TaskFlow Frontend

## 📱 アプリ名

**TaskFlow** - GraphQL タスク管理アプリケーション

## 📋 概要

TaskFlow は、モダンな React + TypeScript + GraphQL で構築されたタスク管理アプリケーションのフロントエンドです。
直感的なユーザーインターフェースで、効率的なタスク管理を実現します。

## ✨ 機能・機能の説明

### 🔐 認証機能

- **ユーザー登録**: 新規アカウント作成
- **ログイン/ログアウト**: JWT 認証によるセキュアな認証
- **認証状態管理**: ルートガードによる自動リダイレクト

### 📝 タスク管理機能

- **タスク一覧表示**: 登録済みタスクの表形式での表示
- **タスク作成**: 新しいタスクの追加（タスク名、期日、ステータス設定）
- **タスク編集**: 既存タスクの内容修正
- **タスク削除**: 不要なタスクの削除
- **ステータス管理**: 3 段階のタスクステータス
  - `NOT_STARTED` (未着手)
  - `IN_PROGRESS` (進行中)
  - `COMPLETED` (完了)

### 🎨 ユーザーインターフェース

- **レスポンシブデザイン**: デスクトップ・モバイル対応
- **Material-UI**: モダンなマテリアルデザイン
- **ローディング表示**: データ取得中の視覚的フィードバック
- **エラーハンドリング**: 分かりやすいエラー表示

## 🛠️ 技術スタック

### 言語・フレームワーク

- ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) **React** `19.1.0` - UI ライブラリ
- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) **TypeScript** `5.8.3` - 型安全な開発
- ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) **Vite** `7.0.4` - 高速ビルドツール

### 主要ライブラリ

- ![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=flat&logo=graphql&logoColor=white) **Apollo Client** `3.13.8` - GraphQL クライアント
- ![Material-UI](https://img.shields.io/badge/Material--UI-007FFF?style=flat&logo=mui&logoColor=white) **Material-UI** `7.2.0` - UI コンポーネントライブラリ
- ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white) **React Router DOM** `7.7.1` - ルーティング管理
- ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white) **JWT Decode** `4.0.0` - JWT トークン デコード
- ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) **Modern CSS Reset** `1.4.0` - CSS リセット

### 開発ツール

- ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white) **ESLint** - コード品質管理
- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) **TypeScript ESLint** - TypeScript 用リンター

## 🚀 環境構築手順

### 前提条件

- Node.js (v18 以上推奨)
- npm または yarn

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数設定

バックエンド API のエンドポイントが `http://localhost:3000/graphql` で起動していることを確認してください。

`VITE_GRAPHQL_API_URL="GraphQLのURL"`

### 3. 開発サーバー起動

```bash
# 開発モード（ホットリロード有効）
npm run dev
```

アプリケーションは `http://localhost:5173` で起動します。

### 4. ビルド（本番用）

```bash
# TypeScriptコンパイル + Viteビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

### 5. コード品質チェック

```bash
# ESLintによるコード検査
npm run lint
```

## 📂 プロジェクト構造

```
src/
├── components/          # Reactコンポーネント
│   ├── AddTask.tsx     # タスク追加
│   ├── EditTask.tsx    # タスク編集
│   ├── DeleteTask.tsx  # タスク削除
│   ├── TaskTable.tsx   # タスク一覧表示
│   ├── SignIn.tsx      # ログイン
│   ├── SignUp.tsx      # ユーザー登録
│   ├── Header.tsx      # ヘッダーナビゲーション
│   ├── Main.tsx        # メインページ
│   ├── Loading.tsx     # ローディングコンポーネント
│   └── NotFound.tsx    # 404ページ
├── hooks/              # カスタムフック
├── mutations/          # GraphQL mutations
├── queries/            # GraphQL queries
├── types/              # TypeScript型定義
├── utils/              # ユーティリティ関数
├── apolloClient.ts     # Apollo Client設定
├── AuthRoute.tsx       # 認証ルートガード
└── App.tsx            # アプリケーションルート
```

## 🔗 関連リンク

- [バックエンド API](../backend/README.md)
- [プロジェクト概要](../README.md)

## 📝 ライセンス

This project is for educational purposes.
