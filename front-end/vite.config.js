import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/static/front-end/',
  build: {
    manifest: "manifest.json",
    chunkSizeWarningLimit: 800,
    watch: {
      include: 'vite.config.js',
    },
    rollupOptions: {
      input: {
        kombstra: '/src/kombstra/main.js',
        sri_bw: '/src/sri_bw/main.js'
      },
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
  optimizeDeps: {
    include: ['ol', "vue"],
  },
})
