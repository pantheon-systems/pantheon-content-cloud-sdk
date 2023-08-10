/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

const esmModules = ["react-markdown"];

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  transformIgnorePatterns: [
    `<rootDir>/node_modules/(?!(?:.pnpm/)?(${esmModules.join("|")})@)`,
  ],
};
