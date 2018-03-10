module.exports = {
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.js',
  testRegex: '(/tests/.*-test)\\.js$',
  globalSetup: './build.js',
  watchPathIgnorePatterns: ['<rootDir>/dist/'],
  moduleFileExtensions: ['js', 'jsx'],
  modulePaths: ['<rootDir>/src', '<rootDir>/node_modules'],
  moduleNameMapper: {
    '@microstates/react': '<rootDir>/dist/@microstates/react.umd.js'
  }
};
