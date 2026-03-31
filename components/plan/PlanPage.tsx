'use client'
import { useState } from 'react'
import { useFoodStore } from '@/store/useFoodStore'
import { useBabyStore } from '@/store/useBabyStore'
import { FOODS } from '@/lib/data/foods'
import { getStageFromBirthDate } from '@/lib/utils/babyAge'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { DaySelector } from '@/components/plan/DaySelector'
import { AIGenerateButton } from '@/components/plan/AIGenerateButton'

// ─── Demo plan data (placeholder until AI generation) ───────────────────────
type Meal = { main: string; sides: string[] }
type DayPlan = { breakfast: Meal; lunch: Meal; dinner?: Meal }

const DEMO_PLAN: DayPlan[] = [
  {
    breakfast: { main: '7倍粥', sides: ['にんじんペースト', '豆腐'] },
    lunch:     { main: 'うどん', sides: ['ほうれん草', '白身魚'] },
    dinner:    { main: '7倍粥', sides: ['かぼちゃ', 'しらす'] },
  },
  {
    breakfast: { main: '7倍粥', sides: ['かぼちゃ', '鶏ささみ'] },
    lunch:     { main: 'お粥', sides: ['ブロッコリー', '豆腐'] },
    dinner:    { main: 'うどん', sides: ['玉ねぎ', '鮭'] },
  },
  {
    breakfast: { main: 'お粥', sides: ['トマト', 'しらす'] },
    lunch:     { main: 'うどん', sides: ['玉ねぎ', '鮭'] },
    dinner:    { main: '7倍粥', sides: ['ほうれん草', '豆腐'] },
  },
  {
    breakfast: { main: '7倍粥', sides: ['バナナ', '豆腐'] },
    lunch:     { main: 'お粥', sides: ['にんじん', '鶏ささみ'] },
    dinner:    { main: 'うどん', sides: ['ほうれん草', '白身魚'] },
  },
  {
    breakfast: { main: '7倍粥', sides: ['かぼちゃ', 'しらす'] },
    lunch:     { main: 'うどん', sides: ['ほうれん草', '豆腐'] },
    dinner:    { main: 'お粥', sides: ['トマト', '鮭'] },
  },
  {
    breakfast: { main: 'お粥', sides: ['りんご', '豆腐'] },
    lunch:     { main: 'うどん', sides: ['ブロッコリー', '白身魚'] },
    dinner:    { main: '7倍粥', sides: ['玉ねぎ', '鶏ささみ'] },
  },
  {
    breakfast: { main: '7倍粥', sides: ['バナナ', 'しらす'] },
    lunch:     { main: 'お粥', sides: ['かぼちゃ', '豆腐'] },
    dinner:    { main: 'うどん', sides: ['ほうれん草', '鮭'] },
  },
]

const MEAL_LABELS = ['朝ごはん', '昼ごはん', '夜ごはん']
const MEAL_KEYS: (keyof DayPlan)[] = ['breakfast', 'lunch', 'dinner']

export function PlanPage() {
  const [selectedDay, setSelectedDay] = useState(0)
  const [plan, setPlan] = useState<DayPlan[]>(DEMO_PLAN)
  const [generated, setGenerated] = useState(false)

  const { statuses } = useFoodStore()
  const { profile } = useBabyStore()
  const stage = getStageFromBirthDate(profile.birthDate)

  const untriedFoods = FOODS.filter(f =>
    ['early','mid'].includes(f.availableFrom) &&
    (!statuses[f.id] || statuses[f.id] === 'untried')
  )

  const handleGenerate = async () => {
    // TODO 本番移行時: Claude API (claude-3-5-haiku-latest) を呼び出す
    await new Promise(r => setTimeout(r, 2000))
    // Shuffle demo plan to simulate regeneration
    const shuffled = [...DEMO_PLAN].sort(() => Math.random() - 0.5)
    setPlan(shuffled)
    setGenerated(true)
  }

  const dayPlan = plan[selectedDay]

  return (
    <div>
      <PageHeader subtitle="週間メニュー" title="こんしゅうの献立" />

      <DaySelector
        selected={selectedDay}
        onSelect={setSelectedDay}
        todayIdx={0}
      />

      {/* Untried badge */}
      {untriedFoods.length > 0 && (
        <div className="mx-4 mt-1 mb-1 px-3 py-2 bg-yellow-50 rounded-xl border border-yellow-100
                        flex items-center gap-2">
          <span className="text-sm">💡</span>
          <p className="text-xs text-yellow-700">
            未試食の食材が <strong>{untriedFoods.length}種類</strong> あります。
            献立生成で取り入れてみましょう！
          </p>
        </div>
      )}

      <AIGenerateButton onGenerate={handleGenerate} generated={generated} />

      {/* Day plan detail */}
      <div className="px-4 py-4 space-y-3">
        {MEAL_KEYS.map((key, i) => {
          const meal = dayPlan[key]
          if (!meal) return null
          return (
            <Card key={key} className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  {MEAL_LABELS[i]}
                </p>
                <button className="text-[10px] text-brand-light font-medium">
                  編集
                </button>
              </div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sm font-bold text-gray-800">{meal.main}</span>
                <span className="text-gray-200 text-xs">＋</span>
                {meal.sides.map((s, j) => (
                  <span key={j} className="text-xs bg-brand-bg text-brand-dark
                                            font-medium px-2 py-0.5 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </Card>
          )
        })}

        {/* Add meal note */}
        <div className="text-center pt-2">
          <button className="text-xs text-gray-300 border border-dashed border-gray-200
                             px-4 py-2 rounded-xl">
            + メモを追加する
          </button>
        </div>
      </div>

      {/* Allergen reminder */}
      <div className="mx-4 mb-6 px-3 py-2.5 bg-red-50 rounded-xl border border-red-100">
        <p className="text-[11px] text-red-600 font-medium mb-0.5">⚠️ アレルギーに注意</p>
        <p className="text-[10px] text-red-400 leading-relaxed">
          初めての食材は少量から。卵・乳・小麦・そば・落花生・えびは特に注意してください。
        </p>
      </div>
    </div>
  )
}
