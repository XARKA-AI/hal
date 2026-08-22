import type { OffshoreEpcProject } from "../pages/offshore-epc/content"
import type { OnshoreEpcProject } from "../pages/onshore-epc/content"
import { translatedField, translatedLines } from "./i18n-helpers"

export function resolveOffshoreOffering(
  index: number,
  image: string,
  t: (key: string) => string,
  strings: Record<string, string>,
) {
  const n = index + 1
  return {
    image,
    title: translatedField(t, strings, `offshoreEpc.offering.${n}.title`),
    detail: translatedField(t, strings, `offshoreEpc.offering.${n}.detail`),
  }
}

export function resolveOnshoreOffering(
  index: number,
  image: string,
  t: (key: string) => string,
  strings: Record<string, string>,
) {
  const n = index + 1
  return {
    image,
    title: translatedField(t, strings, `onshoreEpc.offering.${n}.title`),
    detail: translatedField(t, strings, `onshoreEpc.offering.${n}.detail`),
  }
}

export function resolveOffshoreSubcategory(
  index: number,
  t: (key: string) => string,
  strings: Record<string, string>,
): string {
  return translatedField(t, strings, `offshoreEpc.subcategory.${index + 1}`)
}

export function resolveOffshoreProject(
  project: OffshoreEpcProject,
  t: (key: string) => string,
  strings: Record<string, string>,
) {
  const base = `offshoreEpc.project.${project.id}`
  return {
    ...project,
    title: translatedField(t, strings, `${base}.title`, project.title),
    scope: translatedLines(t, strings, `${base}.scope`).length
      ? translatedLines(t, strings, `${base}.scope`)
      : project.scope,
    highlights: translatedLines(t, strings, `${base}.highlights`).length
      ? translatedLines(t, strings, `${base}.highlights`)
      : project.highlights,
    achievements: translatedLines(t, strings, `${base}.achievements`).length
      ? translatedLines(t, strings, `${base}.achievements`)
      : project.achievements,
  }
}

export function resolveOnshoreProject(
  project: OnshoreEpcProject,
  t: (key: string) => string,
  strings: Record<string, string>,
) {
  const base = `onshoreEpc.project.${project.id}`
  const stats = []
  for (let i = 1; i <= 12; i++) {
    const labelKey = `${base}.stats.${i}.label`
    const valueKey = `${base}.stats.${i}.value`
    if (!(labelKey in strings) || !(valueKey in strings)) break
    stats.push({ label: t(labelKey), value: t(valueKey) })
  }

  return {
    ...project,
    title: translatedField(t, strings, `${base}.title`, project.title),
    meta: translatedField(t, strings, `${base}.meta`, project.meta),
    scope: translatedLines(t, strings, `${base}.scope`).length
      ? translatedLines(t, strings, `${base}.scope`)
      : project.scope,
    highlights: translatedLines(t, strings, `${base}.highlights`).length
      ? translatedLines(t, strings, `${base}.highlights`)
      : project.highlights,
    achievements: translatedLines(t, strings, `${base}.achievements`).length
      ? translatedLines(t, strings, `${base}.achievements`)
      : project.achievements,
    stats: stats.length ? stats : project.stats,
  }
}
