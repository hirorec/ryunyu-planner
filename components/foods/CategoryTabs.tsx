"use client";
import type { FoodCategory } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import clsx from "clsx";

interface CategoryTabsProps {
  categories: FoodCategory[];
  selected: FoodCategory;
  counts: Partial<Record<FoodCategory, { done: number; total: number }>>;
  onSelect: (cat: FoodCategory) => void;
}

export function CategoryTabs({
  categories,
  selected,
  counts,
  onSelect,
}: CategoryTabsProps) {
  return (
    <div className="scrollbar-none flex gap-2 overflow-x-auto border-b border-gray-100 bg-white px-4 py-3">
      {categories.map((cat) => {
        const active = cat === selected;
        const c = counts[cat];
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={clsx(
              "shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150",
              active
                ? "bg-brand-light font-bold text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200",
            )}
          >
            {CATEGORY_LABELS[cat]}
            {c && (
              <span
                className={clsx(
                  "text-[10px]",
                  active ? "text-green-100" : "text-gray-400",
                )}
              >
                {c.done}/{c.total}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
