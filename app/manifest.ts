import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "りゅにゅうプランナー",
    short_name: "りゅにゅう",
    description: "赤ちゃんの離乳食をもっとかんたんに",
    start_url: "/home",
    display: "standalone",
    background_color: "#f7fbf7",
    theme_color: "#388e3c",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
