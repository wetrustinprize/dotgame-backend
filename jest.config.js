/* eslint-disable @typescript-eslint/no-var-requires */

const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  collectCoverageFrom: ['**/*.(t|j)s'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testRegex: '.*\\.spec\\.ts$',
  rootDir: './src',
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
};
