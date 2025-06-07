import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://localhost",
    headless: false,
    viewport: { width: 1280, height: 720 },
  },
});
