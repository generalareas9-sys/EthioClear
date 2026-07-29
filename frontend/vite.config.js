// vite.config.js
// Vite build/dev-server configuration for the EthioClear frontend.
// Dev server runs on port 5173 by default, which matches the
// CLIENT_ORIGIN the backend's CORS config (Module 3) already expects.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
