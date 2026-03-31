import clsx from "clsx";

/** クラス名を結合するユーティリティ */
export function cn(...classes: Parameters<typeof clsx>): string {
  return clsx(...classes);
}
