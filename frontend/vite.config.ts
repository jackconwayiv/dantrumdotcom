import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "dantrumcom-rk",
        project: "dantrum-front",
      }),
    ],
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:8000/",
          changeOrigin: true,
          secure: false,
        },
      },
    },
    optimizeDeps: {
      exclude: ["react-icons"],
    },
    build: {
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: true, // Source map generation must be turned on
    },
    base: mode === "production" ? "/static/" : "/",
  };
});
