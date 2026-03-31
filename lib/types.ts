// ─── 離乳食ステージ ────────────────────────────────────────────────────────────
export type FoodStage = "early" | "mid" | "late" | "complete";

export const STAGE_LABELS: Record<FoodStage, string> = {
  early: "初期（5〜6ヶ月）",
  mid: "中期（7〜8ヶ月）",
  late: "後期（9〜11ヶ月）",
  complete: "完了期（12ヶ月〜）",
};

// ─── 食材カテゴリ ──────────────────────────────────────────────────────────────
export type FoodCategory =
  | "carb"
  | "fish"
  | "meat"
  | "bean"
  | "egg"
  | "veggie"
  | "fruit"
  | "dairy"
  | "seasoning";

export const CATEGORY_LABELS: Record<FoodCategory, string> = {
  carb: "炭水化物",
  fish: "魚・魚介",
  meat: "肉類",
  bean: "豆類・大豆",
  egg: "卵",
  veggie: "野菜",
  fruit: "果物",
  dairy: "乳製品",
  seasoning: "調味料・だし",
};

// ─── 試食ステータス ────────────────────────────────────────────────────────────
export type FoodStatus = "untried" | "ok" | "skip" | "ng";

export const STATUS_CONFIG: Record<
  FoodStatus,
  { label: string; bg: string; fg: string; border: string }
> = {
  ok: {
    label: "✓ 済み",
    bg: "bg-status-ok",
    fg: "text-status-ok-fg",
    border: "border-green-300",
  },
  skip: {
    label: "△ 様子見",
    bg: "bg-status-skip",
    fg: "text-status-skip-fg",
    border: "border-yellow-300",
  },
  ng: {
    label: "✕ NG",
    bg: "bg-status-ng",
    fg: "text-status-ng-fg",
    border: "border-red-300",
  },
  untried: {
    label: "未",
    bg: "bg-gray-100",
    fg: "text-gray-400",
    border: "border-gray-200",
  },
};

// ─── アレルギーリスク ──────────────────────────────────────────────────────────
export type AllergyRisk = "specific" | "related" | "none";
// specific = 特定原材料（卵・乳・小麦・えび・かに・落花生・そば）
// related  = 準ずるもの（いか・もも・大豆・etc）

// ─── 食材マスタ ────────────────────────────────────────────────────────────────
export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  subcategory: string;
  availableFrom: FoodStage; // この食材を開始できる最も早いステージ
  allergyRisk: AllergyRisk;
  allergyNote?: string; // アレルギー種別の補足
  prep: Partial<Record<FoodStage, string>>; // ステージ別調理メモ
  notes?: string; // 全般的な注意事項
}

// ─── 試食記録 ─────────────────────────────────────────────────────────────────
export interface FoodLog {
  id: string;
  foodId: string;
  triedAt: string; // ISO date (YYYY-MM-DD)
  status: FoodStatus;
  note?: string;
}

// ─── 献立 ────────────────────────────────────────────────────────────────────
export interface Meal {
  main: string;
  sides: string[];
  note?: string;
}

export interface DayPlan {
  date: string; // ISO date
  breakfast?: Meal;
  lunch?: Meal;
  dinner?: Meal;
}

// ─── 赤ちゃんプロフィール ─────────────────────────────────────────────────────
export interface BabyProfile {
  name: string;
  birthDate: string; // ISO date (YYYY-MM-DD)
  allergyFoodIds: string[];
}

// ─── 食事記録 ─────────────────────────────────────────────────────────────────
export type MealType = "breakfast" | "lunch" | "dinner";
export type MealReaction = "good" | "so-so";

export interface MealRecord {
  id: string;
  date: string;       // YYYY-MM-DD
  mealType: MealType;
  time: string;       // HH:MM
  items: string[];
  reaction: MealReaction;
  note?: string;
}

// ─── ユーティリティ型 ─────────────────────────────────────────────────────────
export interface FoodStatusMap {
  [foodId: string]: FoodStatus;
}
