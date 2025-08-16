/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0ea5e9", // sky-500
          dark: "#0c4a6e"
        }
      },
      boxShadow: {
        soft: "0 10px 25px rgba(0,0,0,0.06)"
      }
    },
  },
  plugins: [],
};
