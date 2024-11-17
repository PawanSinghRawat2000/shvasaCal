import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: { port: process.env.PORT || 3011 },
  plugins: [react()],
})
