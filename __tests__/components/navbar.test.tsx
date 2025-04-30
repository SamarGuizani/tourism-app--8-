import { render, screen } from "@testing-library/react"
import { Navbar } from "@/components/navbar"

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  usePathname: jest.fn(() => "/"),
}))

// Mock components/search-bar
jest.mock("@/components/search-bar", () => ({
  SearchBar: () => <div data-testid="search-bar">Search Bar</div>,
}))

describe("Navbar Component", () => {
  it("renders the logo and navigation links", () => {
    render(<Navbar />)

    // Check if logo exists
    expect(screen.getByText(/tunisia/i)).toBeInTheDocument()

    // Check if navigation links exist
    expect(screen.getByText(/cities/i)).toBeInTheDocument()
    expect(screen.getByText(/regions/i)).toBeInTheDocument()
    expect(screen.getByText(/attractions/i)).toBeInTheDocument()
  })

  it("includes the search bar component", () => {
    render(<Navbar />)

    // Check if search bar is rendered
    expect(screen.getByTestId("search-bar")).toBeInTheDocument()
  })
})
