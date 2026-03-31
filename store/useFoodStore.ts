"use client";
/**
 * 食材ステータス管理ストア（Zustand）
 *
 * 【プロトタイプ】: メモリ上に保持（リロードでリセット）
 * 【本番移行時】 : persist ミドルウェア + localStorage、
 *                  またはサーバー同期に切り替える
 */
import type { FoodStatus, FoodStatusMap } from "@/lib/types";
import { create } from "zustand";

// 初期値（デモ用：いくつかの食材を試食済みにしておく）
const INITIAL_STATUSES: FoodStatusMap = {
  okayu: "ok",
  udon: "ok",
  bread: "ok",
  potato: "ok",
  sweetpotato: "ok",
  pumpkin: "ok",
  whiteFish: "ok",
  shirasu: "ok",
  salmon: "ok",
  chickenSasami: "ok",
  tofu: "ok",
  yogurt: "ok",
  carrot: "ok",
  spinach: "ok",
  broccoli: "ok",
  tomato: "ok",
  onion: "ok",
  komatsuna: "ok",
  banana: "ok",
  apple: "ok",
  strawberry: "ok",
  kelpDashi: "ok",
  katsuoDashi: "ok",
  eggYolk: "skip", // 様子見
};

interface FoodStoreState {
  statuses: FoodStatusMap;

  /** 食材のステータスを取得 */
  getStatus: (foodId: string) => FoodStatus;

  /** 食材のステータスをサイクル（未→済み→様子見→NG→未） */
  cycleStatus: (foodId: string) => void;

  /** 食材のステータスを直接セット */
  setStatus: (foodId: string, status: FoodStatus) => void;

  /** 試食済み食材数を取得 */
  getTriedCount: (foodIds: string[]) => number;

  /** すべてのステータスをリセット */
  resetStatuses: () => void;
}

const STATUS_CYCLE: FoodStatus[] = ["untried", "ok", "skip", "ng"];

export const useFoodStore = create<FoodStoreState>((set, get) => ({
  statuses: INITIAL_STATUSES,

  getStatus: (foodId) => get().statuses[foodId] ?? "untried",

  cycleStatus: (foodId) => {
    const current = get().getStatus(foodId);
    const idx = STATUS_CYCLE.indexOf(current);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    set((state) => ({
      statuses: { ...state.statuses, [foodId]: next },
    }));
  },

  setStatus: (foodId, status) => {
    set((state) => ({
      statuses: { ...state.statuses, [foodId]: status },
    }));
  },

  getTriedCount: (foodIds) => {
    const { statuses } = get();
    return foodIds.filter((id) => statuses[id] === "ok").length;
  },

  resetStatuses: () => {
    set({ statuses: {} });
  },
}));
