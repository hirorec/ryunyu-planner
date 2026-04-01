"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { AIGenerateButton } from "@/components/plan/AIGenerateButton";
import { DaySelector } from "@/components/plan/DaySelector";
import { MealEditModal } from "@/components/plan/MealEditModal";
import { Card } from "@/components/ui/Card";
import { FOODS } from "@/lib/data/foods";
import { STAGE_LABELS } from "@/lib/types";
import { getStageFromBirthDate } from "@/lib/utils/babyAge";
import { useBabyStore } from "@/store/useBabyStore";
import { useFoodStore } from "@/store/useFoodStore";
import clsx from "clsx";
import { useState } from "react";

// ─── Demo plan data (placeholder until AI generation) ───────────────────────
type Meal = { main: string; sides: string[] };
type DayPlan = { breakfast: Meal; lunch: Meal; dinner?: Meal };

const DEMO_PLAN: DayPlan[] = [
  {
    breakfast: { main: "7倍粥", sides: ["にんじんペースト", "豆腐"] },
    lunch: { main: "うどん", sides: ["ほうれん草", "白身魚"] },
    dinner: { main: "7倍粥", sides: ["かぼちゃ", "しらす"] },
  },
  {
    breakfast: { main: "7倍粥", sides: ["かぼちゃ", "鶏ささみ"] },
    lunch: { main: "お粥", sides: ["ブロッコリー", "豆腐"] },
    dinner: { main: "うどん", sides: ["玉ねぎ", "鮭"] },
  },
  {
    breakfast: { main: "お粥", sides: ["トマト", "しらす"] },
    lunch: { main: "うどん", sides: ["玉ねぎ", "鮭"] },
    dinner: { main: "7倍粥", sides: ["ほうれん草", "豆腐"] },
  },
  {
    breakfast: { main: "7倍粥", sides: ["バナナ", "豆腐"] },
    lunch: { main: "お粥", sides: ["にんじん", "鶏ささみ"] },
    dinner: { main: "うどん", sides: ["ほうれん草", "白身魚"] },
  },
  {
    breakfast: { main: "7倍粥", sides: ["かぼちゃ", "しらす"] },
    lunch: { main: "うどん", sides: ["ほうれん草", "豆腐"] },
    dinner: { main: "お粥", sides: ["トマト", "鮭"] },
  },
  {
    breakfast: { main: "お粥", sides: ["りんご", "豆腐"] },
    lunch: { main: "うどん", sides: ["ブロッコリー", "白身魚"] },
    dinner: { main: "7倍粥", sides: ["玉ねぎ", "鶏ささみ"] },
  },
  {
    breakfast: { main: "7倍粥", sides: ["バナナ", "しらす"] },
    lunch: { main: "お粥", sides: ["かぼちゃ", "豆腐"] },
    dinner: { main: "うどん", sides: ["ほうれん草", "鮭"] },
  },
];

const DAYS = ["月", "火", "水", "木", "金", "土", "日"] as const;
const MEAL_LABELS = ["朝ごはん", "昼ごはん", "夜ごはん"];
const MEAL_KEYS: (keyof DayPlan)[] = ["breakfast", "lunch", "dinner"];
const MEAL_SHORT = ["朝", "昼", "夜"] as const;

type ViewMode = "day" | "week";

export function PlanPage() {
  const todayIdx = (new Date().getDay() + 6) % 7;
  const [selectedDay, setSelectedDay] = useState(todayIdx);
  const [plan, setPlan] = useState<DayPlan[]>(DEMO_PLAN);
  const [generated, setGenerated] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [editTarget, setEditTarget] = useState<{
    dayIdx: number;
    mealKey: keyof Omit<DayPlan, "date">;
  } | null>(null);

  const { statuses } = useFoodStore();
  const { profile } = useBabyStore();
  const stage = getStageFromBirthDate(profile.birthDate);

  const untriedFoods = FOODS.filter(
    (f) =>
      ["early", "mid"].includes(f.availableFrom) &&
      (!statuses[f.id] || statuses[f.id] === "untried"),
  );

  const handleGenerate = async () => {
    const okFoods = FOODS.filter((f) => statuses[f.id] === "ok");
    const untriedFoods = FOODS.filter(
      (f) =>
        ["early", "mid"].includes(f.availableFrom) &&
        (!statuses[f.id] || statuses[f.id] === "untried"),
    );
    const ngFoods = FOODS.filter(
      (f) =>
        statuses[f.id] === "ng" || profile.allergyFoodIds.includes(f.id),
    );

    const res = await fetch("/api/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        babyName: profile.name,
        stageLabel: STAGE_LABELS[stage],
        okFoodNames: okFoods.map((f) => f.name),
        untriedFoodNames: untriedFoods.map((f) => f.name),
        ngFoodNames: ngFoods.map((f) => f.name),
      }),
    });

    const data = await res.json();
    if (data.plan) {
      setPlan(data.plan);
      setGenerated(true);
    }
  };

  const handleMealSave = (meal: Meal) => {
    if (!editTarget) return;
    setPlan((prev) =>
      prev.map((d, i) =>
        i === editTarget.dayIdx ? { ...d, [editTarget.mealKey]: meal } : d,
      ),
    );
    setEditTarget(null);
  };

  const dayPlan = plan[selectedDay];

  return (
    <div>
      <PageHeader subtitle="週間メニュー" title="こんしゅうの献立" />

      {/* ─── 表示切替タブ ────────────────────────────────────────────────────── */}
      <div className="flex gap-1 px-4 pb-1 pt-2">
        {(["day", "week"] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={clsx(
              "rounded-xl px-4 py-1.5 text-xs font-semibold transition-colors",
              viewMode === mode
                ? "bg-brand-light text-white"
                : "bg-gray-100 text-gray-500",
            )}
          >
            {mode === "day" ? "日別" : "週間一覧"}
          </button>
        ))}
      </div>

      {/* ─── 未試食バナー ────────────────────────────────────────────────────── */}
      {untriedFoods.length > 0 && (
        <div className="mx-4 mb-1 mt-2 flex items-center gap-2 rounded-xl border border-yellow-100 bg-yellow-50 px-3 py-2">
          <span className="text-sm">💡</span>
          <p className="text-xs text-yellow-700">
            未試食の食材が <strong>{untriedFoods.length}種類</strong>{" "}
            あります。献立生成で取り入れてみましょう！
          </p>
        </div>
      )}

      <AIGenerateButton onGenerate={handleGenerate} generated={generated} />

      {viewMode === "day" ? (
        /* ─── 日別ビュー ──────────────────────────────────────────────────── */
        <>
          <DaySelector
            selected={selectedDay}
            onSelect={setSelectedDay}
            todayIdx={todayIdx}
          />

          <div className="space-y-3 px-4 py-2">
            {MEAL_KEYS.map((key, i) => {
              const meal = dayPlan[key];
              if (!meal) return null;
              return (
                <Card key={key} className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                      {MEAL_LABELS[i]}
                    </p>
                    <button
                      onClick={() =>
                        setEditTarget({ dayIdx: selectedDay, mealKey: key })
                      }
                      className="text-[10px] font-medium text-brand-light"
                    >
                      編集
                    </button>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-sm font-bold text-gray-800">
                      {meal.main}
                    </span>
                    <span className="text-xs text-gray-200">＋</span>
                    {meal.sides.map((s, j) => (
                      <span
                        key={j}
                        className="rounded-full bg-brand-bg px-2 py-0.5 text-xs font-medium text-brand-dark"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </Card>
              );
            })}

            <div className="pt-2 text-center">
              <button className="rounded-xl border border-dashed border-gray-200 px-4 py-2 text-xs text-gray-300">
                + メモを追加する
              </button>
            </div>
          </div>
        </>
      ) : (
        /* ─── 週間一覧ビュー ──────────────────────────────────────────────── */
        <div className="space-y-2 px-4 py-3">
          {plan.map((dayPlanItem, i) => (
            <Card
              key={i}
              className="overflow-hidden"
              onClick={() => {
                setSelectedDay(i);
                setViewMode("day");
              }}
            >
              <div className="flex items-stretch">
                {/* 曜日ラベル */}
                <div
                  className={clsx(
                    "flex w-12 shrink-0 flex-col items-center justify-center gap-0.5 py-3",
                    i === 0 ? "bg-brand-pale" : "bg-gray-50",
                  )}
                >
                  <span
                    className={clsx(
                      "text-sm font-bold",
                      i === 0 ? "text-brand-dark" : "text-gray-600",
                    )}
                  >
                    {DAYS[i]}
                  </span>
                  {i === 0 && (
                    <span className="text-[9px] font-medium text-brand-mid">
                      今日
                    </span>
                  )}
                </div>

                {/* 献立内容 */}
                <div className="min-w-0 flex-1 divide-y divide-gray-50 py-1">
                  {MEAL_KEYS.map((key, j) => {
                    const meal = dayPlanItem[key];
                    if (!meal) return null;
                    return (
                      <div
                        key={key}
                        className="flex items-baseline gap-1.5 px-3 py-1.5"
                      >
                        <span className="w-4 shrink-0 text-[10px] font-semibold text-gray-400">
                          {MEAL_SHORT[j]}
                        </span>
                        <span className="text-xs font-semibold text-gray-700">
                          {meal.main}
                        </span>
                        <span className="truncate text-[10px] text-gray-400">
                          {meal.sides.join("・")}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* 矢印 */}
                <div className="flex items-center pr-3 text-gray-300">›</div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ─── アレルギー注意 ──────────────────────────────────────────────────── */}
      <div className="mx-4 mb-6 mt-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5">
        <p className="mb-0.5 text-[11px] font-medium text-red-600">
          ⚠️ アレルギーに注意
        </p>
        <p className="text-[10px] leading-relaxed text-red-400">
          初めての食材は少量から。卵・乳・小麦・そば・落花生・えびは特に注意してください。
        </p>
      </div>

      {/* ─── 食事編集モーダル ─────────────────────────────────────────────────── */}
      {editTarget &&
        (() => {
          const meal = plan[editTarget.dayIdx][editTarget.mealKey];
          if (!meal) return null;
          return (
            <MealEditModal
              mealLabel={
                MEAL_LABELS[MEAL_KEYS.indexOf(editTarget.mealKey)]
              }
              meal={meal}
              onSave={handleMealSave}
              onClose={() => setEditTarget(null)}
            />
          );
        })()}
    </div>
  );
}
