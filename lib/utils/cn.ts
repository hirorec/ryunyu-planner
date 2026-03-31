/** クラス名を結合するユーティリティ（clsx 不要の軽量版） */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
