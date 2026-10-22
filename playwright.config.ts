import { defineConfig, devices } from "@playwright/test"

/**
 * Smoke/E2E suite — caja negra. Alcance deliberadamente acotado (ver TESTING.md):
 * flujos críticos, no cobertura exhaustiva de cada página o combinación de filtros.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
