import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: env.VITE_BASE_URL ?? '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) return 'react-vendor'
            if (id.includes('@tanstack/react-query')) return 'query'
            if (id.includes('zod') || id.includes('date-fns') || id.includes('dompurify')) return 'utils'
          },
        },
      },
    },
  }
})
