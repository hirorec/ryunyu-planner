import type { FoodStage } from '@/lib/types'

/**
 * 生年月日から月齢を計算する
 */
export function calcAgeMonths(birthDate: string): number {
  const birth = new Date(birthDate)
  const now = new Date()
  return (
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth())
  )
}

/**
 * 月齢から離乳食ステージを判定する
 */
export function getStageFromAge(ageMonths: number): FoodStage {
  if (ageMonths < 7)  return 'early'
  if (ageMonths < 9)  return 'mid'
  if (ageMonths < 12) return 'late'
  return 'complete'
}

/**
 * 生年月日からステージを直接取得する
 */
export function getStageFromBirthDate(birthDate: string): FoodStage {
  return getStageFromAge(calcAgeMonths(birthDate))
}

/**
 * 月齢の表示文字列
 */
export function formatAgeMonths(ageMonths: number): string {
  if (ageMonths < 12) return `${ageMonths}ヶ月`
  const y = Math.floor(ageMonths / 12)
  const m = ageMonths % 12
  return m > 0 ? `${y}歳${m}ヶ月` : `${y}歳`
}
