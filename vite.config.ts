import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves the site from /<repo-name>/. Set VITE_BASE=/ to build for a root domain.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/DPS-Prototype-Second/',
  plugins: [react()],
})
