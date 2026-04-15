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
          bg:      "#FAF8F5",
          surface: "#F2EDE6",
          card:    "#FFFFFF",
          border:  "#E2D9CE",
          rim:     "#C8BDB0",
          gold:    "#9A6F42",
          rose:    "#8B5E5B",
          cream:   "#1C1917",
          muted:   "#695D57",
          faint:   "#A89890",
          sage:    "#4A7C5E",
          amber:   "#8A5E25",
          red:     "#8C3E3E",
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
