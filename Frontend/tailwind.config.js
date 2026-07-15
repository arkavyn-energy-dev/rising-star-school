/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF8",
        ink: {
          DEFAULT: "#1A1A1A",
          soft: "#3F3F46",
          muted: "#71717A",
        },
        primary: {
          DEFAULT: "#1A1A1A",
          light: "#3F3F46",
          dark: "#0A0A0A",
        },
        brand: {
          DEFAULT: "#9B2335",
          light: "#C43A52",
          dark: "#7B1C2A",
          glow: "#F4D0D6",
        },
        accent: {
          DEFAULT: "#2563EB",
          light: "#60A5FA",
          dark: "#1D4ED8",
          glow: "#DBEAFE",
        },
        line: "#64748B",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Poppins", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 16px -4px rgba(26,26,26,0.07)",
        lift: "0 16px 40px -12px rgba(155,35,53,0.18)",
        card: "0 4px 24px -6px rgba(26,26,26,0.08)",
        glass: "0 8px 32px 0 rgba(26,26,26,0.07)",
        glow: "0 0 0 1px rgba(155,35,53,0.08), 0 8px 24px -8px rgba(155,35,53,0.2)",
      },
      keyframes: {
        "scroll-left": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "pulse-dot": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(155,35,53,0.5)" },
          "70%": { boxShadow: "0 0 0 8px rgba(155,35,53,0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(6deg)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(15px) rotate(-8deg)" },
        },
      },
      animation: {
        "scroll-left": "scroll-left 22s linear infinite",
        "pulse-dot": "pulse-dot 2s infinite",
        float: "float 8s ease-in-out infinite",
        floatSlow: "floatSlow 11s ease-in-out infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
