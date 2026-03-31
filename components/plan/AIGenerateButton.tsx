"use client";
import clsx from "clsx";
import { useState } from "react";

interface AIGenerateButtonProps {
  onGenerate: () => Promise<void>;
  generated: boolean;
}

export function AIGenerateButton({
  onGenerate,
  generated,
}: AIGenerateButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    await onGenerate();
    setLoading(false);
  };

  return (
    <div
      className={clsx(
        "mx-4 mt-4 rounded-2xl p-4 transition-all",
        loading ? "border border-brand-pale bg-brand-bg" : "gradient-card",
      )}
    >
      <div className={clsx(loading ? "text-brand" : "text-white")}>
        <p className="text-sm font-bold mb-1">
          {loading ? "⏳ 献立を考えています..." : "✨ 今週の献立をAIで生成"}
        </p>
        <p
          className={clsx(
            "mb-3 text-xs",
            loading ? "text-brand-mid" : "text-green-100",
          )}
        >
          {loading
            ? "中期対応食材・未試食食材を考慮中"
            : "未試食の食材を取り入れた7日分の献立を提案します"}
        </p>
        <button
          onClick={handleClick}
          disabled={loading}
          className={clsx(
            "w-full rounded-xl py-2 text-sm font-bold transition-colors",
            loading
              ? "cursor-not-allowed bg-brand-pale text-gray-400"
              : "bg-white text-brand hover:bg-green-50 active:scale-[0.98]",
          )}
        >
          {loading
            ? "生成中..."
            : generated
              ? "🔄 再生成する"
              : "🍽️ 献立を生成する"}
        </button>
      </div>
    </div>
  );
}
