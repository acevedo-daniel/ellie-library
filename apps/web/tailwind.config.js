/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef4ff",
          100: "#e0e9ff",
          200: "#c7d7fe",
          300: "#a7befc",
          400: "#7b9af8",
          500: "#4f73f1",
          600: "#3c5ddc",
          700: "#2f49b7",
          800: "#293f96",
          900: "#253874",
        },
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
};
