import { supabase } from "@/lib/supabase";
import type {
  BabyProfile,
  FoodStatus,
  FoodStatusMap,
  MealRecord,
} from "@/lib/types";
import { generateInviteCode } from "@/lib/utils/babyId";

// ─── babies / baby_members ────────────────────────────────────────────────────

/** ユーザーが所属する baby_id を返す（なければ null） */
export async function findBabyIdByUser(
  userId: string,
): Promise<string | null> {
  const { data } = await supabase
    .from("baby_members")
    .select("baby_id")
    .eq("user_id", userId)
    .maybeSingle();
  return data?.baby_id ?? null;
}

/** 招待コードで baby を検索 */
export async function findBabyByInviteCode(
  code: string,
): Promise<{ id: string; name: string } | null> {
  const { data } = await supabase
    .from("babies")
    .select("id, name")
    .eq("invite_code", code.toUpperCase())
    .maybeSingle();
  return data ?? null;
}

/** 招待コードを取得 */
export async function getInviteCode(babyId: string): Promise<string> {
  const { data } = await supabase
    .from("babies")
    .select("invite_code")
    .eq("id", babyId)
    .maybeSingle();
  return data?.invite_code ?? "";
}

/** メンバーとして参加 */
export async function joinBaby(
  babyId: string,
  userId: string,
): Promise<void> {
  await supabase
    .from("baby_members")
    .upsert({ baby_id: babyId, user_id: userId, role: "member" });
}

/** 新しい babies レコードを作成して baby_id を返す */
export async function createBaby(
  userId: string,
  profile: BabyProfile,
): Promise<string> {
  const inviteCode = generateInviteCode();
  const { data, error } = await supabase
    .from("babies")
    .insert({
      name: profile.name,
      birth_date: profile.birthDate,
      allergy_food_ids: profile.allergyFoodIds,
      invite_code: inviteCode,
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !data) throw new Error("Failed to create baby");

  await supabase.from("baby_members").insert({
    baby_id: data.id,
    user_id: userId,
    role: "owner",
  });

  return data.id;
}

/** 既存の device_id データを baby_id に移行 */
export async function migrateDataToBaby(
  oldDeviceId: string,
  babyId: string,
): Promise<void> {
  await supabase
    .from("food_statuses")
    .update({ baby_id: babyId })
    .eq("device_id", oldDeviceId)
    .is("baby_id", null);

  await supabase
    .from("meal_logs")
    .update({ baby_id: babyId })
    .eq("device_id", oldDeviceId)
    .is("baby_id", null);
}

// ─── 赤ちゃんプロフィール ─────────────────────────────────────────────────────

export async function loadBabyProfile(
  babyId: string,
): Promise<BabyProfile | null> {
  const { data, error } = await supabase
    .from("babies")
    .select("name, birth_date, allergy_food_ids")
    .eq("id", babyId)
    .maybeSingle();

  if (error || !data) return null;
  return {
    name: data.name,
    birthDate: data.birth_date,
    allergyFoodIds: data.allergy_food_ids ?? [],
  };
}

export async function saveBabyProfile(
  babyId: string,
  profile: BabyProfile,
): Promise<void> {
  await supabase.from("babies").update({
    name: profile.name,
    birth_date: profile.birthDate,
    allergy_food_ids: profile.allergyFoodIds,
    updated_at: new Date().toISOString(),
  }).eq("id", babyId);
}

// ─── 食材ステータス ────────────────────────────────────────────────────────────

export async function loadFoodStatuses(
  babyId: string,
): Promise<FoodStatusMap> {
  const { data, error } = await supabase
    .from("food_statuses")
    .select("food_id, status")
    .eq("baby_id", babyId);

  if (error || !data) return {};
  return data.reduce<FoodStatusMap>((acc, row) => {
    acc[row.food_id] = row.status as FoodStatus;
    return acc;
  }, {});
}

export async function saveFoodStatus(
  babyId: string,
  foodId: string,
  status: FoodStatus,
): Promise<void> {
  await supabase.from("food_statuses").upsert({
    baby_id: babyId,
    device_id: babyId,
    food_id: foodId,
    status,
    updated_at: new Date().toISOString(),
  });
}

export async function saveFoodStatuses(
  babyId: string,
  statuses: FoodStatusMap,
): Promise<void> {
  const rows = Object.entries(statuses).map(([foodId, status]) => ({
    baby_id: babyId,
    device_id: babyId,
    food_id: foodId,
    status,
    updated_at: new Date().toISOString(),
  }));
  if (rows.length > 0) {
    await supabase.from("food_statuses").upsert(rows);
  }
}

export async function deleteFoodStatuses(babyId: string): Promise<void> {
  await supabase.from("food_statuses").delete().eq("baby_id", babyId);
}

// ─── 食事ログ ────────────────────────────────────────────────────────────────

export async function loadMealLogs(babyId: string): Promise<MealRecord[]> {
  const { data, error } = await supabase
    .from("meal_logs")
    .select("*")
    .eq("baby_id", babyId)
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
  babyId: string,
  log: MealRecord,
): Promise<void> {
  await supabase.from("meal_logs").insert({
    id: log.id,
    baby_id: babyId,
    device_id: babyId,
    date: log.date,
    meal_type: log.mealType,
    time: log.time,
    items: log.items,
    reaction: log.reaction,
    note: log.note ?? null,
  });
}
