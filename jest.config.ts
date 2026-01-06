/** @jest-config-loader ts-node */
/** @jest-config-loader-options {"transpileOnly": true} */

import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jsdom",

  extensionsToTreatAsEsm: [".ts", ".tsx"],

  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.app.json",
        useESM: true,
        isolatedModules: true,
      },
    ],
  },

  setupFilesAfterEnv: ["<rootDir>/src/test/setupTests.ts"],
  testMatch: ["<rootDir>/src/**/*.test.(ts|tsx)"],

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};

export default config;
