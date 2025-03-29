import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  testMatch: ["**/tests/**/*.test.ts"],
};

export default config;
