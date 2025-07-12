import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import type { UserConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: false,
  },
  plugins: [TanStackRouterVite(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    include: ["**/__test__/**/*.test.tsx", "**/__test__/**/*.test.ts"],
    coverage: {
      provider: "istanbul",
      reporter: ["text", "lcov"],
      include: ["src/**/*.tsx", "src/**/*.ts"],
      exclude: [
        "src/App.tsx",
        "src/main.tsx",
        "src/api/methods.ts",
        "src/mock/*",
        "src/**/api/*",
        "**/*.stories.tsx",
        "**/__test__/**",
      ],
      thresholds: {
        branches: 80,
      },
    },
  },
} as UserConfig);
