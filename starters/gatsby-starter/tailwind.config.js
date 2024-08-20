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
            maxWidth: "80ch",
            img: {
              borderRadius: "1rem",
              maxWidth: "none !important",
              maxHeight: "none !important",
              aspectRatio: "3/2",
              marginTop: "4rem !important",
              marginBottom: "4rem !important",
            },
            a: {
              color: "rgb(17, 85, 204)", // "dark cornflower blue 2" in Google Docs
            },
            h1: {
              fontSize: "3rem",
            },
            h2: {
              fontSize: "2.25rem",
            },
            h3: {
              fontSize: "1.875rem",
            },
            h4: {
              fontSize: "1.5rem",
            },
            h5: {
              fontSize: "1.25rem",
            },
            h6: {
              fontSize: "1rem",
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
