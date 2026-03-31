'use client'
import { useFoodStore } from '@/store/useFoodStore'
import { useBabyStore } from '@/store/useBabyStore'
import { FOODS } from '@/lib/data/foods'
import { STAGE_LABELS } from '@/lib/types'
import { calcAgeMonths, getStageFromBirthDate, formatAgeMonths } from '@/lib/utils/babyAge'
import { PageHeader } from '@/components/layout/PageHeader'
import { StageBadge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { ProgressRing } from '@/components/home/ProgressRing'

const WEEK_PLAN = [
  { day: '月', today: true,  breakfast: { main: 'お粥', sides: ['にんじんペースト','豆腐'] }, lunch: { main: 'うどん', sides: ['ほうれん草','白身魚'] } },
  { day: '火', today: false, breakfast: { main: '7倍粥', sides: ['かぼちゃ','鶏ささみ'] }, lunch: { main: 'お粥', sides: ['ブロッコリー','豆腐'] } },
  { day: '水', today: false, breakfast: { main: 'お粥', sides: ['トマト','しらす'] },     lunch: { main: 'うどん', sides: ['玉ねぎ','鮭'] } },
]

const FOOD_LOGS = [
  { time: '8:30',  meal: '朝ごはん', items: ['7倍粥','にんじんペースト','豆腐'], ok: true,  note: 'よく食べた！' },
  { time: '12:00', meal: '昼ごはん', items: ['うどん','ほうれん草','しらす'],   ok: false, note: 'うどんを少し残した' },
]

export function HomePage() {
  const { statuses } = useFoodStore()
  const { profile } = useBabyStore()

  const stage = getStageFromBirthDate(profile.birthDate)
  const ageMonths = calcAgeMonths(profile.birthDate)
  const stageLabel = STAGE_LABELS[stage]

  // 中期対応食材だけを対象にカウント
  const midFoods = FOODS.filter(f => ['early','mid'].includes(f.availableFrom))
  const triedCount = midFoods.filter(f => statuses[f.id] === 'ok').length
  const nextUntried = midFoods.find(f => !statuses[f.id] || statuses[f.id] === 'untried')

  return (
    <div>
      {/* ─── ヘッダー ─────────────────────────────────────────────────────────── */}
      <PageHeader
        subtitle="こんにちは！"
        title={`${profile.name}ちゃんの離乳食 🌱`}
      >
        <StageBadge label={`${stageLabel.split('（')[0]} （${formatAgeMonths(ageMonths)}）`} />
      </PageHeader>

      <div className="px-4 py-4 space-y-4">
        {/* ─── 進捗カード ──────────────────────────────────────────────────────── */}
        <Card className="p-4 flex items-center gap-4">
          <ProgressRing done={triedCount} total={midFoods.length} size={64} strokeWidth={6} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-1">中期対応食材の試食進捗</p>
            <p className="text-xl font-bold text-brand-dark">
              {triedCount}
              <span className="text-sm text-gray-400 font-normal"> / {midFoods.length} 食材</span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              未試食：{midFoods.length - triedCount}食材
            </p>
          </div>
          {nextUntried && (
            <div className="shrink-0 bg-yellow-50 rounded-xl px-3 py-2 text-center border border-yellow-100">
              <p className="text-[9px] text-yellow-700 font-medium">次に試したい</p>
              <p className="text-sm font-bold text-yellow-800 mt-0.5">{nextUntried.name}</p>
            </div>
          )}
        </Card>

        {/* ─── 今日の食事 ──────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-sm font-bold text-gray-700 mb-2">今日の食事</h2>
          <div className="space-y-2">
            {FOOD_LOGS.map((log, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="px-4 py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 mb-1">{log.meal}（{log.time}）</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {log.items.join('・')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">💬 {log.note}</p>
                  </div>
                  <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full
                                    ${log.ok
                                      ? 'bg-status-ok text-status-ok-fg'
                                      : 'bg-status-skip text-status-skip-fg'
                                    }`}>
                    {log.ok ? 'よく食べた' : '様子見'}
                  </span>
                </div>
              </Card>
            ))}

            {/* 夜ごはん未記録 */}
            <div className="flex items-center justify-between px-4 py-3
                            bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <div>
                <p className="text-xs text-gray-300 mb-0.5">夜ごはん</p>
                <p className="text-sm text-gray-300">まだ記録されていません</p>
              </div>
              <button className="gradient-card text-white text-xs font-semibold
                                 px-4 py-2 rounded-xl active:scale-95 transition-transform">
                + 記録する
              </button>
            </div>
          </div>
        </section>

        {/* ─── 今週の献立（抜粋） ──────────────────────────────────────────────── */}
        <section>
          <h2 className="text-sm font-bold text-gray-700 mb-2">今週の献立（抜粋）</h2>
          <Card className="p-4 space-y-3">
            {WEEK_PLAN.map((day, i) => (
              <div key={i}>
                {i > 0 && <div className="border-t border-gray-50 -mx-4 mb-3" />}
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center
                                   text-xs font-bold shrink-0
                                   ${day.today
                                     ? 'bg-brand-light text-white'
                                     : 'bg-brand-bg text-brand-dark'
                                   }`}>
                    {day.day}
                  </div>
                  <div className="min-w-0">
                    {[day.breakfast, day.lunch].map((meal, j) => meal && (
                      <p key={j} className="text-xs text-gray-600 leading-relaxed">
                        <span className="text-gray-400">{j === 0 ? '朝：' : '昼：'}</span>
                        {meal.main} / {meal.sides.join('・')}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <p className="text-xs text-brand-light text-center font-medium pt-1">
              献立タブで全日程を見る →
            </p>
          </Card>
        </section>
      </div>
    </div>
  )
}
