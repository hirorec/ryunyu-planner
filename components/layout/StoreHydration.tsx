"use client";

import { useBabyStore } from "@/store/useBabyStore";
import { useFoodStore } from "@/store/useFoodStore";
import { useMealLogStore } from "@/store/useMealLogStore";
import { useEffect } from "react";

export function StoreHydration() {
  useEffect(() => {
    useFoodStore.persist.rehydrate();
    useBabyStore.persist.rehydrate();
    useMealLogStore.persist.rehydrate();
  }, []);

  return null;
}
