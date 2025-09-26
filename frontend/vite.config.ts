import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { webcrypto } from 'node:crypto'

if (typeof globalThis.crypto === 'undefined') {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    configurable: true,
    writable: false
  })
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          three: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/cannon'],
          dashboard: ['zustand', 'framer-motion', 'socket.io-client']
        }
      }
    }
  }
})
