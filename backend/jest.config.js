/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/database/',
    '/src/entities/',
  ],
  setupFiles: ['./src/utils/env.ts'],
};
