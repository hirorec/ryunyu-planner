"use client";
import { deleteFoodStatuses, saveFoodStatus } from "@/lib/services/db";
import type { FoodStatus, FoodStatusMap } from "@/lib/types";
import { getBabyId } from "@/lib/utils/babyId";
import { create } from "zustand";

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
  eggYolk: "skip",
};

interface FoodStoreState {
  statuses: FoodStatusMap;
  getStatus: (foodId: string) => FoodStatus;
  cycleStatus: (foodId: string) => void;
  setStatus: (foodId: string, status: FoodStatus) => void;
  setStatuses: (statuses: FoodStatusMap) => void;
  getTriedCount: (foodIds: string[]) => number;
  resetStatuses: () => void;
}

const STATUS_CYCLE: FoodStatus[] = ["untried", "ok", "skip", "ng"];

export const useFoodStore = create<FoodStoreState>()((set, get) => ({
  statuses: INITIAL_STATUSES,

  getStatus: (foodId) => get().statuses[foodId] ?? "untried",

  cycleStatus: (foodId) => {
    const current = get().getStatus(foodId);
    const idx = STATUS_CYCLE.indexOf(current);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    set((state) => ({ statuses: { ...state.statuses, [foodId]: next } }));
    const deviceId = getBabyId();
    if (deviceId) saveFoodStatus(deviceId, foodId, next).catch(console.error);
  },

  setStatus: (foodId, status) => {
    set((state) => ({ statuses: { ...state.statuses, [foodId]: status } }));
    const deviceId = getBabyId();
    if (deviceId) saveFoodStatus(deviceId, foodId, status).catch(console.error);
  },

  setStatuses: (statuses) => set({ statuses }),

  getTriedCount: (foodIds) => {
    const { statuses } = get();
    return foodIds.filter((id) => statuses[id] === "ok").length;
  },

  resetStatuses: () => {
    set({ statuses: {} });
    const deviceId = getBabyId();
    if (deviceId) deleteFoodStatuses(deviceId).catch(console.error);
  },
}));
