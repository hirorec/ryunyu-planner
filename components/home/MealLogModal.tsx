"use client";
import { FOODS } from "@/lib/data/foods";
import type { FoodStage, MealReaction, MealType } from "@/lib/types";
import { getStageFromBirthDate } from "@/lib/utils/babyAge";
import { useBabyStore } from "@/store/useBabyStore";
import { useFoodStore } from "@/store/useFoodStore";
import { useState } from "react";

interface Props {
  mealType: MealType;
  onSave: (items: string[], reaction: MealReaction, note: string) => void;
  onClose: () => void;
}

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "朝ごはん",
  lunch: "昼ごはん",
  dinner: "夜ごはん",
};

const STAGE_ORDER: FoodStage[] = ["early", "mid", "late", "complete"];

export function MealLogModal({ mealType, onSave, onClose }: Props) {
  const { statuses } = useFoodStore();
  const { profile } = useBabyStore();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [customItem, setCustomItem] = useState("");
  const [reaction, setReaction] = useState<MealReaction>("good");
  const [note, setNote] = useState("");

  const stage = getStageFromBirthDate(profile.birthDate);
  const stageIdx = STAGE_ORDER.indexOf(stage);

  // 現在のステージ以下で試食済み（ok）の食材をサジェスト
  const suggestedFoods = FOODS.filter((f) => {
    const foodIdx = STAGE_ORDER.indexOf(f.availableFrom);
    return foodIdx <= stageIdx && statuses[f.id] === "ok";
  }).slice(0, 16);

  const toggleItem = (name: string) => {
    setSelectedItems((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name],
    );
  };

  const addCustomItem = () => {
    const trimmed = customItem.trim();
    if (trimmed && !selectedItems.includes(trimmed)) {
      setSelectedItems((prev) => [...prev, trimmed]);
    }
    setCustomItem("");
  };

  const handleSave = () => {
    if (selectedItems.length === 0) return;
    onSave(selectedItems, reaction, note);
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
          {MEAL_LABELS[mealType]}を記録
        </h2>

        {/* 食材チップ */}
        <p className="mb-2 text-xs font-medium text-gray-500">食べたもの</p>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {suggestedFoods.map((f) => (
            <button
              key={f.id}
              onClick={() => toggleItem(f.name)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                selectedItems.includes(f.name)
                  ? "border-brand bg-brand-pale text-brand-dark"
                  : "border-gray-200 bg-gray-50 text-gray-600"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>

        {/* カスタム入力 */}
        <div className="mb-3 flex gap-2">
          <input
            type="text"
            value={customItem}
            onChange={(e) => setCustomItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomItem()}
            placeholder="その他の食材を入力"
            className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-mid"
          />
          <button
            onClick={addCustomItem}
            className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 active:bg-gray-200"
          >
            追加
          </button>
        </div>

        {/* 選択済みアイテム */}
        {selectedItems.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {selectedItems.map((item) => (
              <span
                key={item}
                className="flex items-center gap-1 rounded-full bg-brand-pale px-2.5 py-1 text-xs font-medium text-brand-dark"
              >
                {item}
                <button
                  onClick={() => toggleItem(item)}
                  className="leading-none text-brand-dark/50 hover:text-brand-dark"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* 食べっぷり */}
        <p className="mb-2 text-xs font-medium text-gray-500">食べっぷり</p>
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setReaction("good")}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
              reaction === "good"
                ? "bg-status-ok text-status-ok-fg"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            よく食べた
          </button>
          <button
            onClick={() => setReaction("so-so")}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
              reaction === "so-so"
                ? "bg-status-skip text-status-skip-fg"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            様子見
          </button>
        </div>

        {/* メモ */}
        <p className="mb-2 text-xs font-medium text-gray-500">メモ（任意）</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="気になることがあれば..."
          rows={2}
          className="mb-5 w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-mid"
        />

        {/* 保存ボタン */}
        <button
          onClick={handleSave}
          disabled={selectedItems.length === 0}
          className="gradient-card w-full rounded-2xl py-3.5 text-sm font-bold text-white transition-opacity disabled:opacity-40"
        >
          記録する
        </button>
      </div>
    </div>
  );
}
