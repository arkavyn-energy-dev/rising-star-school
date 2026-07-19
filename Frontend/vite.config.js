import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allows the dev server to be reached through a localtunnel.me
    // public URL for quick demos (Host header won't be localhost).
    allowedHosts: true,
  },
})
