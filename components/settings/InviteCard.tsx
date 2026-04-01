"use client";

import { getInviteCode, joinBaby, findBabyByInviteCode } from "@/lib/services/db";
import { getBabyId, setBabyId } from "@/lib/utils/babyId";
import { getDeviceId } from "@/lib/utils/deviceId";
import { useBabyStore } from "@/store/useBabyStore";
import { useFoodStore } from "@/store/useFoodStore";
import { useMealLogStore } from "@/store/useMealLogStore";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

export function InviteCard() {
  const [inviteCode, setInviteCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [joined, setJoined] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  useEffect(() => {
    const babyId = getBabyId();
    if (babyId) {
      getInviteCode(babyId).then(setInviteCode).catch(console.error);
    }
  }, []);

  const handleJoin = async () => {
    const code = inputCode.trim().toUpperCase();
    if (code.length !== 6) return;

    setJoining(true);
    setJoinError("");

    const baby = await findBabyByInviteCode(code);
    if (!baby) {
      setJoinError("招待コードが見つかりません");
      setJoining(false);
      return;
    }

    const userId = getDeviceId();
    await joinBaby(baby.id, userId);
    setBabyId(baby.id);

    // ストアをリロード
    const { loadBabyProfile, loadFoodStatuses, loadMealLogs } = await import(
      "@/lib/services/db"
    );
    const [profile, statuses, logs] = await Promise.all([
      loadBabyProfile(baby.id),
      loadFoodStatuses(baby.id),
      loadMealLogs(baby.id),
    ]);
    if (profile) useBabyStore.getState().setProfile(profile);
    useFoodStore.getState().setStatuses(statuses);
    useMealLogStore.getState().setLogs(logs);

    setJoining(false);
    setJoined(true);
  };

  return (
    <div className="space-y-3">
      {/* 招待コード表示 */}
      {inviteCode && (
        <div className="rounded-2xl border border-brand-pale bg-brand-bg p-4">
          <p className="mb-3 text-xs font-bold text-gray-500">
            このアカウントを共有する
          </p>

          {/* QRコード */}
          <div className="mb-3 flex justify-center">
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <QRCodeSVG
                value={inviteCode}
                size={120}
                fgColor="#2e7d32"
              />
            </div>
          </div>

          {/* 招待コード */}
          <div className="text-center">
            <p className="mb-1 text-[10px] text-gray-400">招待コード</p>
            <p className="font-mono text-2xl font-bold tracking-[0.3em] text-brand-dark">
              {inviteCode}
            </p>
          </div>

          <p className="mt-3 text-center text-[10px] leading-relaxed text-gray-400">
            パートナーにコードを伝えるか<br />QRコードを読み取ってもらいましょう
          </p>
        </div>
      )}

      {/* 参加フォーム */}
      {!joined ? (
        <div>
          {!showJoin ? (
            <button
              onClick={() => setShowJoin(true)}
              className="w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50"
            >
              招待コードで参加する
            </button>
          ) : (
            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="mb-2 text-xs font-bold text-gray-500">
                招待コードを入力
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) =>
                    setInputCode(e.target.value.toUpperCase().slice(0, 6))
                  }
                  placeholder="ABCDE1"
                  maxLength={6}
                  className="flex-1 rounded-xl border border-gray-200 px-3 py-2 font-mono text-sm font-bold tracking-widest outline-none focus:border-brand-mid"
                />
                <button
                  onClick={handleJoin}
                  disabled={joining || inputCode.length !== 6}
                  className="rounded-xl bg-brand-light px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
                >
                  {joining ? "..." : "参加"}
                </button>
              </div>
              {joinError && (
                <p className="mt-2 text-xs text-red-400">{joinError}</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl bg-status-ok px-4 py-3 text-center text-sm font-semibold text-status-ok-fg">
          ✓ データを共有しました！
        </div>
      )}
    </div>
  );
}
