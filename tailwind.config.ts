import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // アプリブランドカラー（緑系）
        brand: {
          dark: "#2e7d32",
          DEFAULT: "#388e3c",
          mid: "#43a047",
          light: "#66bb6a",
          pale: "#c8e6c9",
          bg: "#e8f5e9",
          surface: "#f7fbf7",
        },
        // ステータスカラー
        status: {
          ok: "#c8e6c9",
          "ok-fg": "#2e7d32",
          skip: "#fff9c4",
          "skip-fg": "#e65100",
          ng: "#ffcdd2",
          "ng-fg": "#b71c1c",
        },
      },
      fontFamily: {
        sans: ['"Hiragino Sans"', '"Noto Sans JP"', "system-ui", "sans-serif"],
      },
      // モバイル画面幅
      maxWidth: {
        mobile: "768px",
      },
    },
  },
  plugins: [],
};

export default config;
