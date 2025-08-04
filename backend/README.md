# TaskFlow Backend API

## 🚀 アプリ名

**TaskFlow Backend** - GraphQL タスク管理 API サーバー

## 📋 概要

TaskFlow Backendは、NestJS + GraphQL + Prismaで構築されたタスク管理アプリケーションのAPIサーバーです。
型安全なGraphQL APIを提供し、JWT認証によるセキュアなユーザー管理とタスク管理機能を実装しています。

## 🏗️ システム構成図

### 全体システム構成

```mermaid
graph TB
    subgraph "Frontend (React + Vite)"
        UI[React UI Components]
        ApolloClient[Apollo Client]
        Router[React Router]
    end

    subgraph "Backend (NestJS + GraphQL)"
        GraphQL[Apollo Server]
        Auth[Auth Module]
        User[User Module]
        Task[Task Module]
        Prisma[Prisma ORM]
    end

    subgraph "Database"
        PostgreSQL[(PostgreSQL)]
    end

    subgraph "Development Tools"
        Docker[Docker Compose]
        Playground[GraphQL Playground]
    end

    UI --> ApolloClient
    ApolloClient --> GraphQL
    GraphQL --> Auth
    GraphQL --> User
    GraphQL --> Task
    Task --> Prisma
    User --> Prisma
    Auth --> Prisma
    Prisma --> PostgreSQL
    Docker --> PostgreSQL
    GraphQL --> Playground

    style UI fill:#61dafb
    style GraphQL fill:#e10098
    style PostgreSQL fill:#336791
    style Docker fill:#2496ed
```

### コンポーネント構成図

```mermaid
graph TB
    subgraph "NestJS Application"
        AppModule[App Module]

        subgraph "Auth Module"
            AuthService[Auth Service]
            AuthResolver[Auth Resolver]
            JWTStrategy[JWT Strategy]
            LocalStrategy[Local Strategy]
            JWTAuthGuard[JWT Auth Guard]
        end

        subgraph "User Module"
            UserService[User Service]
            UserResolver[User Resolver]
        end

        subgraph "Task Module"
            TaskService[Task Service]
            TaskResolver[Task Resolver]
        end

        subgraph "Prisma Module"
            PrismaService[Prisma Service]
        end
    end

    subgraph "Database Layer"
        PrismaClient[Prisma Client]
        Migrations[Database Migrations]
    end

    AppModule --> AuthService
    AppModule --> UserService
    AppModule --> TaskService
    AppModule --> PrismaService

    AuthService --> JWTStrategy
    AuthService --> LocalStrategy
    AuthResolver --> AuthService
    UserResolver --> UserService
    TaskResolver --> TaskService

    PrismaService --> PrismaClient
    PrismaClient --> Migrations

    style AppModule fill:#e0234e
    style AuthService fill:#ff6b6b
    style UserService fill:#4ecdc4
    style TaskService fill:#45b7d1
    style PrismaService fill:#2d3748
```

### ER図（データベース設計）

```mermaid
erDiagram
    User {
        int id PK
        string name
        string email UK
        string password
        datetime createdAt
        datetime updatedAt
    }

    Task {
        int id PK
        string name
        datetime dueDate
        string status
        string description
        datetime createdAt
        datetime updatedAt
        int userId FK
    }

    User ||--o{ Task : "has many"
```

### 認証フロー図

```mermaid
sequenceDiagram
    participant Client as Frontend Client
    participant Auth as Auth Module
    participant User as User Service
    participant DB as Database
    participant JWT as JWT Service

    Client->>Auth: POST /graphql (signIn)
    Auth->>User: validateUser(email, password)
    User->>DB: findUserByEmail(email)
    DB-->>User: user data
    User->>Auth: validate password with bcrypt
    Auth->>JWT: generate JWT token
    JWT-->>Auth: JWT token
    Auth-->>Client: SignInResponse with token

    Note over Client: Store JWT token

    Client->>Auth: POST /graphql (with Authorization header)
    Auth->>Auth: verify JWT token
    Auth->>DB: execute protected query/mutation
    DB-->>Auth: result
    Auth-->>Client: GraphQL response
```

## ✨ 機能・機能の説明

### 🔐 認証機能

- **ユーザー登録**: 新規ユーザーアカウント作成
- **JWT認証**: セキュアなトークンベース認証
- **パスワードハッシュ化**: bcryptによる安全なパスワード保存
- **認証ガード**: JWT認証によるエンドポイント保護

### 📝 タスク管理機能

- **タスクCRUD操作**:
  - `createTask`: 新しいタスクの作成
  - `getTasks`: ユーザー別タスク一覧取得
  - `updateTask`: タスク情報の更新
  - `deleteTask`: タスクの削除
- **ステータス管理**: 3段階のタスクステータス
  - `NOT_STARTED` (未着手)
  - `IN_PROGRESS` (進行中)
  - `COMPLETED` (完了)
- **ユーザー関連付け**: タスクとユーザーのリレーション管理

### 🔧 GraphQL API

- **スキーマファースト**: 自動生成されるGraphQLスキーマ
- **型安全性**: TypeScriptとGraphQLの完全な型統合
- **Apollo Server**: 高性能なGraphQLサーバー
- **Playground**: 開発環境でのインタラクティブAPI探索

### 🗄️ データベース機能

- **Prisma ORM**: 型安全なデータベースアクセス
- **PostgreSQL**: 堅牢なリレーショナルデータベース
- **マイグレーション**: データベーススキーマのバージョン管理
- **リレーション**: User-Taskの1対多リレーション

## 🛠️ 技術スタック

### 言語・フレームワーク

- ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white) **NestJS** `11.0.1` - Node.jsフレームワーク
- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) **TypeScript** `5.7.3` - 型安全な開発言語
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) **Node.js** - サーバーサイドJavaScript実行環境

### 主要ライブラリ

- ![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=flat&logo=graphql&logoColor=white) **Apollo Server** `4.12.2` - GraphQLサーバー
- ![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=flat&logo=graphql&logoColor=white) **@nestjs/graphql** `13.1.0` - NestJS GraphQL統合
- ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white) **Prisma** `6.12.0` - データベースORM
- ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white) **@nestjs/jwt** `11.0.0` - JWT認証
- ![Passport](https://img.shields.io/badge/Passport-34E27A?style=flat&logo=passport&logoColor=white) **@nestjs/passport** `11.0.5` - 認証戦略
- **bcrypt** `6.0.0` - パスワードハッシュ化
- **class-validator** `0.14.2` - バリデーション
- **class-transformer** `0.5.1` - データ変換

### データベース

- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white) **PostgreSQL** `16-alpine` - メインデータベース
- ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) **Docker Compose** - 開発環境のデータベース管理

### 開発ツール

- ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white) **ESLint** `9.18.0` - コード品質管理
- ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat&logo=prettier&logoColor=black) **Prettier** `3.4.2` - コードフォーマッター
- ![Jest](https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white) **Jest** `29.7.0` - テストフレームワーク

## 🚀 環境構築手順

### 前提条件

- Node.js (v18以上推奨)
- Docker & Docker Compose
- npm または yarn

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数設定

#### 方法1: テンプレートファイルを使用

```bash
# テンプレートファイルをコピー
cp .env.example .env

# .envファイルを編集して実際の値に置き換え
nano .env
```

#### 方法2: 手動で.envファイルを作成

`.env`ファイルを作成し、以下の環境変数を設定：

````bash
# ========================================
# データベース設定
# ========================================

# Prisma用データベース接続URL
# PostgreSQL接続文字列（Prismaが使用）
DATABASE_URL="postgresql://taskflow_user:taskflow_password@localhost:5435/taskflow_db"

# Docker Compose用PostgreSQL設定
# 注意: DATABASE_URLの値と一致させること
POSTGRES_USER=taskflow_user
POSTGRES_PASSWORD=taskflow_password
POSTGRES_DB=taskflow_db

# ========================================
# 認証・セキュリティ設定
# ========================================

# JWT認証用シークレットキー
# 本番環境では強力なランダム文字列を使用すること
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# bcryptパスワードハッシュ化のストレッチング回数
# 推奨値: 10-12（セキュリティとパフォーマンスのバランス）
BCRYPT_SALT_ROUNDS=10

#### 環境変数の説明

| 変数名               | 必須 | 説明                                    | デフォルト値  |
| -------------------- | ---- | --------------------------------------- | ------------- |
| `DATABASE_URL`       | ✅   | Prisma用PostgreSQL接続URL               | -             |
| `POSTGRES_USER`      | ✅   | PostgreSQLユーザー名                    | -             |
| `POSTGRES_PASSWORD`  | ✅   | PostgreSQLパスワード                    | -             |
| `POSTGRES_DB`        | ✅   | PostgreSQLデータベース名                | -             |
| `JWT_SECRET`         | ✅   | JWT認証用シークレットキー（32文字以上） | -             |
| `BCRYPT_SALT_ROUNDS` | ✅  | bcryptストレッチング回数                | `10`          |

### 3. PostgreSQLデータベース起動

```bash
# Docker Composeでデータベースを起動
docker-compose up -d

# データベースが起動するまで待機
docker-compose logs postgres
````

### 4. データベース初期化

```bash
# Prismaクライアント生成
npx prisma generate

# データベースマイグレーション実行
npx prisma migrate deploy

# 開発環境の場合（マイグレーション作成も含む）
npx prisma migrate dev
```

### 5. 開発サーバー起動

```bash
# 開発モード（ホットリロード有効）
npm run start:dev

# 本番モード
npm run start:prod
```

APIサーバーは `http://localhost:3000` で起動します。
GraphQL Playgroundは `http://localhost:3000/graphql` でアクセス可能です。

### 6. テスト実行

```bash
# 単体テスト
npm run test

# E2Eテスト
npm run test:e2e

# テストカバレッジ
npm run test:cov
```

## 📂 プロジェクト構造

```
src/
├── auth/                    # 認証モジュール
│   ├── auth.module.ts      # 認証モジュール設定
│   ├── auth.service.ts     # 認証ビジネスロジック
│   ├── auth.resolver.ts    # 認証GraphQLリゾルバー
│   ├── dto/                # データ転送オブジェクト
│   ├── guards/             # 認証ガード
│   ├── strategies/         # Passport認証戦略
│   └── types/              # TypeScript型定義
├── user/                   # ユーザーモジュール
│   ├── user.module.ts      # ユーザーモジュール設定
│   ├── user.service.ts     # ユーザービジネスロジック
│   ├── user.resolver.ts    # ユーザーGraphQLリゾルバー
│   ├── dto/                # DTO
│   └── models/             # GraphQLモデル
├── task/                   # タスクモジュール
│   ├── task.module.ts      # タスクモジュール設定
│   ├── task.service.ts     # タスクビジネスロジック
│   ├── task.resolver.ts    # タスクGraphQLリゾルバー
│   ├── dto/                # DTO
│   └── models/             # GraphQLモデル
├── prisma/                 # Prisma設定
│   ├── prisma.module.ts    # Prismaモジュール
│   └── prisma.service.ts   # Prismaサービス
├── app.module.ts           # アプリケーションルートモジュール
├── main.ts                 # アプリケーションエントリーポイント
└── schema.gql              # 自動生成GraphQLスキーマ

prisma/
├── schema.prisma           # Prismaスキーマ定義
└── migrations/             # データベースマイグレーション

generated/
└── prisma/                 # Prisma生成ファイル
```

## 🔗 GraphQL API エンドポイント

### Query

- `getTasks`: ユーザーのタスク一覧取得
- `getUser(email: String!)`: メールアドレスでユーザー取得

### Mutation

- `createUser(createUserInput: CreateUserInput!)`: ユーザー登録
- `signIn(signInInput: SignInInput!)`: ユーザーログイン
- `createTask(createTaskInput: CreateTaskInput!)`: タスク作成
- `updateTask(updateTaskInput: UpdateTaskInput!)`: タスク更新
- `deleteTask(id: Int!)`: タスク削除

## 🔗 関連リンク

- [フロントエンドアプリ](../frontend/README.md)
- [プロジェクト概要](../README.md)
- [GraphQL Playground](http://localhost:3000/graphql) (開発環境)

## 📝 ライセンス

This project is for educational purposes.
