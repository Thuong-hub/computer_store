import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Backend Spring Boot (xem backend/src/main/resources/application.properties -> mặc định cổng 8080)
const BACKEND = process.env.BACKEND_URL || 'http://localhost:8080'

const proxy = {
  '/api': { target: BACKEND, changeOrigin: true },
  '/images': { target: BACKEND, changeOrigin: true }, // ảnh sản phẩm do backend phục vụ
}

export default defineConfig({
  plugins: [
    vue({
      template: {
        // Giữ nguyên khoảng trắng/comment của markup gốc để giao diện không lệch (inline-block, gap...)
        compilerOptions: { whitespace: 'preserve', comments: true },
      },
    }),
  ],
  server: { port: 5173, proxy },
  preview: { port: 4173, proxy },
})
