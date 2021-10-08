module.exports = {
  name: 'unit-test',
  displayName: 'unit-test',
  rootDir: './',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?)$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  coverageDirectory: '<rootDir>/coverage',
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/mocks',
  ],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/src/mocks'],
  moduleNameMapper: {
    '^entities': '<rootDir>/src/entities',
    '^utilities': '<rootDir>/src/utilities',
    '^types': '<rootDir>/src/types',
  },
};
