import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  root: 'src/',
  publicDir: 'assets/static',
  base: './',
  plugins: [react()],
})
