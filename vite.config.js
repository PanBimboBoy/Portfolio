import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/Portfolio/',   // ← esto es lo que falta
  plugins: [tailwindcss()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
