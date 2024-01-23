import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  build: {
    sourcemap: true,
  },
  server: {
    proxy: {
      "/static": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
      "^(/de|/en)*/kombstra/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
    open: "/src/kombstra/dev-index.html",
  },
  plugins: [vue()],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
})
