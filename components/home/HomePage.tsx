"use client";
import { MealLogModal } from "@/components/home/MealLogModal";
import { ProgressRing } from "@/components/home/ProgressRing";
import { PageHeader } from "@/components/layout/PageHeader";
import { StageBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { FOODS } from "@/lib/data/foods";
import { STAGE_LABELS, type MealReaction, type MealType } from "@/lib/types";
import {
  calcAgeMonths,
  formatAgeMonths,
  getStageFromBirthDate,
} from "@/lib/utils/babyAge";
import { useBabyStore } from "@/store/useBabyStore";
import { useFoodStore } from "@/store/useFoodStore";
import { useMealLogStore } from "@/store/useMealLogStore";
import clsx from "clsx";
import { useState } from "react";

const WEEK_PLAN = [
  {
    day: "月",
    today: true,
    breakfast: { main: "お粥", sides: ["にんじんペースト", "豆腐"] },
    lunch: { main: "うどん", sides: ["ほうれん草", "白身魚"] },
  },
  {
    day: "火",
    today: false,
    breakfast: { main: "7倍粥", sides: ["かぼちゃ", "鶏ささみ"] },
    lunch: { main: "お粥", sides: ["ブロッコリー", "豆腐"] },
  },
  {
    day: "水",
    today: false,
    breakfast: { main: "お粥", sides: ["トマト", "しらす"] },
    lunch: { main: "うどん", sides: ["玉ねぎ", "鮭"] },
  },
];

const MEAL_ORDER: MealType[] = ["breakfast", "lunch", "dinner"];
const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "朝ごはん",
  lunch: "昼ごはん",
  dinner: "夜ごはん",
};

export function HomePage() {
  const { statuses } = useFoodStore();
  const { profile } = useBabyStore();
  const { addLog, getLogsForDate } = useMealLogStore();

  const [modalMealType, setModalMealType] = useState<MealType | null>(null);

  const stage = getStageFromBirthDate(profile.birthDate);
  const ageMonths = calcAgeMonths(profile.birthDate);
  const stageLabel = STAGE_LABELS[stage];

  const midFoods = FOODS.filter((f) =>
    ["early", "mid"].includes(f.availableFrom),
  );
  const triedCount = midFoods.filter((f) => statuses[f.id] === "ok").length;
  const nextUntried = midFoods.find(
    (f) => !statuses[f.id] || statuses[f.id] === "untried",
  );

  const today = new Date().toISOString().slice(0, 10);
  const todayLogs = getLogsForDate(today);
  const handleSave = (
    items: string[],
    reaction: MealReaction,
    note: string,
  ) => {
    if (!modalMealType) return;
    addLog(modalMealType, items, reaction, note);
    setModalMealType(null);
  };

  return (
    <div>
      {/* ─── ヘッダー ─────────────────────────────────────────────────────────── */}
      <PageHeader
        subtitle="こんにちは！"
        title={`${profile.name}ちゃんの離乳食 🌱`}
      >
        <StageBadge
          label={`${stageLabel.split("（")[0]} （${formatAgeMonths(ageMonths)}）`}
        />
      </PageHeader>

      <div className="space-y-4 px-4 py-4">
        {/* ─── 進捗カード ──────────────────────────────────────────────────────── */}
        <Card className="flex items-center gap-4 p-4">
          <ProgressRing
            done={triedCount}
            total={midFoods.length}
            size={64}
            strokeWidth={6}
          />
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-xs text-gray-500">中期対応食材の試食進捗</p>
            <p className="text-xl font-bold text-brand-dark">
              {triedCount}
              <span className="text-sm font-normal text-gray-400">
                {" "}
                / {midFoods.length} 食材
              </span>
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              未試食：{midFoods.length - triedCount}食材
            </p>
          </div>
          {nextUntried && (
            <div className="shrink-0 rounded-xl border border-yellow-100 bg-yellow-50 px-3 py-2 text-center">
              <p className="text-[9px] font-medium text-yellow-700">
                次に試したい
              </p>
              <p className="mt-0.5 text-sm font-bold text-yellow-800">
                {nextUntried.name}
              </p>
            </div>
          )}
        </Card>

        {/* ─── 今日の食事 ──────────────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-2 text-sm font-bold text-gray-700">今日の食事</h2>
          <div className="space-y-2">
            {MEAL_ORDER.map((mealType) => {
              const log = todayLogs.find((l) => l.mealType === mealType);

              if (log) {
                return (
                  <Card key={mealType} className="overflow-hidden">
                    <div className="flex items-start justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <p className="mb-1 text-[10px] text-gray-400">
                          {MEAL_LABELS[mealType]}（{log.time}）
                        </p>
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {log.items.join("・")}
                        </p>
                        {log.note && (
                          <p className="mt-1 text-xs text-gray-500">
                            💬 {log.note}
                          </p>
                        )}
                      </div>
                      <span
                        className={clsx(
                          "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                          log.reaction === "good"
                            ? "bg-status-ok text-status-ok-fg"
                            : "bg-status-skip text-status-skip-fg",
                        )}
                      >
                        {log.reaction === "good" ? "よく食べた" : "様子見"}
                      </span>
                    </div>
                  </Card>
                );
              }

              return (
                <div
                  key={mealType}
                  className="flex items-center justify-between rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-3"
                >
                  <div>
                    <p className="mb-0.5 text-xs text-gray-300">
                      {MEAL_LABELS[mealType]}
                    </p>
                    <p className="text-sm text-gray-300">
                      まだ記録されていません
                    </p>
                  </div>
                  <button
                    onClick={() => setModalMealType(mealType)}
                    className="gradient-card rounded-xl px-4 py-2 text-xs font-semibold text-white transition-transform active:scale-95"
                  >
                    + 記録する
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 今週の献立（抜粋） ──────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-2 text-sm font-bold text-gray-700">
            今週の献立（抜粋）
          </h2>
          <Card className="space-y-3 p-4">
            {WEEK_PLAN.map((day, i) => (
              <div key={i}>
                {i > 0 && (
                  <div className="-mx-4 mb-3 border-t border-gray-50" />
                )}
                <div className="flex items-start gap-3">
                  <div
                    className={clsx(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      day.today
                        ? "bg-brand-light text-white"
                        : "bg-brand-bg text-brand-dark",
                    )}
                  >
                    {day.day}
                  </div>
                  <div className="min-w-0">
                    {[day.breakfast, day.lunch].map(
                      (meal, j) =>
                        meal && (
                          <p
                            key={j}
                            className="text-xs leading-relaxed text-gray-600"
                          >
                            <span className="text-gray-400">
                              {j === 0 ? "朝：" : "昼："}
                            </span>
                            {meal.main} / {meal.sides.join("・")}
                          </p>
                        ),
                    )}
                  </div>
                </div>
              </div>
            ))}
            <p className="pt-1 text-center text-xs font-medium text-brand-light">
              献立タブで全日程を見る →
            </p>
          </Card>
        </section>
      </div>

      {/* ─── 食事記録モーダル ──────────────────────────────────────────────────── */}
      {modalMealType && (
        <MealLogModal
          mealType={modalMealType}
          onSave={handleSave}
          onClose={() => setModalMealType(null)}
        />
      )}
    </div>
  );
}
