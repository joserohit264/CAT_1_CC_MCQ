import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative paths let the app work on GitHub Pages project URLs as well as locally.
  base: './',
});
