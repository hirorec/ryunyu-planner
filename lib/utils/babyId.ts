const KEY = "ryunyu-baby-id";

export function getBabyId(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(KEY) ?? "";
}

export function setBabyId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, id);
}

export function clearBabyId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function generateInviteCode(): string {
  // 紛らわしい文字（0/O, 1/I）を除いたコード
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes)
    .map((b) => chars[b % chars.length])
    .join("");
}
