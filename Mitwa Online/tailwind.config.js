/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF4D8D",
        "primary-dark": "#D63872",
        secondary: "#7C5CFC",
        "secondary-dark": "#5B3FD4",
        accent: "#FFD166",
        bg: "#FFF5FA",
        card: "#FFFFFF",
        surface: "#F8F0F6",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        muted: "#94A3B8",
        dark: "#1E1B2E",
        "dark-card": "#2A2540",
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px rgba(255, 77, 141, 0.08)",
        "card-hover": "0 8px 40px rgba(255, 77, 141, 0.18)",
        glow: "0 0 20px rgba(255, 77, 141, 0.35)",
        "glow-purple": "0 0 20px rgba(124, 92, 252, 0.35)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.12)",
        nav: "0 2px 20px rgba(0,0,0,0.08)",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #FF4D8D 0%, #7C5CFC 100%)",
        "card-gradient": "linear-gradient(135deg, #FFF5FA 0%, #F0EBFF 100%)",
        "dark-gradient": "linear-gradient(135deg, #1E1B2E 0%, #2A2540 100%)",
        "pink-gradient": "linear-gradient(135deg, #FF4D8D 0%, #FF8EC4 100%)",
        "purple-gradient": "linear-gradient(135deg, #7C5CFC 0%, #A78BFA 100%)",
        shimmer: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-up": "fadeUp 0.6s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "slide-right": "slideRight 0.3s ease-out",
        shimmer: "shimmer 1.5s infinite",
        float: "float 3s ease-in-out infinite",
        "bounce-in": "bounceIn 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)",
        "spin-slow": "spin 3s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        slideRight: {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        bounceIn: {
          "0%, 20%, 53%, 80%, 100%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.1)" },
          "60%": { transform: "scale(0.95)" },
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
