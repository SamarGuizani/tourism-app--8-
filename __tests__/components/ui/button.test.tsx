"use client"

import { render, screen, fireEvent } from "@testing-library/react"
import { Button } from "@/components/ui/button"

describe("Button Component", () => {
  it("renders with default styling", () => {
    render(<Button>Click Me</Button>)

    const button = screen.getByRole("button", { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass("inline-flex")
  })

  it("handles click events", () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click Me</Button>)

    const button = screen.getByRole("button", { name: /click me/i })
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("can be disabled", () => {
    render(<Button disabled>Disabled Button</Button>)

    const button = screen.getByRole("button", { name: /disabled button/i })
    expect(button).toBeDisabled()
  })

  it("renders with different variants", () => {
    render(
      <>
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </>,
    )

    expect(screen.getByText("Default")).toHaveClass("bg-primary")
    expect(screen.getByText("Destructive")).toHaveClass("bg-destructive")
    expect(screen.getByText("Outline")).toHaveClass("border")
    expect(screen.getByText("Secondary")).toHaveClass("bg-secondary")
    expect(screen.getByText("Ghost")).toHaveClass("hover:bg-accent")
    expect(screen.getByText("Link")).toHaveClass("text-primary")
  })
})
