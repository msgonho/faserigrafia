import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tinta: "#12131A",
        papel: "#F3F2EE",
        magenta: "#E5007E",
        ciano: "#00A3E0",
        amarelo: "#FFD200",
        grafite: "#5B5F68",
        linha: "#DEDCD6",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: { none: "0", sm: "2px", DEFAULT: "3px" },
    },
  },
  plugins: [],
} satisfies Config;
