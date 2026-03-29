module.exports = {
  testEnvironment: "node",
  transform: {},               // no Babel transform over test source
  testMatch: ["**/tests/**/*.test.mjs"],
  collectCoverageFrom: ["src/**/*.js", "!src/**/*.test.js"],
  coverageThreshold: {
    global: { statements: 80, branches: 75, functions: 80, lines: 80 }
  },
  setupFilesAfterEnv: ["jest-canvas-mock", "jest-environment-jsdom"],
};