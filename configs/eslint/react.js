/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  plugins: ["react"],
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    "./index.js",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/jsx-runtime",
    "plugin:jsx-a11y/recommended",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
};
