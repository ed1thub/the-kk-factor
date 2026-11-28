import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Forward /api calls to the local Express server, so no CORS setup is needed in development.
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
})
