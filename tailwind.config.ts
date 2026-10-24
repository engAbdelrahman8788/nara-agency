import type { Config } from "tailwindcss";

// The visual system uses fine-grained alpha values (e.g. text-white/22).
// Register the full 0–100 scale so every opacity modifier resolves.
const opacityScale = Object.fromEntries(
  Array.from({ length: 101 }, (_, value) => [value, (value / 100).toString()]),
);

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      opacity: opacityScale,
      colors: {
        canvas: "#070709",
        surface: {
          DEFAULT: "#0F121C",
          soft: "#121622",
          raised: "#161B2A",
        },
        electric: {
          DEFAULT: "#004BFF",
          hover: "#2563EB",
          soft: "#4D7DFF",
          pale: "#A9C0FF",
          ink: "#061126",
        },
        mist: "#94A3B8",
        muted: "#64748B",
        hairline: "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3.1rem, 7.2vw, 7.5rem)", { lineHeight: "0.94", letterSpacing: "-0.055em" }],
        "display-lg": ["clamp(2.6rem, 5vw, 5.2rem)", { lineHeight: "0.98", letterSpacing: "-0.045em" }],
        "display-md": ["clamp(2.15rem, 3.7vw, 3.75rem)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        "display-sm": ["clamp(1.8rem, 2.6vw, 2.65rem)", { lineHeight: "1.08", letterSpacing: "-0.03em" }],
      },
      boxShadow: {
        "glow-sm": "0 0 28px rgba(0, 75, 255, 0.2)",
        glow: "0 0 70px rgba(0, 75, 255, 0.25)",
        "glow-lg": "0 0 140px rgba(0, 75, 255, 0.3)",
        card: "inset 0 1px 0 rgba(255,255,255,0.035), 0 24px 60px -32px rgba(0,0,0,0.9)",
        float: "0 32px 80px -24px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)",
      },
      backgroundImage: {
        "radial-blue": "radial-gradient(circle at center, rgba(0,75,255,0.22), transparent 68%)",
        "radial-white": "radial-gradient(circle at center, rgba(255,255,255,0.07), transparent 65%)",
        "accent-sheen": "linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.14) 45%, transparent 70%)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "float-delayed": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.06)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(220%)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.97) translateY(8px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "draw-line": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        ticker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        "marquee-fast": "marquee 24s linear infinite",
        float: "float 7s ease-in-out infinite",
        "float-delayed": "float-delayed 8.5s ease-in-out infinite",
        "pulse-glow": "pulse-glow 6s ease-in-out infinite",
        shimmer: "shimmer 3.2s ease-in-out infinite",
        "fade-in": "fade-in 0.6s ease-out both",
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "scale-in": "scale-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both",
        "draw-line": "draw-line 1.8s cubic-bezier(0.22, 1, 0.36, 1) both",
        ticker: "ticker 2.4s ease-in-out infinite",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      maxWidth: {
        "8xl": "90rem",
      },
    },
  },
  plugins: [],
};

export default config;
