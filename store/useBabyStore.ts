"use client";
import type { BabyProfile } from "@/lib/types";
import { create } from "zustand";

interface BabyStoreState {
  profile: BabyProfile;
  setProfile: (profile: BabyProfile) => void;
}

export const useBabyStore = create<BabyStoreState>((set) => ({
  // デモ用プロフィール（7ヶ月 = 中期）
  profile: {
    name: "メイ",
    birthDate: "2025-05-23",
    allergyFoodIds: [],
  },
  setProfile: (profile) => set({ profile }),
}));
