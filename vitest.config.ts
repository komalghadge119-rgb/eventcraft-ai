/**
 * @fileoverview Vitest configuration for EventCraft AI.
 * Configures jsdom environment for browser API simulation and
 * enables VITEST=true environment variable for logger suppression.
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    env: {
      VITEST: 'true',
    },
    include: ['src/test/**/*.test.ts', 'src/test/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
