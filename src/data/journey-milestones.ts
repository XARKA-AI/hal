/** Shared 2004–Today journey (Aniket / About page). Used on home and About. */
export const JOURNEY_MILESTONES = [
  { id: "m1" },
  { id: "m2" },
  { id: "m3" },
  { id: "m4" },
  { id: "m5" },
  { id: "m6", listKeys: ["item1", "item2", "item3", "item4"] as const },
  { id: "m7", extraBody: true },
  { id: "m8" },
  { id: "m9" },
  { id: "m10", hideTitle: true },
] as const
