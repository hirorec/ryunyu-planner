"use client";

import {
  createBaby,
  findBabyIdByUser,
  loadBabyProfile,
  loadFoodStatuses,
  loadMealLogs,
  migrateDataToBaby,
  saveFoodStatuses,
} from "@/lib/services/db";
import { supabase } from "@/lib/supabase";
import { getBabyId, setBabyId } from "@/lib/utils/babyId";
import { getDeviceId, setDeviceId } from "@/lib/utils/deviceId";
import { useBabyStore } from "@/store/useBabyStore";
import { useFoodStore } from "@/store/useFoodStore";
import { useMealLogStore } from "@/store/useMealLogStore";
import { useEffect } from "react";

export function StoreHydration() {
  useEffect(() => {
    const run = async () => {
      // ── 認証状態を確認 ────────────────────────────────────────────
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const userId = user?.id ?? getDeviceId();

      // Google ログイン後のデバイスID引き継ぎ
      if (user && getDeviceId() !== user.id) {
        setDeviceId(user.id);
      }

      // ── baby_id を解決 ────────────────────────────────────────────
      let babyId = getBabyId();

      if (!babyId) {
        // Supabase上でユーザーのbaby_idを検索
        const found = await findBabyIdByUser(userId);

        if (found) {
          babyId = found;
        } else {
          // 初回: 赤ちゃんレコードを新規作成し、既存データを移行
          const profile = useBabyStore.getState().profile;
          babyId = await createBaby(userId, profile);
          await migrateDataToBaby(userId, babyId);
        }

        setBabyId(babyId);
      }

      // ── Supabase からデータをロード ───────────────────────────────

      // 赤ちゃんプロフィール
      loadBabyProfile(babyId)
        .then((profile) => {
          if (profile) useBabyStore.getState().setProfile(profile);
        })
        .catch(console.error);

      // 食材ステータス
      loadFoodStatuses(babyId)
        .then((statuses) => {
          const store = useFoodStore.getState();
          if (Object.keys(statuses).length > 0) {
            store.setStatuses(statuses);
          } else {
            saveFoodStatuses(babyId, store.statuses).catch(console.error);
          }
        })
        .catch(console.error);

      // 食事ログ
      loadMealLogs(babyId)
        .then((logs) => {
          useMealLogStore.getState().setLogs(logs);
        })
        .catch(console.error);
    };

    run().catch(console.error);
  }, []);

  return null;
}
