import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';
import path from 'node:path';

const authFile = path.join(__dirname, '.auth', 'user.json');

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }], ['./src/reporters/jiraReporter.ts', { outputFile: 'test-results/jira-results.json' }]],
  use: {baseURL: 'https://www.saucedemo.com', trace: 'on-first-retry', screenshot: 'only-on-failure', video: 'retain-on-failure', actionTimeout: 10_000, navigationTimeout: 20_000},
  projects: [
    {name: 'setup', testMatch: /auth\.setup\.ts/},
    {name: 'chromium', use: {...devices['Desktop Chrome'], storageState: authFile}, dependencies: ['setup'], testIgnore: /auth\.setup\.ts/},
    {name: 'firefox', use: {...devices['Desktop Firefox'], storageState: authFile}, dependencies: ['setup'], testIgnore: /auth\.setup\.ts/}
  ]
});
