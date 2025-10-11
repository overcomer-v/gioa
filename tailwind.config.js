/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(180,200,50)",
        primary_dark: "rgb(92,102,27)",
        admin_primary: "rgb(37,22,54)"
      },
    },
  },
  plugins: [],
};
