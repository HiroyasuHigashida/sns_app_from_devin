# SNS App - X風ソーシャルネットワーキングサービス

## 概要
X（旧Twitter）風のSNSアプリケーションです。ユーザー認証、投稿、フォロー、いいね、検索機能を実装したフルスタックWebアプリケーションです。

## 技術スタック
- **フロントエンド**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **バックエンド**: FastAPI (Python) + JWT認証
- **データベース**: インメモリデータベース（開発用）

## 実装済み機能

### ✅ ユーザー機能
- ユーザー登録・ログイン・ログアウト
- ユーザープロフィール（名前、ユーザー名、自己紹介）
- プロフィール編集（認証済みユーザーのみ）

### ✅ 投稿機能
- テキスト投稿（最大280文字）
- 投稿の一覧表示（自分＋フォロー中のユーザー）
- 投稿の削除（本人のみ可能）

### ✅ タイムライン
- 自分とフォロー中のユーザーの投稿を新着順で表示
- リアルタイム更新機能

### ✅ フォロー機能
- フォロー / フォロー解除
- フォロー中・フォロワー一覧
- 他人のプロフィールページからフォロー可能

### ✅ いいね機能
- 投稿への「いいね」ボタン（トグル）
- いいね数の表示

### ✅ 検索機能
- ユーザー検索（名前、ユーザー名）
- 投稿検索（キーワード）

### ✅ UI/UX
- レスポンシブデザイン（PC・スマホ対応）
- モダンなUI（shadcn/ui使用）
- 直感的な操作性

## セットアップ方法

### バックエンド
```bash
cd sns-backend
poetry install
poetry run fastapi dev app/main.py
```

### フロントエンド
```bash
cd sns-frontend
npm install
npm run dev
```

## API エンドポイント

### 認証
- `POST /auth/register` - ユーザー登録
- `POST /auth/login` - ログイン

### ユーザー
- `GET /users/me` - 自分の情報取得
- `PUT /users/me` - プロフィール更新
- `GET /users/{username}` - ユーザー情報取得
- `GET /users/search` - ユーザー検索

### 投稿
- `POST /posts` - 投稿作成
- `GET /posts/timeline` - タイムライン取得
- `DELETE /posts/{post_id}` - 投稿削除
- `GET /posts/search` - 投稿検索

### フォロー
- `POST /follow/{user_id}` - フォロー
- `DELETE /follow/{user_id}` - フォロー解除
- `GET /users/{user_id}/followers` - フォロワー一覧
- `GET /users/{user_id}/following` - フォロー中一覧

### いいね
- `POST /posts/{post_id}/like` - いいね
- `DELETE /posts/{post_id}/like` - いいね解除

## 開発者情報
- 開発者: Devin AI
- 要件定義: higashida@kdl.co.jp
- Devinセッション: https://app.devin.ai/sessions/693f211814254ad5a1eef1dc63a00cbd

## 注意事項
- 現在はインメモリデータベースを使用しているため、サーバー再起動時にデータは失われます
- 本番環境では永続化データベース（PostgreSQL等）への移行を推奨します
