/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        footer: "min-content minmax(400px, 3fr) 1fr",
      },
    },
  },
  plugins: [],
};
