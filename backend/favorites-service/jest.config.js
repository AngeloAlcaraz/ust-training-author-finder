module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',                      
  testRegex: 'test/.*\\.spec\\.ts$', 
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "src/main.ts",
    "src/app.module.ts",
    "src/modules/",
    '\\.dtos\\.ts$',
    '\\.schema\\.ts$',    
  ],
};
