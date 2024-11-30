import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    build: { outDir: "dist", emptyOutDir: true },
    plugins: [react()],
    server: {
      open: true,
      proxy: {
        "/api": env.VITE_API_URL,
      },
      watch: {
        usePolling: env.VITE_USE_POLLING === "true",
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "src/setupTests",
      mockReset: true,
    },
  }
})
