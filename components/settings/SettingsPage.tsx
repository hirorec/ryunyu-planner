"use client";
import { PageHeader } from "@/components/layout/PageHeader";
import { StageBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { FOODS } from "@/lib/data/foods";
import { STAGE_LABELS } from "@/lib/types";
import {
  calcAgeMonths,
  formatAgeMonths,
  getStageFromBirthDate,
} from "@/lib/utils/babyAge";
import { supabase } from "@/lib/supabase";
import { setDeviceId } from "@/lib/utils/deviceId";
import { useBabyStore } from "@/store/useBabyStore";
import { useFoodStore } from "@/store/useFoodStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SettingsPage() {
  const { profile, setProfile } = useBabyStore();
  const { statuses, resetStatuses } = useFoodStore();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // 新しい匿名IDを発行してリセット
    setDeviceId(crypto.randomUUID());
    router.push("/login");
  };

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editBirth, setEditBirth] = useState(profile.birthDate);

  const stage = getStageFromBirthDate(profile.birthDate);
  const ageMonths = calcAgeMonths(profile.birthDate);
  const stageLabel = STAGE_LABELS[stage];

  const okCount = FOODS.filter((f) => statuses[f.id] === "ok").length;
  const ngCount = FOODS.filter((f) => statuses[f.id] === "ng").length;
  const skipCount = FOODS.filter((f) => statuses[f.id] === "skip").length;

  const handleSave = () => {
    if (editName.trim() && editBirth) {
      setProfile({
        name: editName.trim(),
        birthDate: editBirth,
        allergyFoodIds: profile.allergyFoodIds,
      });
      setEditing(false);
    }
  };

  return (
    <div>
      <PageHeader subtitle="設定" title="プロフィール" />

      <div className="space-y-4 px-4 py-4">
        {/* ─── 赤ちゃんプロフィール ─────────────────────────────────────────── */}
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-500">赤ちゃん情報</p>
            <button
              onClick={() => setEditing((e) => !e)}
              className="text-xs font-medium text-brand-light"
            >
              {editing ? "キャンセル" : "編集"}
            </button>
          </div>

          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-gray-500">
                  名前（ちゃん付け）
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="ゆい"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-brand-light focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">
                  生年月日
                </label>
                <input
                  type="date"
                  value={editBirth}
                  onChange={(e) => setEditBirth(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-brand-light focus:outline-none"
                />
              </div>
              <button
                onClick={handleSave}
                className="gradient-card w-full rounded-xl py-2.5 text-sm font-bold text-white"
              >
                保存する
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="gradient-card flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl">
                🍼
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xl font-bold text-gray-800">
                  {profile.name}ちゃん
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {formatAgeMonths(ageMonths)}
                </p>
                <div className="mt-1.5">
                  <StageBadge label={stageLabel.split("（")[0]} />
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* ─── 食材記録の統計 ───────────────────────────────────────────────── */}
        <Card className="p-4">
          <p className="mb-3 text-xs font-bold text-gray-500">
            食材記録のまとめ
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                label: "◎ OK",
                count: okCount,
                bg: "bg-status-ok",
                fg: "text-status-ok-fg",
              },
              {
                label: "△ 様子見",
                count: skipCount,
                bg: "bg-status-skip",
                fg: "text-status-skip-fg",
              },
              {
                label: "✕ NG",
                count: ngCount,
                bg: "bg-status-ng",
                fg: "text-status-ng-fg",
              },
            ].map(({ label, count, bg, fg }) => (
              <div key={label} className={`${bg} rounded-xl py-3 text-center`}>
                <p className={`text-2xl font-bold ${fg}`}>{count}</p>
                <p className={`text-[10px] font-medium mt-0.5 ${fg}`}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* ─── アレルギー情報 ──────────────────────────────────────────────── */}
        <Card className="p-4">
          <p className="mb-2 text-xs font-bold text-gray-500">
            主要アレルゲン（特定原材料）
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[
              "卵",
              "乳",
              "小麦",
              "えび",
              "かに",
              "そば",
              "落花生",
              "くるみ",
            ].map((a) => (
              <span
                key={a}
                className="rounded-full border border-red-100 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-500"
              >
                {a}
              </span>
            ))}
          </div>
          <p className="mt-2.5 text-[10px] leading-relaxed text-gray-400">
            初めて試す際は少量から。反応があればすぐに摂取を中止し、医師に相談してください。
          </p>
        </Card>

        {/* ─── データリセット ──────────────────────────────────────────────── */}
        <Card className="p-4">
          <p className="mb-1 text-xs font-bold text-gray-500">データ管理</p>
          <p className="mb-3 text-xs text-gray-400">
            食材のステータスをすべてリセットします。
          </p>
          <button
            onClick={() => {
              if (
                typeof window !== "undefined" &&
                window.confirm("食材の記録をすべてリセットしますか？")
              ) {
                resetStatuses();
              }
            }}
            className="w-full rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-50"
          >
            食材記録をリセット
          </button>
        </Card>

        {/* ─── ログアウト ──────────────────────────────────────────────────── */}
        <button
          onClick={handleSignOut}
          className="w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-400 transition-colors hover:bg-gray-50"
        >
          ログアウト
        </button>

        {/* ─── アプリ情報 ──────────────────────────────────────────────────── */}
        <div className="space-y-1 py-2 text-center">
          <p className="text-xs font-medium text-gray-300">
            りゅにゅうプランナー
          </p>
          <p className="text-[10px] text-gray-200">Version 0.1.0 (prototype)</p>
        </div>
      </div>
    </div>
  );
}
