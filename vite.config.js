import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/numble/',
  build: {
    outDir: 'docs'
  },
  plugins: [react()]
});