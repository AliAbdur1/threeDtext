import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  // publicDir: '../public', // standard way
  base: './',
  plugins: [react()],
})

