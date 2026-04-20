import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content:   ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background:    "#FAFAF7",
        surface:       "#F4F3EE",
        border:        "#E8E6DF",
        "text-primary":   "#1C1C1A",
        "text-secondary": "#6B6860",
        "text-muted":     "#9C9A93",
        accent:        "#C9A84C",
        "accent-hover":   "#B8962E",
        "accent-subtle":  "#F5EDD6",
        success:       "#2D6A4F",
        warning:       "#B5580A",
        danger:        "#8B1A1A",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans:    ["Inter", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        xl:   "12px",
        "2xl": "16px",
      },
      animation: {
        "fade-up":    "fadeUp 0.5s ease forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config