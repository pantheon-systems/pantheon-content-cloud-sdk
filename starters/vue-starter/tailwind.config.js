/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.js",
    "./app.vue",
  ],
  theme: {
    extend: {
      typography: () => ({
        DEFAULT: {
          css: {
            a: {
              color: "rgb(17, 85, 204)", // "dark cornflower blue 2" in Google Docs
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
