"use client";

import type { MealReaction, MealRecord, MealType } from "@/lib/types";
import { create } from "zustand";

// 今日の日付（YYYY-MM-DD）
const today = new Date().toISOString().slice(0, 10);

const INITIAL_LOGS: MealRecord[] = [
  {
    id: "init-1",
    date: today,
    mealType: "breakfast",
    time: "8:30",
    items: ["7倍粥", "にんじんペースト", "豆腐"],
    reaction: "good",
    note: "よく食べた！",
  },
  {
    id: "init-2",
    date: today,
    mealType: "lunch",
    time: "12:00",
    items: ["うどん", "ほうれん草", "しらす"],
    reaction: "so-so",
    note: "うどんを少し残した",
  },
];

interface MealLogState {
  logs: MealRecord[];
  addLog: (
    mealType: MealType,
    items: string[],
    reaction: MealReaction,
    note: string,
  ) => void;
  getLogsForDate: (date: string) => MealRecord[];
}

export const useMealLogStore = create<MealLogState>((set, get) => ({
  logs: INITIAL_LOGS,

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
  },

  getLogsForDate: (date) => get().logs.filter((l) => l.date === date),
}));
