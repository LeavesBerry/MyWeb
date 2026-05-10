import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // 所有前端以 /api 开头的请求，都会自动转发到你的后端
      '/api': {
        target: 'http://127.0.0.1:5000', // 👉 改成你自己后端运行地址
        changeOrigin: true, // 允许跨域
      }
    }
  }
})
