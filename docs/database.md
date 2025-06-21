## DB定義書

### 1. テーブル: `users`

| カラム名            | 型             | NOT NULL | PRIMARY | UNIQUE | 外部キー | DEFAULT | コメント                         |
|--------------------|----------------|----------|--------|--------|----------|---------|----------------------------------|
| `id`               | INT            | ✓        | ✓     |        |          |         | ユーザーの一意のID                |
| `profile`          | VARCHAR(1024)  |          |        |        |          |         | プロフィール                      |
| `username`         | VARCHAR(255)   | ✓        |        | ✓     |          |         | cognitoから連携されたユーザー名    |
| `registerd_at`     | DATETIME       | ✓         |        |        |          | CURRENT_TIMESTAMP(6) | 作成日              |

**ENGINE:** InnoDB  
**DEFAULT CHARSET:** utf8mb4  
**COLLATE:** utf8mb4_general_ci

---

### 2. テーブル: `posts`

| カラム名     | 型             | NOT NULL | PRIMARY | UNIQUE | 外部キー   | DEFAULT | コメント       |
|-------------|----------------|----------|--------|--------|-----------|--------|----------------|
| `id`        | INT            | ✓        | ✓      |        |           |        | 投稿の一意のID |
| `userId`    | INT            | ✓        |        |        | ✓ (`users`)|        | 投稿者のID     |
| `content`   | VARCHAR(255)   | ✓        |        |        |           |        | 投稿の内容     |
| `type`      | ENUM('post')   | ✓        |        |        |           |  'post'  | 投稿のタイプ   |
| `posted_at` | DATETIME       | ✓        |        |        |           | CURRENT_TIMESTAMP(6)| 投稿日時       |

**ENGINE:** InnoDB  
**DEFAULT CHARSET:** utf8mb4  
**COLLATE:** utf8mb4_general_ci

## 設定

| 設定名            | 値             | コメント                           |
|------------------|----------------|-----------------------------------|
| `timezone`       | UTC     | DBのタイムゾーン　　　　　　　　　　 |
