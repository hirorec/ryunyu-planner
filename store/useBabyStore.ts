"use client";
import { saveBabyProfile } from "@/lib/services/db";
import type { BabyProfile } from "@/lib/types";
import { getBabyId } from "@/lib/utils/babyId";
import { create } from "zustand";

interface BabyStoreState {
  profile: BabyProfile;
  setProfile: (profile: BabyProfile) => void;
}

export const useBabyStore = create<BabyStoreState>()((set) => ({
  profile: {
    name: "メイ",
    birthDate: "2025-05-23",
    allergyFoodIds: [],
  },
  setProfile: (profile) => {
    set({ profile });
    const deviceId = getBabyId();
    if (deviceId) saveBabyProfile(deviceId, profile).catch(console.error);
  },
}));
