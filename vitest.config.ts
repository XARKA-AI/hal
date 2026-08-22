/// <reference types="vitest" />
import path from "path"
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

/**
 * Vitest config — kept separate from `vite.config.ts` so the Vercel build
 * isn't carrying jsdom / testing-library / coverage tooling into production
 * bundles. Reuses the React plugin and the `@/` alias from the app config so
 * tests can import source the same way the app does.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      // Exclude generated / framework / vendor surfaces from coverage so the
      // numbers reflect the code we actually own and meaningfully test.
      exclude: [
        "src/**/*.d.ts",
        "src/**/__tests__/**",
        "src/test/**",
        "src/main.tsx",
        "src/App.tsx",
        "src/components/ui/**", // shadcn-generated primitives
        "src/data/**",
        "src/pages/**",          // pages are e2e/visual territory, not unit
        "src/sections/**",
      ],
      // Coverage is informational for now — the seed suite only covers the
      // utility layer and a single primitive. Raise these once we've added
      // tests for the language context, theme provider, and navigation:
      //
      //   thresholds: { statements: 60, branches: 50, functions: 60, lines: 60 }
      thresholds: undefined,
    },
  },
})
