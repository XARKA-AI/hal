import { describe, expect, it } from "vitest"

import { cn } from "@/lib/utils"

describe("cn()", () => {
  it("joins truthy class names", () => {
    expect(cn("a", "b", "c")).toBe("a b c")
  })

  it("ignores falsy values", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b")
  })

  it("merges conflicting Tailwind classes (twMerge precedence)", () => {
    // twMerge keeps the LATER class for the same Tailwind concern.
    expect(cn("px-2", "px-4")).toBe("px-4")
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500")
  })

  it("supports conditional / array / object inputs (via clsx)", () => {
    expect(cn(["a", "b"], { c: true, d: false })).toBe("a b c")
  })

  it("returns an empty string when called with no args", () => {
    expect(cn()).toBe("")
  })
})
