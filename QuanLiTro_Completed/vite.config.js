import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    globals: false,
    coverage: {
      provider: 'v8',
      include: ['src/logic/**/*.js'],
      reporter: ['text', 'html'],
    },
  },
})
