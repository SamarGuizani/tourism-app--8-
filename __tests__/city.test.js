import { render, screen } from "@testing-library/react"
import CityCard from "../components/city-card"

// Mock next/image since it's not available in the test environment
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />
  },
}))

// Mock next/link
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }) => {
    return <a href={href}>{children}</a>
  },
}))

describe("CityCard Component", () => {
  const mockCity = {
    id: "1",
    name: "Tunis",
    region: "North",
    description: "Capital city of Tunisia",
    imageUrl: "/images/tunis.jpg",
  }

  it("renders city information correctly", () => {
    render(<CityCard city={mockCity} />)

    expect(screen.getByText("Tunis")).toBeInTheDocument()
    expect(screen.getByText("North")).toBeInTheDocument()
    expect(screen.getByText("Capital city of Tunisia")).toBeInTheDocument()
    expect(screen.getByRole("img")).toHaveAttribute("alt", "Tunis")
  })

  it("links to the correct city page", () => {
    render(<CityCard city={mockCity} />)

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/cities/1")
  })
})
