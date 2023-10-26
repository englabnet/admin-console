import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:8080'
    },
  },
  base: '/admin-console',
  plugins: [react()],
})
