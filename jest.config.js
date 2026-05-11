export default {
  testEnvironment: 'node',
  moduleFileExtensions: ['js'],
  transform: {},
  testPathIgnorePatterns: ['/node_modules/', '/tests/e2e/'],
  testMatch: ['**/tests/**/*.test.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: ['src/app.js', 'src/middleware/**/*.js', 'src/utils/**/*.js'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  verbose: true,
};
