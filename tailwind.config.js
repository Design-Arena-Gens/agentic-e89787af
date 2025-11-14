/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f6ff",
          100: "#dceaff",
          200: "#bad4ff",
          300: "#8ab7ff",
          400: "#5b93ff",
          500: "#376fff",
          600: "#1f4ff2",
          700: "#1740cf",
          800: "#1637a6",
          900: "#142f82"
        }
      }
    }
  },
  plugins: []
};
