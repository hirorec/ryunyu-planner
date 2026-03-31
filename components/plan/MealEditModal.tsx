"use client";

import { FOODS } from "@/lib/data/foods";
import type { FoodStage } from "@/lib/types";
import { getStageFromBirthDate } from "@/lib/utils/babyAge";
import { useBabyStore } from "@/store/useBabyStore";
import { useFoodStore } from "@/store/useFoodStore";
import { useState } from "react";

type Meal = { main: string; sides: string[] };

interface Props {
  mealLabel: string;
  meal: Meal;
  onSave: (meal: Meal) => void;
  onClose: () => void;
}

const STAGE_ORDER: FoodStage[] = ["early", "mid", "late", "complete"];

export function MealEditModal({ mealLabel, meal, onSave, onClose }: Props) {
  const { statuses } = useFoodStore();
  const { profile } = useBabyStore();

  const [main, setMain] = useState(meal.main);
  const [sides, setSides] = useState<string[]>(meal.sides);
  const [customSide, setCustomSide] = useState("");

  const stage = getStageFromBirthDate(profile.birthDate);
  const stageIdx = STAGE_ORDER.indexOf(stage);

  const suggestedFoods = FOODS.filter((f) => {
    const foodIdx = STAGE_ORDER.indexOf(f.availableFrom);
    return foodIdx <= stageIdx && statuses[f.id] === "ok";
  }).slice(0, 16);

  const removeSide = (side: string) => {
    setSides((prev) => prev.filter((s) => s !== side));
  };

  const addSide = (name: string) => {
    if (!sides.includes(name)) {
      setSides((prev) => [...prev, name]);
    }
  };

  const addCustomSide = () => {
    const trimmed = customSide.trim();
    if (trimmed && !sides.includes(trimmed)) {
      setSides((prev) => [...prev, trimmed]);
    }
    setCustomSide("");
  };

  const handleSave = () => {
    if (!main.trim()) return;
    onSave({ main: main.trim(), sides });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* 背景オーバーレイ */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* ボトムシート */}
      <div className="relative w-full max-w-[390px] rounded-t-3xl bg-white px-5 pb-8 pt-4">
        {/* ハンドル */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />

        <h2 className="mb-4 text-base font-bold text-gray-800">
          {mealLabel}を編集
        </h2>

        {/* メイン料理 */}
        <p className="mb-2 text-xs font-medium text-gray-500">メイン料理</p>
        <input
          type="text"
          value={main}
          onChange={(e) => setMain(e.target.value)}
          placeholder="例：7倍粥"
          className="mb-4 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-mid"
        />

        {/* 副菜 */}
        <p className="mb-2 text-xs font-medium text-gray-500">副菜</p>

        {/* 現在の副菜チップ */}
        {sides.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {sides.map((side) => (
              <span
                key={side}
                className="flex items-center gap-1 rounded-full bg-brand-pale px-2.5 py-1 text-xs font-medium text-brand-dark"
              >
                {side}
                <button
                  onClick={() => removeSide(side)}
                  className="leading-none text-brand-dark/50 hover:text-brand-dark"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* 試食済み食材サジェスト */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {suggestedFoods
            .filter((f) => !sides.includes(f.name))
            .map((f) => (
              <button
                key={f.id}
                onClick={() => addSide(f.name)}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 active:bg-brand-pale active:text-brand-dark"
              >
                + {f.name}
              </button>
            ))}
        </div>

        {/* カスタム入力 */}
        <div className="mb-5 flex gap-2">
          <input
            type="text"
            value={customSide}
            onChange={(e) => setCustomSide(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomSide()}
            placeholder="その他の副菜を入力"
            className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-mid"
          />
          <button
            onClick={addCustomSide}
            className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 active:bg-gray-200"
          >
            追加
          </button>
        </div>

        {/* 保存ボタン */}
        <button
          onClick={handleSave}
          disabled={!main.trim()}
          className="gradient-card w-full rounded-2xl py-3.5 text-sm font-bold text-white transition-opacity disabled:opacity-40"
        >
          保存する
        </button>
      </div>
    </div>
  );
}
