import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Button } from "@/components/ui/button"

describe("<Button />", () => {
  it("renders its children as a button by default", () => {
    render(<Button>Click me</Button>)
    const btn = screen.getByRole("button", { name: /click me/i })
    expect(btn).toBeInTheDocument()
    expect(btn.tagName).toBe("BUTTON")
    expect(btn).toHaveAttribute("data-slot", "button")
  })

  it("applies the variant + size as data attributes", () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>,
    )
    const btn = screen.getByRole("button")
    expect(btn).toHaveAttribute("data-variant", "destructive")
    expect(btn).toHaveAttribute("data-size", "lg")
  })

  it("uses the primary class chain for the default variant", () => {
    render(<Button>Primary</Button>)
    const btn = screen.getByRole("button")
    expect(btn.className).toMatch(/\bbg-primary\b/)
    expect(btn.className).toMatch(/\btext-primary-foreground\b/)
  })

  it("forwards arbitrary HTML props like disabled and aria-label", () => {
    render(
      <Button disabled aria-label="save-form">
        Save
      </Button>,
    )
    const btn = screen.getByRole("button", { name: "save-form" })
    expect(btn).toBeDisabled()
  })

  it("invokes onClick when clicked", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Tap</Button>)
    await user.click(screen.getByRole("button", { name: /tap/i }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("does not fire onClick when disabled", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Tap
      </Button>,
    )
    await user.click(screen.getByRole("button", { name: /tap/i }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it("renders as the child element when asChild is set", () => {
    render(
      <Button asChild>
        <a href="/somewhere">Link button</a>
      </Button>,
    )
    const link = screen.getByRole("link", { name: /link button/i })
    expect(link.tagName).toBe("A")
    expect(link).toHaveAttribute("href", "/somewhere")
    // Variant + size data attributes still ride along on the rendered element.
    expect(link).toHaveAttribute("data-slot", "button")
  })
})
