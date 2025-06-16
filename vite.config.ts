import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
      '@shared': path.resolve(process.cwd(), 'shared'),
    },
  },
})
