import { BottomNav } from "@/components/layout/BottomNav";
import { StoreHydration } from "@/components/layout/StoreHydration";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mobile-frame">
      <StoreHydration />
      {/* ページコンテンツ（BottomNav分の余白を下部に確保） */}
      <main className="min-h-screen pb-16">{children}</main>

      {/* 固定ボトムナビゲーション */}
      <BottomNav />
    </div>
  );
}
