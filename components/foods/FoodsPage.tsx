"use client";

import { CategoryTabs } from "@/components/foods/CategoryTabs";
import { FoodItem } from "@/components/foods/FoodItem";
import { PageHeader } from "@/components/layout/PageHeader";
import { FOODS } from "@/lib/data/foods";
import type { FoodCategory, FoodStatus } from "@/lib/types";
import { CATEGORY_LABELS, STATUS_CONFIG } from "@/lib/types";
import { getStageFromBirthDate } from "@/lib/utils/babyAge";
import { useBabyStore } from "@/store/useBabyStore";
import { useFoodStore } from "@/store/useFoodStore";
import clsx from "clsx";
import { useMemo, useState } from "react";

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as FoodCategory[];

export function FoodsPage() {
  const { statuses } = useFoodStore();
  const { profile } = useBabyStore();
  const stage = getStageFromBirthDate(profile.birthDate);

  const [selectedCat, setSelectedCat] = useState<FoodCategory>("veggie");
  const [filterStatus, setFilterStatus] = useState<FoodStatus | "all">("all");

  // Filter foods available for this stage
  const stageFoods = useMemo(() => {
    const stageOrder = ["early", "mid", "late", "complete"];
    const idx = stageOrder.indexOf(stage);
    return FOODS.filter((f) => stageOrder.indexOf(f.availableFrom) <= idx);
  }, [stage]);

  // Per-category counts
  const counts = useMemo(() => {
    const result: Partial<
      Record<FoodCategory, { done: number; total: number }>
    > = {};
    for (const cat of ALL_CATEGORIES) {
      const catFoods = stageFoods.filter((f) => f.category === cat);
      if (catFoods.length === 0) continue;
      result[cat] = {
        done: catFoods.filter((f) => statuses[f.id] === "ok").length,
        total: catFoods.length,
      };
    }
    return result;
  }, [stageFoods, statuses]);

  const visibleCategories = ALL_CATEGORIES.filter((c) => counts[c]);

  // Foods to display
  const displayFoods = useMemo(() => {
    return stageFoods
      .filter((f) => f.category === selectedCat)
      .filter(
        (f) =>
          filterStatus === "all" ||
          (statuses[f.id] ?? "untried") === filterStatus,
      );
  }, [stageFoods, selectedCat, statuses, filterStatus]);

  const statusFilters: Array<{ key: FoodStatus | "all"; label: string }> = [
    { key: "all", label: "すべて" },
    { key: "untried", label: "未試食" },
    { key: "ok", label: "◎ OK" },
    { key: "skip", label: "△ 様子見" },
    { key: "ng", label: "✕ NG" },
  ];

  return (
    <div>
      <PageHeader subtitle="食材チェック" title="食べられる食材" />

      <CategoryTabs
        categories={visibleCategories}
        selected={selectedCat}
        counts={counts}
        onSelect={setSelectedCat}
      />

      {/* Status filter chips */}
      <div className="scrollbar-none flex gap-2 overflow-x-auto bg-white px-4 py-2.5">
        {statusFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterStatus(f.key)}
            className={clsx(
              "shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
              filterStatus === f.key
                ? "bg-brand-dark text-white"
                : "bg-gray-100 text-gray-500",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Food list */}
      <div className="space-y-2 px-4 py-3">
        {displayFoods.length === 0 ? (
          <div className="py-10 text-center text-gray-300">
            <p className="mb-2 text-3xl">🥦</p>
            <p className="text-sm">食材がありません</p>
          </div>
        ) : (
          displayFoods.map((food) => <FoodItem key={food.id} food={food} />)
        )}
      </div>

      {/* Legend */}
      <div className="px-4 pb-6">
        <p className="text-center text-[10px] text-gray-300">
          タップでステータスを切り替えられます
        </p>
        <div className="mt-1.5 flex justify-center gap-3">
          {(["ok", "skip", "ng", "untried"] as FoodStatus[]).map((s) => (
            <span
              key={s}
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full
                                       ${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].fg}`}
            >
              {STATUS_CONFIG[s].label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
