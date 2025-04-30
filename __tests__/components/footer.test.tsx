import { render, screen } from "@testing-library/react"
import { Footer } from "@/components/footer"

describe("Footer Component", () => {
  it("renders the footer with copyright information", () => {
    render(<Footer />)

    // Check if copyright text exists
    expect(screen.getByText(/copyright/i)).toBeInTheDocument()

    // Check if the current year is displayed
    const currentYear = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument()
  })

  it("displays links to important pages", () => {
    render(<Footer />)

    // Check for common footer links
    expect(screen.getByText(/about/i)).toBeInTheDocument()
    expect(screen.getByText(/contact/i)).toBeInTheDocument()
  })
})
