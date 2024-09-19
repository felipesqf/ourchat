module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/test/utils/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};