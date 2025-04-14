import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: './src/setupTests.ts',
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.ts?(x)'],
    exclude: ['src/**/*.{test,spec}.js?(x)'],
  },
});
