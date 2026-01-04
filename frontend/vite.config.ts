import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Aggressive minification
    minify: 'terser',
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'monaco': ['@monaco-editor/react', 'monaco-editor'],
          'aptos': ['@aptos-labs/ts-sdk', '@aptos-labs/wallet-adapter-react'],
          'ui': ['framer-motion', 'lucide-react', 'class-variance-authority'],
          'toast': ['react-hot-toast'],
        },
      },
    },
    // Larger chunk size warning
    chunkSizeWarningLimit: 500,
    // Source maps only in dev
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'react-hot-toast',
      'framer-motion',
      'lucide-react',
    ],
    exclude: ['@monaco-editor/react'],
  },
})
