/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */
const {defaults} = require('jest-config');
console.log("inside jest setup")
module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  // An array of file extensions your modules use
  moduleFileExtensions: [
     "js",
     "json",
     "jsx",
     "ts",
     "tsx",
     "node",
     "css",
     "csv"
   ],
  moduleDirectories: ["node_modules", "__mocks__", "src", "../node_modules", "./"],
  // A preset that is used as a base for Jest's configuration
  // The test environment that will be used for testing
  testEnvironment: "node",
  // A map from regular expressions to paths to transformers
// package.json
  moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "fileMock.js",
      "\\.(css|less)$": "styleMock.js"
  },
  transform: {
     "^.+\\.(js?)$": "babel-jest",
     "\\.(css)$": "<rootDir>/fileTransformer.js"
  },
//   An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: [ "node_modules/(?!(jest|jest-cli)/).+\\.js$" ],
};
