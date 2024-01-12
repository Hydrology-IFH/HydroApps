export default {
  build: {
    sourcemap: true,
  },
  server: {
    proxy: {
      "/static": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/static/, ""),
      },
    },
  },
}
