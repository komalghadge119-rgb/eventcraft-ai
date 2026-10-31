/**
 * @fileoverview Vite build configuration for EventCraft AI.
 * Implements Rollup manual chunking for sub-second initial paint via
 * vendor bundle splitting (vendor-react, vendor-icons, vendor-fx).
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        /**
         * Manual chunk splitting for optimal browser caching and sub-second TTI.
         * Separates framework, icon library, and effects into independent cached bundles.
         * @param {string} id - Module identifier path.
         * @returns {string | undefined} Chunk name or undefined for default chunking.
         */
        manualChunks(id: string): string | undefined {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          if (id.includes('node_modules/canvas-confetti')) {
            return 'vendor-fx';
          }
          return undefined;
        },
      },
    },
  },
});
