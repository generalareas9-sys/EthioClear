// vite.config.js
// Vite build/dev-server configuration for the EthioClear frontend.
// Keep the frontend on a stable local port that avoids conflicts with
// other services that may already be using 5173.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4173,
    strictPort: true,
  },
});
