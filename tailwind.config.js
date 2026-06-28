/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        sand: { DEFAULT: "#C8A96E", light: "#E8D5A3", dark: "#8B6914" },
        ink: { DEFAULT: "#1A1208", light: "#2D1F0A", muted: "#5C4A2A" },
        parchment: { DEFAULT: "#F5EDD8" },
        ember: { DEFAULT: "#C44B2B" },
        lapis: { DEFAULT: "#1B3A6B", light: "#2E5FA3" },
      },
    },
  },
  plugins: [],
};
