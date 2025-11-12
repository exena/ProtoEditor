export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/utils/setupEditorForTest.ts"],
};