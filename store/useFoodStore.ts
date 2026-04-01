"use client";
import type { FoodStatus, FoodStatusMap } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  getStatus: (foodId: string) => FoodStatus;
  cycleStatus: (foodId: string) => void;
  setStatus: (foodId: string, status: FoodStatus) => void;
  getTriedCount: (foodIds: string[]) => number;
  resetStatuses: () => void;
}

const STATUS_CYCLE: FoodStatus[] = ["untried", "ok", "skip", "ng"];

export const useFoodStore = create<FoodStoreState>()(
  persist(
    (set, get) => ({
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
    }),
    { name: "ryunyu-food-statuses", skipHydration: true }
  )
);
