import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr()
  ],
  test: {
    setupFiles: './src/setupTests.ts',
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.ts?(x)'],
    exclude: ['src/**/*.{test,spec}.js?(x)'],
  },
});
