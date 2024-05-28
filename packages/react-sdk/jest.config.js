/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

const esmModules = ["react-markdown"];

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    `<rootDir>/node_modules/(?!(?:.pnpm/)?(${esmModules.join("|")})@)`,
  ],
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
  },
};
