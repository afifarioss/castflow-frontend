/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0052FF",
        accent: "#00D4AA",
        purple: "#855DCD",
        background: "#0A0B0D",
        "text-secondary": "#8A919E",
      },
    },
  },
  plugins: [],
};