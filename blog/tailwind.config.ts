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
            color: "var(--foreground)", // Use the foreground color from :root
            a: {
              color: "#6089E9CF", // Purple for links
              "&:hover": {
                color: "#3B63A6", // Darker purple on hover
              },
              textDecoration: "underline", // Added underlining for better hover effect
            },
            blockquote: {
              fontStyle: "italic",
              color: "#4A4A4A", // Softer gray for readability
              borderLeftColor: "#D1E1E8", // Lighter border for subtle distinction
              paddingLeft: "1rem", // Added padding for blockquote indentation
            },
            h1: {
              color: "var(--foreground)", // Ensure header is in the foreground color
            },
            h2: {
              color: "var(--foreground)", // Ensure header is in the foreground color
            },
            h3: {
              color: "var(--foreground)", // Ensure header is in the foreground color
            },
            h4: {
              color: "var(--foreground)", // Ensure header is in the foreground color
            },
            p: {
              color: "var(--foreground)", // Ensure paragraph text color matches the foreground
            },
          },
        },
      },
      colors: {
        background: "var(--background)", // Use the background color from :root
        foreground: "var(--foreground)", // Use the foreground color from :root
        primary: "#6089E9CF", // Purple for primary links
        secondary: "#F0F4F8", // Subtle secondary background color
        accent: "#F4F7FC", // Accent background color
        muted: "#9E9E9E", // Muted text color for less important content
        border: "#E0E0E0", // Light border color for subtle separation
      },
    },
  },
  plugins: [typography],
} satisfies Config;
