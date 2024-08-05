/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `./src/pages/**/*.{js,jsx,ts,tsx}`,
    `./src/components/**/*.{js,jsx,ts,tsx}`,
    `./src/templates/**/*.{js,jsx,ts,tsx}`,
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
