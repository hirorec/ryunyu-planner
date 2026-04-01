# 離乳食プランナー — Claude Code 引き継ぎメモ

## プロダクト概要

**りゅにゅうプランナー**：AI搭載の離乳食管理Webアプリ。赤ちゃんの月齢に応じた食材管理・献立生成を行う個人開発SaaS。

- ターゲット：0〜1歳児の保護者（コンシューマー向け）
- 本番URL：https://ryunyu-planner.vercel.app
- マネタイズ：無料 + ¥480/月 Premiumプラン（Phase 2）
- 競合：ぴよログ（食材管理機能なし）、和光堂サイト（静的情報のみ）

---

## 技術スタック

| 項目 | 採用技術 |
|------|----------|
| フレームワーク | Next.js 15 (App Router) |
| UI | React 19 + Tailwind CSS v3 |
| 状態管理 | Zustand v5 |
| 言語 | TypeScript (strict) |
| スタイル方針 | モバイルファースト (max-w: 390px) |
| DB | Supabase (PostgreSQL) |
| 認証 | Supabase Auth (Google OAuth) |
| AI | Anthropic API (claude-haiku-4-5-20251001) |
| デプロイ | Vercel |

---

## ディレクトリ構成

```
ryunyu-planner/
├── app/
│   ├── (app)/                  # BottomNav付きレイアウトグループ（要認証）
│   │   ├── layout.tsx          # AppLayout: <main> + <BottomNav> + StoreHydration
│   │   ├── home/page.tsx
│   │   ├── foods/page.tsx
│   │   ├── plan/page.tsx
│   │   ├── logs/page.tsx       # 食事履歴
│   │   └── settings/page.tsx
│   ├── auth/callback/route.ts  # Google OAuthコールバック
│   ├── login/page.tsx          # ログイン画面
│   ├── api/
│   │   └── generate-plan/route.ts  # Claude API 献立生成
│   ├── manifest.ts             # PWA manifest
│   ├── layout.tsx              # rootレイアウト
│   └── page.tsx                # → redirect('/home')
├── components/
│   ├── auth/
│   │   └── LoginPage.tsx       # Googleログインボタン
│   ├── layout/
│   │   ├── BottomNav.tsx       # 5タブ（ホーム/食材/献立/記録/設定）
│   │   ├── PageHeader.tsx      # グラデーションヘッダー
│   │   └── StoreHydration.tsx  # Supabaseからデータロード・baby_id解決
│   ├── ui/
│   │   ├── Card.tsx
│   │   └── Badge.tsx           # StatusBadge / StageBadge / AllergyBadge
│   ├── home/
│   │   ├── HomePage.tsx        # 進捗リング・食事ログ・週間プレビュー
│   │   └── ProgressRing.tsx
│   ├── foods/
│   │   ├── FoodsPage.tsx
│   │   ├── FoodItem.tsx        # タップでcycleStatus
│   │   └── CategoryTabs.tsx
│   ├── plan/
│   │   ├── PlanPage.tsx        # 曜日セレクター・AI生成・献立詳細
│   │   ├── AIGenerateButton.tsx
│   │   ├── DaySelector.tsx
│   │   └── MealEditModal.tsx   # 献立の食材編集モーダル
│   ├── logs/
│   │   └── LogsPage.tsx        # 食事履歴（日付別グルーピング）
│   └── settings/
│       ├── SettingsPage.tsx    # プロフィール編集・統計・共有・ログアウト
│       └── InviteCard.tsx      # 招待コード発行・QR表示・コード入力
├── lib/
│   ├── types.ts
│   ├── supabase.ts             # Supabaseブラウザクライアント（createBrowserClient）
│   ├── supabase-server.ts      # Supabaseサーバークライアント
│   ├── data/
│   │   └── foods.ts            # 食材マスタ（~35件）
│   ├── services/
│   │   └── db.ts               # Supabase全DB操作（babies/food_statuses/meal_logs）
│   └── utils/
│       ├── babyAge.ts
│       ├── babyId.ts           # getBabyId / setBabyId / generateInviteCode
│       ├── deviceId.ts         # getDeviceId / setDeviceId（user_id管理）
│       └── cn.ts
├── store/
│   ├── useFoodStore.ts         # 食材ステータス（Supabase同期）
│   ├── useBabyStore.ts         # 赤ちゃんプロフィール（Supabase同期）
│   └── useMealLogStore.ts      # 食事ログ（Supabase同期）
├── middleware.ts               # 未認証 → /login リダイレクト
└── public/
    └── icon.svg                # PWAアイコン
```

---

## 重要な設計決定

### データ識別子の構造

```
user_id（= Supabase Auth の user.id、または匿名UUID）
  └─ baby_members テーブルで baby_id に紐付く
      └─ babies / food_statuses / meal_logs は baby_id で管理
```

- 複数の user_id が同じ baby_id を共有できる（アカウント共有機能）
- `getBabyId()` → localStorage の `ryunyu-baby-id`
- `getDeviceId()` → localStorage の `ryunyu-device-id`（= user_id）
- StoreHydration で baby_id を解決してからデータをロード

### Supabaseテーブル構成

| テーブル | 主キー | 説明 |
|---------|--------|------|
| `babies` | `id (uuid)` | 赤ちゃん情報＋招待コード |
| `baby_members` | `(baby_id, user_id)` | 誰がどの赤ちゃんのデータにアクセスできるか |
| `food_statuses` | `(device_id, food_id)` | 食材ステータス（baby_idも持つ） |
| `meal_logs` | `(id, device_id)` | 食事記録（baby_idも持つ） |
| `baby_profiles` | `device_id` | 旧プロフィールテーブル（後方互換） |

### ブランドカラー（tailwind.config.ts）

```ts
brand: {
  dark: '#2e7d32', DEFAULT: '#388e3c', mid: '#43a047',
  light: '#66bb6a', pale: '#c8e6c9', bg: '#e8f5e9', surface: '#f7fbf7'
}
status: {
  ok: '#c8e6c9', 'ok-fg': '#2e7d32',
  skip: '#fff9c4', 'skip-fg': '#e65100',
  ng: '#ffcdd2', 'ng-fg': '#b71c1c'
}
```

### 離乳食ステージ定義

| stage | 時期 | FoodStage値 |
|-------|------|------------|
| 初期 | 5〜6ヶ月 | `'early'` |
| 中期 | 7〜8ヶ月 | `'mid'` |
| 後期 | 9〜11ヶ月 | `'late'` |
| 完了期 | 12ヶ月〜 | `'complete'` |

### 食材ステータスのサイクル

`untried` → `ok` → `skip` → `ng` → `untried`（タップで順に切り替え）

---

## 現在の実装状況

### 完了済み ✅
- 全画面実装（ホーム / 食材チェック / 献立 / 食事履歴 / 設定）
- Supabase DB永続化（food_statuses / meal_logs / babies）
- Google OAuth認証（Supabase Auth）
- Claude API 献立生成（claude-haiku-4-5-20251001）
- 招待コード＋QRコードによるアカウント共有
- PWA対応（Service Worker / manifest）
- Vercelデプロイ・本番稼働中

### 未実装・TODO 🚧
- Premiumプラン・決済（Stripe）
- メモ追加機能
- 食材マスタのSupabase移行（現在はTSファイル）
- RLSポリシーの設定（現在は全テーブルRLS無効）

---

## セットアップ

```bash
npm install
npm run dev
# → http://localhost:4000
```

### 必要な環境変数（.env.local）

```env
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

---

## 参考ドキュメント

- 設計メモ: `~/Documents/キャリア＆資産戦略/離乳食プランナー_設計メモ.md`
- 食材マスタ（Excel）: `~/Documents/キャリア＆資産戦略/離乳食_食材マスタ.xlsx`
- UIフローチャート（FigJam）: https://www.figma.com/online-whiteboard/create-diagram/0792c3ad-075a-47c9-b66a-13bdd1c35293
