/**
 * 食材サービス層
 *
 * 【プロトタイプ】: Zustand ストアを直接参照するモック実装
 * 【本番移行時】 : このファイルの実装を fetch('/api/foods/...') に切り替えるだけでOK
 *                  コンポーネント側は変更不要
 */
import { FOODS } from "@/lib/data/foods";
import type { FoodItem, FoodStatus } from "@/lib/types";

/** 全食材を取得 */
export async function getFoods(): Promise<FoodItem[]> {
  // 本番: return await fetch('/api/foods').then(r => r.json())
  return Promise.resolve(FOODS);
}

/** IDで食材を取得 */
export async function getFoodById(id: string): Promise<FoodItem | undefined> {
  return Promise.resolve(FOODS.find((f) => f.id === id));
}

/** ステータス更新（本番ではDBへ保存） */
export async function updateFoodStatus(
  _foodId: string,
  _status: FoodStatus,
): Promise<void> {
  // 本番: await fetch(`/api/foods/${_foodId}/status`, { method: 'PATCH', body: JSON.stringify({ status: _status }) })
  // プロトタイプではZustand storeが直接更新するのでここでは何もしない
  return Promise.resolve();
}
