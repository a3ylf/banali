import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // Put more specific matches first so '@' does not pre-empt '@/components/...'
      { find: '@/components', replacement: path.resolve(__dirname, './src') },
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: '@/hooks', replacement: path.resolve(__dirname, './src/hooks') },
      { find: '@/lib', replacement: path.resolve(__dirname, './src/lib') },
      { find: 'next/link', replacement: path.resolve(__dirname, './src/lib/next-link.tsx') },
      { find: 'next/navigation', replacement: path.resolve(__dirname, './src/lib/next-navigation.ts') },
      { find: 'next-themes', replacement: path.resolve(__dirname, './src/lib/theme.tsx') },
    ],
  },
})
