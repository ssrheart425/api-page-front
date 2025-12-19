import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/front', // 根路径
  plugins: [vue()],
  envPrefix: ['VITE_', 'API_', 'FBQ'],
})
