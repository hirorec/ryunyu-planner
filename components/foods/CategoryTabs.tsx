'use client'
import { CATEGORY_LABELS } from '@/lib/types'
import type { FoodCategory } from '@/lib/types'

interface CategoryTabsProps {
  categories: FoodCategory[]
  selected: FoodCategory
  counts: Partial<Record<FoodCategory, { done: number; total: number }>>
  onSelect: (cat: FoodCategory) => void
}

export function CategoryTabs({
  categories,
  selected,
  counts,
  onSelect,
}: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto py-3 px-4 bg-white border-b border-gray-100 scrollbar-none">
      {categories.map(cat => {
        const active = cat === selected
        const c = counts[cat]
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full
                        text-xs font-medium transition-colors duration-150
                        ${active
                          ? 'bg-brand-light text-white font-bold'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
          >
            {CATEGORY_LABELS[cat]}
            {c && (
              <span className={`text-[10px] ${active ? 'text-green-100' : 'text-gray-400'}`}>
                {c.done}/{c.total}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
