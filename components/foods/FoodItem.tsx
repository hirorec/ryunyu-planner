'use client'
import { useFoodStore } from '@/store/useFoodStore'
import { StatusBadge, AllergyBadge } from '@/components/ui/Badge'
import { STATUS_CONFIG } from '@/lib/types'
import type { FoodItem as FoodItemType } from '@/lib/types'

interface FoodItemProps {
  food: FoodItemType
}

export function FoodItem({ food }: FoodItemProps) {
  const { getStatus, cycleStatus } = useFoodStore()
  const status = getStatus(food.id)
  const cfg = STATUS_CONFIG[status]

  return (
    <button
      onClick={() => cycleStatus(food.id)}
      className={`w-full flex items-center justify-between px-4 py-3
                  bg-white rounded-xl border transition-all duration-150
                  active:scale-[0.98] text-left
                  ${cfg.border}`}
    >
      {/* 左: ドット + 食材名 + アレルギー */}
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-2.5 h-2.5 rounded-full shrink-0 border-2 ${cfg.bg} ${cfg.border}`} />
        <div className="min-w-0">
          <span className="text-sm font-semibold text-gray-800 mr-2">
            {food.name}
          </span>
          {food.allergyRisk !== 'none' && food.allergyNote && (
            <AllergyBadge note={food.allergyNote} />
          )}
        </div>
      </div>

      {/* 右: ステータスバッジ */}
      <StatusBadge status={status} className="shrink-0 ml-2" />
    </button>
  )
}
