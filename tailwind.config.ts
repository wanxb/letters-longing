import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#101827",
          900: "#162033",
          800: "#25324a",
          650: "#526070",
          600: "#687684"
        },
        paper: {
          50: "#f7f9fc",
          100: "#eef3f7",
          150: "#e7edf3",
          200: "#d5e0ea",
          300: "#b9c9d7"
        },
        seal: {
          700: "#9a3412",
          600: "#c2410c",
          100: "#ffedd5"
        },
        moss: {
          700: "#155e75",
          100: "#dff6fb"
        },
        bluegrey: {
          700: "#315174",
          100: "#e5eef8"
        },
        gold: {
          700: "#7c3aed",
          100: "#ede9fe"
        },
        coral: {
          700: "#be123c",
          100: "#ffe4e6"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 14px 40px rgba(16, 24, 39, 0.08)",
        editorial: "0 24px 80px rgba(16, 24, 39, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
