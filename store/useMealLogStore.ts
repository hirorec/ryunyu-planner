"use client";

import { saveMealLog } from "@/lib/services/db";
import type { MealReaction, MealRecord, MealType } from "@/lib/types";
import { getBabyId } from "@/lib/utils/babyId";
import { create } from "zustand";

interface MealLogState {
  logs: MealRecord[];
  setLogs: (logs: MealRecord[]) => void;
  addLog: (
    mealType: MealType,
    items: string[],
    reaction: MealReaction,
    note: string,
  ) => void;
  getLogsForDate: (date: string) => MealRecord[];
}

export const useMealLogStore = create<MealLogState>()((set, get) => ({
  logs: [],

  setLogs: (logs) => set({ logs }),

  addLog: (mealType, items, reaction, note) => {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 5);
    const record: MealRecord = {
      id: Date.now().toString(),
      date,
      mealType,
      time,
      items,
      reaction,
      note: note || undefined,
    };
    set((state) => ({ logs: [...state.logs, record] }));
    const deviceId = getBabyId();
    if (deviceId) saveMealLog(deviceId, record).catch(console.error);
  },

  getLogsForDate: (date) => get().logs.filter((l) => l.date === date),
}));
