"use client";

import {
  hasDataForDevice,
  loadBabyProfile,
  loadFoodStatuses,
  loadMealLogs,
  migrateData,
  saveFoodStatuses,
} from "@/lib/services/db";
import { supabase } from "@/lib/supabase";
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

      const oldDeviceId = getDeviceId();

      if (user) {
        const userId = user.id;

        // device_id が user_id と異なる場合はデータ引き継ぎ
        if (oldDeviceId !== userId) {
          const alreadyMigrated = await hasDataForDevice(userId);
          if (!alreadyMigrated) {
            await migrateData(oldDeviceId, userId);
          }
          setDeviceId(userId);
        }
      }

      // ── Supabase からデータをロード ───────────────────────────────
      const deviceId = getDeviceId();

      // 赤ちゃんプロフィール
      loadBabyProfile(deviceId)
        .then((profile) => {
          if (profile) useBabyStore.getState().setProfile(profile);
        })
        .catch(console.error);

      // 食材ステータス
      loadFoodStatuses(deviceId)
        .then((statuses) => {
          const store = useFoodStore.getState();
          if (Object.keys(statuses).length > 0) {
            store.setStatuses(statuses);
          } else {
            // 初回アクセス: デフォルト値をSupabaseに保存
            saveFoodStatuses(deviceId, store.statuses).catch(console.error);
          }
        })
        .catch(console.error);

      // 食事ログ
      loadMealLogs(deviceId)
        .then((logs) => {
          useMealLogStore.getState().setLogs(logs);
        })
        .catch(console.error);
    };

    run().catch(console.error);
  }, []);

  return null;
}
