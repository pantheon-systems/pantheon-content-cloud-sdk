module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
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
