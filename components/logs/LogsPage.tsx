"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import type { MealRecord, MealType } from "@/lib/types";
import { useMealLogStore } from "@/store/useMealLogStore";
import clsx from "clsx";

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "朝ごはん",
  lunch: "昼ごはん",
  dinner: "夜ごはん",
};

const MEAL_ORDER: Record<MealType, number> = {
  breakfast: 0,
  lunch: 1,
  dinner: 2,
};

const WEEK_DAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

function formatDateLabel(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round(
    (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
  );

  const label = `${d.getMonth() + 1}月${d.getDate()}日（${WEEK_DAYS[d.getDay()]}）`;
  if (diffDays === 0) return `今日　${label}`;
  if (diffDays === 1) return `昨日　${label}`;
  return label;
}

function MealCard({ record }: { record: MealRecord }) {
  return (
    <div className="flex items-start gap-3 py-3">
      {/* 食事種別ラベル */}
      <div className="w-14 shrink-0 pt-0.5 text-right text-[10px] font-semibold text-gray-400">
        {MEAL_LABELS[record.mealType]}
        <br />
        <span className="font-normal">{record.time}</span>
      </div>

      {/* 内容 */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap gap-1 mb-1">
          {record.items.map((item) => (
            <span
              key={item}
              className="rounded-full bg-brand-bg px-2 py-0.5 text-xs font-medium text-brand-dark"
            >
              {item}
            </span>
          ))}
        </div>
        {record.note && (
          <p className="text-xs text-gray-400">💬 {record.note}</p>
        )}
      </div>

      {/* リアクション */}
      <span
        className={clsx(
          "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
          record.reaction === "good"
            ? "bg-status-ok text-status-ok-fg"
            : "bg-status-skip text-status-skip-fg",
        )}
      >
        {record.reaction === "good" ? "よく食べた" : "様子見"}
      </span>
    </div>
  );
}

export function LogsPage() {
  const { logs } = useMealLogStore();

  // 日付ごとにグルーピング、新しい日付順
  const grouped = logs.reduce<Record<string, MealRecord[]>>((acc, log) => {
    (acc[log.date] ??= []).push(log);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => (a > b ? -1 : 1));

  // 各日付内を食事順（朝→昼→夜）にソート
  sortedDates.forEach((date) => {
    grouped[date].sort(
      (a, b) => MEAL_ORDER[a.mealType] - MEAL_ORDER[b.mealType],
    );
  });

  return (
    <div>
      <PageHeader subtitle="これまでの記録" title="食事の履歴" />

      <div className="px-4 py-4">
        {sortedDates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-4xl mb-3">🍚</p>
            <p className="text-sm font-medium text-gray-500">まだ記録がありません</p>
            <p className="mt-1 text-xs text-gray-300">
              ホームから食事を記録してみましょう
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedDates.map((date) => (
              <div key={date}>
                {/* 日付ヘッダー */}
                <p className="mb-2 text-xs font-bold text-gray-500">
                  {formatDateLabel(date)}
                </p>

                {/* その日の食事一覧 */}
                <Card className="divide-y divide-gray-50 px-4">
                  {grouped[date].map((record) => (
                    <MealCard key={record.id} record={record} />
                  ))}
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
