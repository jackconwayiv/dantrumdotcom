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
        errorHandler: (err) => {
          // In some environments (e.g. CI / sandbox) sourcemap upload can fail due
          // to network/proxy restrictions. We don't want a broken deploy build.
          console.warn("[sentry-vite-plugin] upload failed:", err?.message ?? err);
        },
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
