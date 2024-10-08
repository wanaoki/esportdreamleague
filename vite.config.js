import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      "@solana/web3.js": "@solana/web3.js/lib/index.browser.esm.js",
    },
  },
  build: {
    rollupOptions: {
      external: ['@project-serum/borsh']
    }
  }
})