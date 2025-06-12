import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This is the correct way to resolve the path from the project root
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
})