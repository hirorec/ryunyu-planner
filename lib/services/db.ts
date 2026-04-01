import { supabase } from "@/lib/supabase";
import type {
  BabyProfile,
  FoodStatus,
  FoodStatusMap,
  MealRecord,
} from "@/lib/types";

// ─── 赤ちゃんプロフィール ─────────────────────────────────────────────────────

export async function loadBabyProfile(
  deviceId: string,
): Promise<BabyProfile | null> {
  const { data, error } = await supabase
    .from("baby_profiles")
    .select("name, birth_date, allergy_food_ids")
    .eq("device_id", deviceId)
    .maybeSingle();

  if (error || !data) return null;
  return {
    name: data.name,
    birthDate: data.birth_date,
    allergyFoodIds: data.allergy_food_ids ?? [],
  };
}

export async function saveBabyProfile(
  deviceId: string,
  profile: BabyProfile,
): Promise<void> {
  await supabase.from("baby_profiles").upsert({
    device_id: deviceId,
    name: profile.name,
    birth_date: profile.birthDate,
    allergy_food_ids: profile.allergyFoodIds,
    updated_at: new Date().toISOString(),
  });
}

// ─── 食材ステータス ────────────────────────────────────────────────────────────

export async function loadFoodStatuses(
  deviceId: string,
): Promise<FoodStatusMap> {
  const { data, error } = await supabase
    .from("food_statuses")
    .select("food_id, status")
    .eq("device_id", deviceId);

  if (error || !data) return {};
  return data.reduce<FoodStatusMap>((acc, row) => {
    acc[row.food_id] = row.status as FoodStatus;
    return acc;
  }, {});
}

export async function saveFoodStatus(
  deviceId: string,
  foodId: string,
  status: FoodStatus,
): Promise<void> {
  await supabase.from("food_statuses").upsert({
    device_id: deviceId,
    food_id: foodId,
    status,
    updated_at: new Date().toISOString(),
  });
}

export async function saveFoodStatuses(
  deviceId: string,
  statuses: FoodStatusMap,
): Promise<void> {
  const rows = Object.entries(statuses).map(([foodId, status]) => ({
    device_id: deviceId,
    food_id: foodId,
    status,
    updated_at: new Date().toISOString(),
  }));
  if (rows.length > 0) {
    await supabase.from("food_statuses").upsert(rows);
  }
}

export async function deleteFoodStatuses(deviceId: string): Promise<void> {
  await supabase.from("food_statuses").delete().eq("device_id", deviceId);
}

// ─── 食事ログ ────────────────────────────────────────────────────────────────

export async function loadMealLogs(deviceId: string): Promise<MealRecord[]> {
  const { data, error } = await supabase
    .from("meal_logs")
    .select("*")
    .eq("device_id", deviceId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id,
    date: row.date,
    mealType: row.meal_type as MealRecord["mealType"],
    time: row.time,
    items: row.items as string[],
    reaction: row.reaction as MealRecord["reaction"],
    note: row.note ?? undefined,
  }));
}

export async function saveMealLog(
  deviceId: string,
  log: MealRecord,
): Promise<void> {
  await supabase.from("meal_logs").insert({
    id: log.id,
    device_id: deviceId,
    date: log.date,
    meal_type: log.mealType,
    time: log.time,
    items: log.items,
    reaction: log.reaction,
    note: log.note ?? null,
  });
}

// ─── ログイン時のデータ引き継ぎ ──────────────────────────────────────────────

/** user_id 配下にデータが存在するか確認 */
export async function hasDataForDevice(deviceId: string): Promise<boolean> {
  const { data } = await supabase
    .from("baby_profiles")
    .select("device_id")
    .eq("device_id", deviceId)
    .maybeSingle();
  return !!data;
}

/** 匿名データ（oldDeviceId）をログイン後の user_id へ移行 */
export async function migrateData(
  oldDeviceId: string,
  newDeviceId: string,
): Promise<void> {
  // baby_profiles
  const { data: profile } = await supabase
    .from("baby_profiles")
    .select("*")
    .eq("device_id", oldDeviceId)
    .maybeSingle();
  if (profile) {
    await supabase
      .from("baby_profiles")
      .upsert({ ...profile, device_id: newDeviceId });
  }

  // food_statuses
  const { data: statuses } = await supabase
    .from("food_statuses")
    .select("*")
    .eq("device_id", oldDeviceId);
  if (statuses && statuses.length > 0) {
    await supabase
      .from("food_statuses")
      .upsert(statuses.map((s) => ({ ...s, device_id: newDeviceId })));
  }

  // meal_logs（id の重複を避けるため upsert）
  const { data: logs } = await supabase
    .from("meal_logs")
    .select("*")
    .eq("device_id", oldDeviceId);
  if (logs && logs.length > 0) {
    await supabase
      .from("meal_logs")
      .upsert(logs.map((l) => ({ ...l, device_id: newDeviceId })));
  }
}
