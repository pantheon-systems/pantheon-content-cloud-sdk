const esmModules = ["ora", "chalk"];
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    `<rootDir>/node_modules/(?!${esmModules.join("|")})`,
  ],
};
