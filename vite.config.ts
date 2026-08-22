import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import { controllerApiDevMiddleware } from "./server/controller-api-dev.ts"

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === "serve") {
    const env = loadEnv(mode, process.cwd(), "")
    for (const key of ["CONTROLLER_PASSWORD", "CONTROLLER_SESSION_SECRET"] as const) {
      if (env[key]) process.env[key] = env[key]
    }
  }

  return {
    base: "/",
    plugins: [
      react(),
      {
        name: "hal-controller-api-dev",
        apply: "serve",
        configureServer(server) {
          server.middlewares.use(controllerApiDevMiddleware())
        },
      },
      {
        // CSS in index.html is render-blocking (~300ms on Slow 4G). Mark it
        // `media=print` so first paint can use the inlined splash styles;
        // main.tsx flips media back to `all` as soon as JS runs. Fonts get
        // an explicit preload so they don't wait on that stylesheet.
        name: "hal-async-css",
        apply: "build",
        transformIndexHtml: {
          order: "post",
          handler(html, ctx) {
            const fonts = Object.keys(ctx.bundle ?? {}).filter((id) =>
              /poppins-latin-(400|600|700)-normal.*\.woff2$/.test(id),
            )
            const fontLinks = fonts
              .map(
                (id) =>
                  `    <link rel="preload" as="font" type="font/woff2" href="/${id}" crossorigin />`,
              )
              .join("\n")
            let next = html.replace(
              /<link rel="stylesheet"([^>]*href="[^"]+\.css"[^>]*)>/g,
              `<link rel="preload" as="style"$1 />\n    <link rel="stylesheet"$1 media="print" data-css="all" />`,
            )
            if (fontLinks) {
              next = next.replace("</title>", `</title>\n${fontLinks}`)
            }
            return next
          },
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    build: {
      modulePreload: {
        resolveDependencies(_filename, deps) {
          // App.tsx statically declares every lazy route and homepage section.
          // Vite would otherwise modulepreload the lot, recreating a ~2.8s
          // Slow-4G chain. Keep React (needed to boot) and drop the rest —
          // DeferredSection / React.lazy fetch them when they actually render.
          return deps.filter(
            (dep) =>
              dep.includes("vendor-react") || dep.includes("rolldown-runtime"),
          )
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes("node_modules/react-dom") || id.includes("node_modules/react/") || id.includes("node_modules/react-router")) {
              return "vendor-react"
            }
            if (id.includes("node_modules/framer-motion")) {
              return "vendor-framer"
            }
            if (id.includes("node_modules/three") || id.includes("node_modules/@react-three")) {
              return "vendor-three"
            }
            if (id.includes("node_modules/@radix-ui")) {
              return "vendor-radix"
            }
            if (id.includes("node_modules/recharts") || id.includes("node_modules/d3-")) {
              return "vendor-charts"
            }
          },
        },
      },
      // three + @react-three + drei + three-globe stay in one manual chunk (~1.5–2MB minified); expected for WebGL stacks
      chunkSizeWarningLimit: 2048,
    },
  }
})
