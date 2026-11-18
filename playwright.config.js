import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:5175/NERV-admin-panel",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "Mobile Viewport (375x667)",
      use: {
        defaultBrowserType: "chromium",
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "Desktop Viewport (1440x900)",
      use: {
        defaultBrowserType: "chromium",
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
  webServer: {
    command: "npm run preview -- --port 5175",
    url: "http://localhost:5175/NERV-admin-panel/",
    reuseExistingServer: true,
    timeout: 15000,
  },
});
