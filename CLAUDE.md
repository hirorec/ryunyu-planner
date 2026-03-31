# 離乳食プランナー — Claude Code 引き継ぎメモ

## プロダクト概要

**りゅにゅうプランナー**：AI搭載の離乳食管理Webアプリ。赤ちゃんの月齢に応じた食材管理・献立生成を行う個人開発SaaS。

- ターゲット：0〜1歳児の保護者（コンシューマー向け）
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
| 本番DB（予定） | Supabase |
| AI（予定） | Claude API (claude-3-5-haiku-latest) |

---

## ディレクトリ構成

```
ryunyu-planner/
├── app/
│   ├── (app)/                  # BottomNav付きレイアウトグループ
│   │   ├── layout.tsx          # AppLayout: <main> + <BottomNav>
│   │   ├── home/page.tsx
│   │   ├── foods/page.tsx
│   │   ├── plan/page.tsx
│   │   └── settings/page.tsx
│   ├── layout.tsx              # rootレイアウト（日本語フォント）
│   └── page.tsx                # → redirect('/home')
├── components/
│   ├── layout/
│   │   ├── BottomNav.tsx       # 'use client' / usePathname でアクティブ制御
│   │   └── PageHeader.tsx      # グラデーションヘッダー（title/subtitle/children）
│   ├── ui/
│   │   ├── Card.tsx            # 白い角丸カード（onClick任意）
│   │   └── Badge.tsx           # StatusBadge / StageBadge / AllergyBadge
│   ├── home/
│   │   ├── HomePage.tsx        # 進捗リング・食事ログ・週間プレビュー
│   │   └── ProgressRing.tsx    # SVG進捗リング
│   ├── foods/
│   │   ├── FoodsPage.tsx       # カテゴリタブ・ステータスフィルター・リスト
│   │   ├── FoodItem.tsx        # 'use client' / タップでcycleStatus
│   │   └── CategoryTabs.tsx    # 'use client' / 横スクロールタブ
│   ├── plan/
│   │   ├── PlanPage.tsx        # 曜日セレクター・AI生成・献立詳細
│   │   ├── AIGenerateButton.tsx # 'use client' / ローディング演出
│   │   └── DaySelector.tsx     # 'use client' / 7日間セレクター
│   └── settings/
│       └── SettingsPage.tsx    # プロフィール編集・統計・リセット
├── lib/
│   ├── types.ts                # FoodStage / FoodCategory / FoodStatus / interfaces
│   ├── data/
│   │   └── foods.ts            # 食材マスタ（~35件）TS配列 + getFoodsByCategory()
│   ├── services/
│   │   └── foods.service.ts    # 非同期サービス層（本番移行ポイント）
│   └── utils/
│       ├── babyAge.ts          # calcAgeMonths / getStageFromBirthDate / formatAgeMonths
│       └── cn.ts               # className utility
└── store/
    ├── useFoodStore.ts         # 食材ステータス管理（cycleStatus / resetStatuses）
    └── useBabyStore.ts         # 赤ちゃんプロフィール（setProfile）
```

---

## 重要な設計決定

### プロトタイプ→本番の移行ポイント

| 現在（プロトタイプ） | 本番移行時 |
|---------------------|-----------|
| `lib/data/foods.ts`（TS配列） | Supabase テーブルに移行 |
| `lib/services/foods.service.ts`（モック） | Supabase クライアント呼び出しに差し替え |
| Zustand（メモリ上） | `persist` ミドルウェア + localStorage → サーバー同期 |
| AI生成（setTimeout デモ） | Claude API (claude-3-5-haiku-latest) 呼び出し |

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

## デモデータ

- 赤ちゃん名: `ゆい`、誕生日: `2025-08-01`（= 約7ヶ月 → 中期ステージ）
- `useFoodStore` の `INITIAL_STATUSES` に23食材を `ok` としてセット済み

---

## 現在の実装状況

### 完了済み ✅
- プロジェクト設定（Next.js 15 / Tailwind / TypeScript / Zustand）
- 型定義・食材マスタデータ・サービス層・ストア
- 共通UIコンポーネント（BottomNav / PageHeader / Card / Badge）
- 全4画面（ホーム / 食材チェック / 献立 / 設定）

### 未実装・TODO 🚧
- 献立の「食材変更」モーダル（PlanPage.tsx の編集ボタン）
- メモ追加機能
- データの永続化（Zustand persist / Supabase）
- Claude API による実際の献立生成
- 認証（Supabase Auth）
- Premiumプラン・決済（Stripe）

---

## セットアップ

```bash
npm install
npm run dev
# → http://localhost:3000
```

---

## 参考ドキュメント

- 設計メモ: `~/Documents/キャリア＆資産戦略/離乳食プランナー_設計メモ.md`
- 食材マスタ（Excel）: `~/Documents/キャリア＆資産戦略/離乳食_食材マスタ.xlsx`
- UIフローチャート（FigJam）: https://www.figma.com/online-whiteboard/create-diagram/0792c3ad-075a-47c9-b66a-13bdd1c35293
