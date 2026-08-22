#!/usr/bin/env node
// Corrects colour cast and flat tone on site photographs.
//
//   node scripts/enhance-photos.mjs <outDir> <file...>
//
// Some handover photos — the BCPB-2 platform set especially — were shot under
// warm deck lighting on yellow-painted steel, leaving a heavy orange cast: the
// blue channel averages less than half the red, where a neutral photo sits near
// 1.0. They also read flat next to the rest of the gallery. This measures each
// image and corrects it individually rather than applying one fixed recipe.
//
// Deliberately conservative: an offshore platform really is yellow under warm
// light, so pulling all the way to neutral would look grey and fake. The targets
// below leave the scene warm, just not muddy. Output keeps the source filename
// and pixel dimensions, so no page code needs to change.
import path from "node:path"
import sharp from "sharp"

// This script is normally pointed at the directory it reads from, overwriting in
// place. libvips caches by filename, so without this the verification read after
// the write reports the pre-write statistics and every image looks unchanged.
sharp.cache(false)

// A neutral photo has these channel ratios at 1.0. Staying under that keeps the
// warmth of the original scene.
const TARGET_BLUE_OVER_RED = 0.9
const TARGET_GREEN_OVER_RED = 0.96
// Caps how far a single channel can be lifted, so a severely cast photo is
// improved rather than pushed into false colour with clipped highlights.
const MAX_CHANNEL_GAIN = 1.75
/** Median luminance of the well-exposed photos elsewhere in the gallery. */
const TARGET_MEDIAN_LUMA = 102
const CONTRAST = 1.06
const WEBP_QUALITY = 84

const [outDir, ...files] = process.argv.slice(2)

if (!outDir || files.length === 0) {
  console.error("usage: enhance-photos.mjs <outDir> <file...>")
  process.exit(1)
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

async function medianLuma(image) {
  const raw = await image.clone().greyscale().raw().toBuffer()
  const hist = new Array(256).fill(0)
  for (const v of raw) hist[v]++
  let cumulative = 0
  for (let i = 0; i < 256; i++) {
    cumulative += hist[i]
    if (cumulative >= raw.length / 2) return i
  }
  return 255
}

for (const file of files) {
  const stats = await sharp(file).stats()
  const [r, g, b] = stats.channels

  const greenGain = clamp((TARGET_GREEN_OVER_RED * r.mean) / g.mean, 1, MAX_CHANNEL_GAIN)
  const blueGain = clamp((TARGET_BLUE_OVER_RED * r.mean) / b.mean, 1, MAX_CHANNEL_GAIN)

  // Balance first, then measure again: lifting green and blue also raises
  // luminance, so the tone correction has to be based on the balanced image.
  const balanced = sharp(file).linear([1, greenGain, blueGain], [0, 0, 0])
  const balancedBuffer = await balanced.png().toBuffer()
  const median = await medianLuma(sharp(balancedBuffer))

  // Gamma-shaped lift: brightens midtones while leaving black and white fixed,
  // unlike a straight multiply which would blow out the highlights. sharp's
  // second gamma argument sets the re-encode exponent, so the net curve is
  // `gamma / gammaOut`.
  const exponent = Math.log(TARGET_MEDIAN_LUMA / 255) / Math.log(clamp(median, 1, 254) / 255)
  const gammaOut = clamp(2.2 / exponent, 1.0, 3.0)

  const outPath = path.join(outDir, path.basename(file))
  await sharp(balancedBuffer)
    .gamma(2.2, gammaOut)
    .linear(CONTRAST, -(CONTRAST - 1) * 128)
    .sharpen({ sigma: 0.8, m1: 0.4, m2: 1.6 })
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toFile(outPath)

  const after = await sharp(outPath).stats()
  const [ar, ag, ab] = after.channels
  console.log(
    `${path.basename(file).padEnd(10)} B/R ${(b.mean / r.mean).toFixed(2)} -> ${(ab.mean / ar.mean).toFixed(2)}` +
      `   G/R ${(g.mean / r.mean).toFixed(2)} -> ${(ag.mean / ar.mean).toFixed(2)}` +
      `   median ${median} -> ${await medianLuma(sharp(outPath))}` +
      `   gains G${greenGain.toFixed(2)} B${blueGain.toFixed(2)} gammaOut ${gammaOut.toFixed(2)}`,
  )
}
