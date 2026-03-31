'use client'
import { useState } from 'react'
import { useBabyStore } from '@/store/useBabyStore'
import { useFoodStore } from '@/store/useFoodStore'
import { FOODS } from '@/lib/data/foods'
import { STAGE_LABELS } from '@/lib/types'
import { calcAgeMonths, getStageFromBirthDate, formatAgeMonths } from '@/lib/utils/babyAge'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { StageBadge } from '@/components/ui/Badge'

export function SettingsPage() {
  const { profile, setProfile } = useBabyStore()
  const { statuses, resetStatuses } = useFoodStore()

  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(profile.name)
  const [editBirth, setEditBirth] = useState(profile.birthDate)

  const stage = getStageFromBirthDate(profile.birthDate)
  const ageMonths = calcAgeMonths(profile.birthDate)
  const stageLabel = STAGE_LABELS[stage]

  const okCount = FOODS.filter(f => statuses[f.id] === 'ok').length
  const ngCount = FOODS.filter(f => statuses[f.id] === 'ng').length
  const skipCount = FOODS.filter(f => statuses[f.id] === 'skip').length

  const handleSave = () => {
    if (editName.trim() && editBirth) {
      setProfile({ name: editName.trim(), birthDate: editBirth })
      setEditing(false)
    }
  }

  return (
    <div>
      <PageHeader subtitle="設定" title="プロフィール" />

      <div className="px-4 py-4 space-y-4">

        {/* ─── 赤ちゃんプロフィール ─────────────────────────────────────────── */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-gray-500">赤ちゃん情報</p>
            <button
              onClick={() => setEditing(e => !e)}
              className="text-xs text-brand-light font-medium"
            >
              {editing ? 'キャンセル' : '編集'}
            </button>
          </div>

          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">名前（ちゃん付け）</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="ゆい"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                             focus:outline-none focus:border-brand-light"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">生年月日</label>
                <input
                  type="date"
                  value={editBirth}
                  onChange={e => setEditBirth(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                             focus:outline-none focus:border-brand-light"
                />
              </div>
              <button
                onClick={handleSave}
                className="w-full gradient-card text-white text-sm font-bold py-2.5 rounded-xl"
              >
                保存する
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full gradient-card flex items-center justify-center
                              text-2xl shrink-0">
                🍼
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xl font-bold text-gray-800">{profile.name}ちゃん</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatAgeMonths(ageMonths)}</p>
                <div className="mt-1.5">
                  <StageBadge label={stageLabel.split('（')[0]} />
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* ─── 食材記録の統計 ───────────────────────────────────────────────── */}
        <Card className="p-4">
          <p className="text-xs font-bold text-gray-500 mb-3">食材記録のまとめ</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: '◎ OK',  count: okCount,   bg: 'bg-status-ok',   fg: 'text-status-ok-fg' },
              { label: '△ 様子見', count: skipCount, bg: 'bg-status-skip', fg: 'text-status-skip-fg' },
              { label: '✕ NG',  count: ngCount,   bg: 'bg-status-ng',   fg: 'text-status-ng-fg' },
            ].map(({ label, count, bg, fg }) => (
              <div key={label} className={`${bg} rounded-xl py-3 text-center`}>
                <p className={`text-2xl font-bold ${fg}`}>{count}</p>
                <p className={`text-[10px] font-medium mt-0.5 ${fg}`}>{label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* ─── アレルギー情報 ──────────────────────────────────────────────── */}
        <Card className="p-4">
          <p className="text-xs font-bold text-gray-500 mb-2">主要アレルゲン（特定原材料）</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {['卵','乳','小麦','えび','かに','そば','落花生','くるみ'].map(a => (
              <span key={a} className="text-xs bg-red-50 text-red-500 border border-red-100
                                       px-2.5 py-1 rounded-full font-medium">
                {a}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-2.5 leading-relaxed">
            初めて試す際は少量から。反応があればすぐに摂取を中止し、医師に相談してください。
          </p>
        </Card>

        {/* ─── データリセット ──────────────────────────────────────────────── */}
        <Card className="p-4">
          <p className="text-xs font-bold text-gray-500 mb-1">データ管理</p>
          <p className="text-xs text-gray-400 mb-3">食材のステータスをすべてリセットします。</p>
          <button
            onClick={() => {
              if (typeof window !== 'undefined' &&
                  window.confirm('食材の記録をすべてリセットしますか？')) {
                resetStatuses()
              }
            }}
            className="w-full text-sm font-semibold text-red-400 border border-red-200
                       rounded-xl py-2.5 hover:bg-red-50 transition-colors"
          >
            食材記録をリセット
          </button>
        </Card>

        {/* ─── アプリ情報 ──────────────────────────────────────────────────── */}
        <div className="text-center py-2 space-y-1">
          <p className="text-xs text-gray-300 font-medium">りゅにゅうプランナー</p>
          <p className="text-[10px] text-gray-200">Version 0.1.0 (prototype)</p>
        </div>

      </div>
    </div>
  )
}
