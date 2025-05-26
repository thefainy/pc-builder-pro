import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Добавляем поддержку process.env для совместимости
    'process.env': {}
  },
  server: {
    port: 5173,
    open: true
  },
  build: {
    sourcemap: true
  }
})