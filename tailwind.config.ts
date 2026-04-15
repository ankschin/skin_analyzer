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
        skin: {
          bg:      "#0A0908",
          surface: "#141210",
          card:    "#1C1917",
          border:  "#2C2825",
          rim:     "#3A3530",
          gold:    "#C9A96E",
          rose:    "#B87A72",
          cream:   "#EDE8E3",
          muted:   "#8A7E78",
          faint:   "#4A4240",
          sage:    "#7DAF8F",
          amber:   "#C4935A",
          red:     "#B87070",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body:    ["var(--font-body)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scan-beam": {
          "0%":   { transform: "translateY(-4px)", opacity: "0" },
          "5%":   { opacity: "1" },
          "95%":  { opacity: "1" },
          "100%": { transform: "translateY(900px)", opacity: "0" },
        },
        "spin-slow": {
          "0%":   { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-rev": {
          "0%":   { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(-360deg)" },
        },
        "pulse-gold": {
          "0%, 100%": { opacity: "0.15", transform: "scale(1)" },
          "50%":      { opacity: "0.4",  transform: "scale(1.08)" },
        },
      },
      animation: {
        "fade-up":   "fade-up 0.7s ease forwards",
        "scan-beam": "scan-beam 2.6s ease-in-out infinite",
        "spin-slow": "spin-slow 2.8s linear infinite",
        "spin-rev":  "spin-rev 2s linear infinite",
        "pulse-gold":"pulse-gold 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
