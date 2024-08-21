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
            maxWidth: "80ch",
            img: {
              borderRadius: "1rem",
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
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
};
