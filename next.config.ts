import type { NextConfig } from "next";
// @ts-expect-error next-pwa に型定義なし
import withPWA from "next-pwa";

const nextConfig: NextConfig = {};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
