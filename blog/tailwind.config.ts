import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: "var(--foreground)",
            a: {
              color: "#C9A8FF",
              "&:hover": {
                color: "#FF85B3",
              },
              textDecoration: "none",
            },
            blockquote: {
              fontStyle: "italic",
              color: "#C9A8FF",
              borderLeftColor: "#FF85B3",
              paddingLeft: "1rem",
            },
            h1: { color: "#FF4D94" },
            h2: { color: "#FF85B3" },
            h3: { color: "#C9A8FF" },
            h4: { color: "#A8D8FF" },
            p: { color: "var(--foreground)" },
            strong: { color: "#FF85B3" },
            // Inline code only — let shiki own pre > code
            ":not(pre) > code": {
              color: "#C9A8FF",
              backgroundColor: "rgba(201, 168, 255, 0.1)",
              borderRadius: "4px",
              padding: "0.15em 0.35em",
              fontWeight: "400",
              "&::before": { content: '""' },
              "&::after": { content: '""' },
            },
            "pre > code": {
              color: "inherit",
              backgroundColor: "transparent",
              padding: "0",
              "&::before": { content: '""' },
              "&::after": { content: '""' },
            },
            pre: {
              backgroundColor: "transparent",
              padding: "0",
              margin: "0",
            },
          },
        },
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        sakura: "#FF85B3",
        "deep-pink": "#FF4D94",
        lavender: "#C9A8FF",
        bluebell: "#A8D8FF",
        mint: "#A8F0DC",
        plum: "#3D1A5C",
        primary: "#FF85B3",
        secondary: "#C9A8FF",
        accent: "#A8D8FF",
        muted: "#C9A8FF",
      },
      fontFamily: {
        fredoka: ["var(--font-fredoka)", "sans-serif"],
        nunito: ["var(--font-nunito)", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [typography],
} satisfies Config;
