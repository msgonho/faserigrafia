import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tinta: "#17181C",
        grafite: "#5A6070",
        cinza: "#8A90A0",
        linha: "#E3E6EC",
        fundo: "#F5F7FA",
        ciano: "#29ABE2",
        magenta: "#EC008C",
        amarelo: "#FFC20E",
        azul: "#1B75BC",
        laranja: "#F58220",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        cartao: "0 1px 2px rgba(23,24,28,.04), 0 8px 24px rgba(23,24,28,.06)",
        alto: "0 2px 4px rgba(23,24,28,.05), 0 16px 40px rgba(23,24,28,.10)",
      },
    },
  },
  plugins: [],
} satisfies Config;
