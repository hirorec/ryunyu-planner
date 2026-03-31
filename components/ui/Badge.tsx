import { cn } from '@/lib/utils/cn'
import { STATUS_CONFIG } from '@/lib/types'
import type { FoodStatus } from '@/lib/types'

interface StatusBadgeProps {
  status: FoodStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
      cfg.bg, cfg.fg, cfg.border,
      className,
    )}>
      {cfg.label}
    </span>
  )
}

interface StageBadgeProps {
  label: string
  className?: string
}

export function StageBadge({ label, className }: StageBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold',
      'bg-white/20 text-white backdrop-blur-sm',
      className,
    )}>
      {label}
    </span>
  )
}

interface AllergyBadgeProps {
  note: string
  className?: string
}

export function AllergyBadge({ note, className }: AllergyBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold',
      'bg-red-50 text-red-700 border border-red-100',
      className,
    )}>
      {note}アレルギー注意
    </span>
  )
}
