import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#151412",
          800: "#38342e",
          650: "#575047",
          600: "#686158"
        },
        paper: {
          50: "#fbfaf7",
          100: "#f4f0e8",
          150: "#eee7dc",
          200: "#e1d5c4",
          300: "#cdbda7"
        },
        seal: {
          700: "#8b2f2b",
          600: "#a53d38",
          100: "#f5e4e1"
        },
        moss: {
          700: "#33564b",
          100: "#e4eee9"
        },
        bluegrey: {
          700: "#3d5366",
          100: "#e7eef3"
        },
        gold: {
          700: "#8b6a2f",
          100: "#f3ead7"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 18px 45px rgba(33, 28, 22, 0.08)",
        editorial: "0 24px 80px rgba(21, 20, 18, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
