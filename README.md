# りゅにゅうプランナー

AI搭載の離乳食管理Webアプリ。赤ちゃんの月齢に応じた食材管理・献立生成を行う個人開発SaaS。

- **本番URL**: https://ryunyu-planner.vercel.app
- **ターゲット**: 0〜1歳児の保護者
- **認証**: Googleログイン（Supabase Auth）

---

## 技術スタック

| 項目 | 採用技術 |
|------|----------|
| フレームワーク | Next.js 15 (App Router) |
| UI | React 19 + Tailwind CSS v3 |
| 状態管理 | Zustand v5 |
| DB | Supabase (PostgreSQL) |
| 認証 | Supabase Auth (Google OAuth) |
| AI | Anthropic API (claude-haiku-4-5) |
| デプロイ | Vercel |

---

## ローカル開発

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` を作成して以下を設定：

```env
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

### 3. 開発サーバー起動

```bash
npm run dev
# → http://localhost:4000
```

---

## 外部サービスのセットアップ

### Supabase

#### テーブル作成（SQL Editor で実行）

```sql
create table babies (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  birth_date text not null default '',
  allergy_food_ids text[] not null default '{}',
  invite_code char(6) unique not null,
  updated_at timestamptz not null default now()
);

create table baby_members (
  baby_id uuid not null references babies(id) on delete cascade,
  user_id text not null,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (baby_id, user_id)
);

create table baby_profiles (
  device_id text primary key,
  name text not null default '',
  birth_date text not null default '',
  allergy_food_ids text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table food_statuses (
  device_id text not null,
  food_id text not null,
  status text not null,
  baby_id uuid,
  updated_at timestamptz not null default now(),
  primary key (device_id, food_id)
);

create table meal_logs (
  id text not null,
  device_id text not null,
  date text not null,
  meal_type text not null,
  time text not null,
  items text[] not null,
  reaction text not null,
  note text,
  baby_id uuid,
  created_at timestamptz not null default now(),
  primary key (id, device_id)
);

alter table babies disable row level security;
alter table baby_members disable row level security;
alter table baby_profiles disable row level security;
alter table food_statuses disable row level security;
alter table meal_logs disable row level security;
```

#### Google OAuth の有効化

1. Supabase Dashboard → **Authentication → Sign In Methods → Google** を有効化
2. Google Cloud Console で OAuth クライアントを作成
   - 承認済みリダイレクト URI: `https://<project-id>.supabase.co/auth/v1/callback`
3. クライアントID・シークレットを Supabase に設定

#### 本番URLのリダイレクト許可

Supabase Dashboard → **Authentication → URL Configuration**

- Site URL: `https://ryunyu-planner.vercel.app`
- Redirect URLs: `https://ryunyu-planner.vercel.app/**`

---

### Anthropic API

1. https://console.anthropic.com/settings/keys でAPIキーを発行
2. `.env.local` の `ANTHROPIC_API_KEY` に設定

---

### Vercel

環境変数（Settings → Environment Variables）に以下を設定してデプロイ：

```
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

---

## 主な機能

| 機能 | 説明 |
|------|------|
| 食材チェック | 試食済み・様子見・NGをタップで管理 |
| AI献立生成 | 月齢・試食状況に応じた7日分の献立を生成 |
| 食事記録 | 朝・昼・夜の食事を記録・履歴確認 |
| アカウント共有 | 招待コード・QRコードでパートナーと共有 |
| PWA対応 | ホーム画面に追加してアプリとして利用可能 |

---

## ディレクトリ構成

```
app/
  (app)/          # BottomNav付きレイアウト（要認証）
  auth/callback/  # Google OAuth コールバック
  login/          # ログイン画面
  api/
    generate-plan/ # Claude API 献立生成
components/
  auth/           # ログイン画面
  home/           # ホーム画面
  foods/          # 食材チェック画面
  plan/           # 献立画面
  logs/           # 食事履歴画面
  settings/       # 設定・共有画面
  layout/         # BottomNav / PageHeader / StoreHydration
  ui/             # Card / Badge
lib/
  data/foods.ts   # 食材マスタ（約35件）
  services/db.ts  # Supabase データ操作
  supabase.ts     # Supabaseブラウザクライアント
  supabase-server.ts # Supabaseサーバークライアント
  types.ts        # 型定義
  utils/          # babyAge / babyId / deviceId / cn
store/
  useBabyStore.ts
  useFoodStore.ts
  useMealLogStore.ts
middleware.ts     # 認証ガード（未ログインは /login へ）
```
