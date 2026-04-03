/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0A2540",
        primary_dark: "rgb(92,102,27)",
        admin_primary: "rgb(37,22,54)"
      },
    },
  },
  plugins: [],
};
