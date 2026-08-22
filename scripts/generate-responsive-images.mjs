#!/usr/bin/env node
// Generates responsive WebP variants for a directory of source photographs.
//
//   node scripts/generate-responsive-images.mjs <srcDir> <outDir> [--widths=480,768,1200,1672]
//
// Source photos handed over by the business are typically multi-megabyte PNG
// exports. Serving those directly is what makes gallery pages crawl, so every
// image is re-encoded to WebP at several widths and the page picks one via
// `srcSet`/`sizes`. Output files are named `<n>-<width>.webp`, where `<n>` is
// the source file's position after a natural sort — so `01_Foo.png` becomes
// `1-480.webp`, `1-768.webp`, and so on.
//
// Re-run this whenever the source photographs change; it overwrites in place.
import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const DEFAULT_WIDTHS = [480, 768, 1200, 1672]
const QUALITY = 80

function parseArgs(argv) {
  const positional = []
  let widths = DEFAULT_WIDTHS
  for (const arg of argv) {
    if (arg.startsWith("--widths=")) {
      widths = arg
        .slice("--widths=".length)
        .split(",")
        .map((w) => Number.parseInt(w, 10))
        .filter((w) => Number.isFinite(w) && w > 0)
    } else {
      positional.push(arg)
    }
  }
  return { srcDir: positional[0], outDir: positional[1], widths }
}

const { srcDir, outDir, widths } = parseArgs(process.argv.slice(2))

if (!srcDir || !outDir) {
  console.error("usage: generate-responsive-images.mjs <srcDir> <outDir> [--widths=480,768]")
  process.exit(1)
}

const SOURCE_EXT = /\.(png|jpe?g|tiff?|webp)$/i

const entries = (await fs.readdir(srcDir, { withFileTypes: true }))
  .filter((e) => e.isFile() && SOURCE_EXT.test(e.name))
  .map((e) => e.name)
  .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))

if (entries.length === 0) {
  console.error(`no source images found in ${srcDir}`)
  process.exit(1)
}

await fs.mkdir(outDir, { recursive: true })

let sourceBytes = 0
let outputBytes = 0
const manifest = []

for (const [i, name] of entries.entries()) {
  const srcPath = path.join(srcDir, name)
  sourceBytes += (await fs.stat(srcPath)).size

  const image = sharp(srcPath)
  const { width: srcWidth, height: srcHeight } = await image.metadata()
  const index = i + 1
  const produced = []

  for (const width of widths) {
    // Never upscale — a variant wider than the source would only add bytes.
    if (width > srcWidth) continue
    const outPath = path.join(outDir, `${index}-${width}.webp`)
    await sharp(srcPath)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(outPath)
    const bytes = (await fs.stat(outPath)).size
    outputBytes += bytes
    produced.push({ width, bytes })
  }

  manifest.push({ index, name, srcWidth, srcHeight, produced })
  const summary = produced.map((p) => `${p.width}w:${(p.bytes / 1024).toFixed(0)}KB`).join("  ")
  console.log(`${String(index).padStart(2)}. ${name}  (${srcWidth}x${srcHeight})  ->  ${summary}`)
}

const mb = (b) => (b / 1024 / 1024).toFixed(2)
console.log("")
console.log(`source:  ${entries.length} files, ${mb(sourceBytes)} MB`)
console.log(`output:  ${manifest.reduce((n, m) => n + m.produced.length, 0)} files, ${mb(outputBytes)} MB`)
const largest = Math.max(...widths)
const largestTotal = manifest.reduce(
  (n, m) => n + (m.produced.find((p) => p.width === largest)?.bytes ?? 0),
  0,
)
console.log(`largest-variant set (${largest}w): ${mb(largestTotal)} MB`)
