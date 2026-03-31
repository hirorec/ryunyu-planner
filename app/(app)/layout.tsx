import { BottomNav } from "@/components/layout/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mobile-frame">
      {/* ページコンテンツ（BottomNav分の余白を下部に確保） */}
      <main className="min-h-screen pb-16">{children}</main>

      {/* 固定ボトムナビゲーション */}
      <BottomNav />
    </div>
  );
}
