import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  /* Shared settings for all the projects below. */
  use: {
    baseURL: 'https://kal-sense.prod.kaleidoo-dev.com/',
    headless: false,
    /* Trace settings */
    trace: 'on-first-retry',
  },

  projects: [
    {
    name: 'setup',
    testMatch: /.*\.setup\.ts/,
  },
  {
    name: 'chromium',
    testIgnore: /.*\.setup\.ts/, 
    use: {
      ...devices['Desktop Chrome'],
      storageState: 'playwright/.auth/user.json',
    },
  },

    /* 3. API testing project (Optional but recommended) */
    {
      name: 'api',
      testMatch: /.*api\.spec\.ts/,
      use: {
        storageState: 'playwright/.auth/user.json',
      },
    },

    /* Other browsers can be added here following the same pattern as 'chromium' */
  ],
});