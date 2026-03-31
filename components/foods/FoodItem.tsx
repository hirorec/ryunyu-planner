"use client";

import { AllergyBadge, StatusBadge } from "@/components/ui/Badge";
import type { FoodItem as FoodItemType } from "@/lib/types";
import { STATUS_CONFIG } from "@/lib/types";
import { useFoodStore } from "@/store/useFoodStore";

interface FoodItemProps {
  food: FoodItemType;
}

export function FoodItem({ food }: FoodItemProps) {
  const { getStatus, cycleStatus } = useFoodStore();
  const status = getStatus(food.id);
  const cfg = STATUS_CONFIG[status];

  return (
    <button
      onClick={() => cycleStatus(food.id)}
      className={`w-full flex items-center justify-between px-4 py-3
                  bg-white rounded-xl border transition-all duration-150
                  active:scale-[0.98] text-left
                  ${cfg.border}`}
    >
      {/* 左: ドット + 食材名 + アレルギー */}
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`w-2.5 h-2.5 rounded-full shrink-0 border-2 ${cfg.bg} ${cfg.border}`}
        />
        <div className="min-w-0">
          <span className="mr-2 text-sm font-semibold text-gray-800">
            {food.name}
          </span>
          {food.allergyRisk !== "none" && food.allergyNote && (
            <AllergyBadge note={food.allergyNote} />
          )}
        </div>
      </div>

      {/* 右: ステータスバッジ */}
      <StatusBadge status={status} className="ml-2 shrink-0" />
    </button>
  );
}
