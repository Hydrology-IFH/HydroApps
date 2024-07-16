import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import path from 'path'

const rootDir = __dirname

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
        sri_bw: '/src/sri_bw/main.js',
        sfi_demo: '/src/sfi_demo/main.js',
      },
    },
  },
  plugins: [
    vue(),
    vuetify({ autoImport: true })
  ],
  resolve: {
    alias: [
      { find: "vue", replacement: 'vue/dist/vue.esm-bundler.js' },
      {
        find: "~~",
        replacement: "/src/common/",
      },
      {
        find: /^\~{1}/,
        replacement: '~',
        customResolver(src, importer) {
          const app_name = path.relative(rootDir, importer).split(path.sep)[1];
          return path.join(rootDir, "src", app_name, src.slice(1))
        },
      },
    ]
  },
  optimizeDeps: {
    include: ['ol', "vue"],
  },
})
