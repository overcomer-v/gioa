/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        primary_dark: "#000000",
        admin_primary: "rgb(37,22,54)"
      },
    },
  },
  plugins: [],
};

// rgb(92,102,27)