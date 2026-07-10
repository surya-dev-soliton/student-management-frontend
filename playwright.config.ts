/// <reference types="node" />
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/app/tests',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },
});
