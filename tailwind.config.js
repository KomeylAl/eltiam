/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        vazir: ["Vazir"],
        "vazir-bold": ["VazirBold"],
      },
      colors: {
        primary: {
          DEFAULT: "#469173",
          dark: "#357a5f",
          light: "#5ba88a",
          muted: "#b0c5be",
        },
        surface: "#f8faf9",
        surfaceAlt: "#eef4f1",
        text: {
          DEFAULT: "#1a2e24",
          muted: "#6b7c74",
        },
        border: "#d4e4dc",
        danger: {
          DEFAULT: "#e11d48",
          light: "#fff1f2",
        },
      },
      boxShadow: {
        card: "0 4px 14px rgba(70, 145, 115, 0.12)",
        tab: "0 8px 24px rgba(53, 122, 95, 0.28)",
      },
    },
  },
  plugins: [],
}

