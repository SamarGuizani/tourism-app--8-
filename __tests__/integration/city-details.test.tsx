import { render, screen } from "@testing-library/react"
import CityTemplate from "@/components/city-template"

// Mock the components that make up the city page
jest.mock("@/components/city-attractions", () => ({
  __esModule: true,
  default: () => <div data-testid="city-attractions">Attractions Mock</div>,
}))

jest.mock("@/components/city-restaurants", () => ({
  __esModule: true,
  default: () => <div data-testid="city-restaurants">Restaurants Mock</div>,
}))

jest.mock("@/components/city-activities", () => ({
  __esModule: true,
  default: () => <div data-testid="city-activities">Activities Mock</div>,
}))

jest.mock("@/components/city-map", () => ({
  __esModule: true,
  default: () => <div data-testid="city-map">Map Mock</div>,
}))

describe("City Details Page Integration", () => {
  const mockCity = {
    id: "city-123",
    name: "Tunis",
    description: "The capital city of Tunisia",
    region: "North",
    image_url: "/images/tunis.jpg",
    header_image: "/images/tunis-header.jpg",
    latitude: 36.8065,
    longitude: 10.1815,
    population: 1056247,
    founded: "9th century BC",
    slug: "tunis",
  }

  it("renders all city sections correctly", async () => {
    render(<CityTemplate city={mockCity} />)

    // Check if the city name and description are displayed
    expect(screen.getByText("Tunis")).toBeInTheDocument()
    expect(screen.getByText("The capital city of Tunisia")).toBeInTheDocument()

    // Check if all the sections are rendered
    expect(screen.getByTestId("city-attractions")).toBeInTheDocument()
    expect(screen.getByTestId("city-restaurants")).toBeInTheDocument()
    expect(screen.getByTestId("city-activities")).toBeInTheDocument()
    expect(screen.getByTestId("city-map")).toBeInTheDocument()
  })

  it("displays city metadata correctly", async () => {
    render(<CityTemplate city={mockCity} />)

    // Check if population and founded date are displayed
    expect(screen.getByText(/1,056,247/)).toBeInTheDocument()
    expect(screen.getByText(/9th century BC/)).toBeInTheDocument()
  })

  it("has the correct page structure with header and sections", async () => {
    render(<CityTemplate city={mockCity} />)

    // Check for header section
    const headerSection = screen.getByRole("banner")
    expect(headerSection).toBeInTheDocument()

    // Check for main content section
    const mainContent = screen.getByRole("main")
    expect(mainContent).toBeInTheDocument()

    // Check for sections
    const sections = screen.getAllByRole("region")
    expect(sections.length).toBeGreaterThanOrEqual(3) // At least 3 sections (attractions, restaurants, activities)
  })
})
