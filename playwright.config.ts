import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig(
  {
    tsconfig: './tsconfig.json',

    fullyParallel: true,//if true, all the tests within a test file or suite will run in parallel
    //we cannot determine the order of files running in parallel
    retries: process.env.CI ? 2 : undefined,
    reporter: 'html',
    workers: process.env.CI ?? 10,

    testDir: './tests',

    //timeout
    globalTimeout: 30 * 60 * 60 * 1000,//30m, default none
    expect: {
      timeout: 0//default 5s
    },
    timeout: 90 * 1000,//90s, default 30s

    //common options for all tests
    use: {
      actionTimeout: 0,//default none
      navigationTimeout: 0,// default none
      baseURL: process.env.BASE_URL,
      trace: process.env.CI ? 'on-first-retry' : 'off',
      serviceWorkers: 'block',//for data intercepting
      locale: 'en-US',
      timezoneId: 'Asia/Ho_Chi_Minh',
      geolocation: { longitude: 106.660172, latitude: 10.762622 },
    },

    //project-specific config
    projects: [
      {
        name: 'chrome-desktop-project',
        testMatch: ['tests/desktop/chrome/**.ts'],
        use: devices['Desktop Chrome']
      }
    ]
  }
); 