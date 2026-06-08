import { defineConfig, devices } from '@playwright/test';

const e2ePort = process.env.PLAYWRIGHT_PORT || process.env.PORT || '3100';
const e2eBaseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${e2ePort}`;
const e2eOutputDir = process.env.PLAYWRIGHT_OUTPUT_DIR || 'test-results';

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: e2eOutputDir,
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: e2eBaseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'node src/index.js',
    url: `${e2eBaseURL}/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      PORT: e2ePort,
      NODE_ENV: 'test',
    },
  },
});
