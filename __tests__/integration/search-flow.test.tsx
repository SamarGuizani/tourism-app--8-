import { render, screen, fireEvent } from "@testing-library/react"
import { SearchBar } from "@/components/search-bar"
import { useRouter } from "next/navigation"

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

describe("Search Flow Integration", () => {
  const mockRouter = {
    push: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it("should navigate to search results page with query parameter", async () => {
    render(<SearchBar />)

    // Find the search input
    const searchInput = screen.getByPlaceholderText(/search for places/i)

    // Type a search query
    fireEvent.change(searchInput, { target: { value: "Tunis" } })

    // Submit the form
    const form = screen.getByRole("search")
    fireEvent.submit(form)

    // Check if router.push was called with the correct URL
    expect(mockRouter.push).toHaveBeenCalledWith("/search?q=Tunis")
  })

  it("should not navigate when search query is empty", async () => {
    render(<SearchBar />)

    // Find the search input
    const searchInput = screen.getByPlaceholderText(/search for places/i)

    // Type an empty string
    fireEvent.change(searchInput, { target: { value: "" } })

    // Submit the form
    const form = screen.getByRole("search")
    fireEvent.submit(form)

    // Check that router.push was not called
    expect(mockRouter.push).not.toHaveBeenCalled()
  })

  it("should trim whitespace from search query", async () => {
    render(<SearchBar />)

    // Find the search input
    const searchInput = screen.getByPlaceholderText(/search for places/i)

    // Type a search query with whitespace
    fireEvent.change(searchInput, { target: { value: "  Carthage  " } })

    // Submit the form
    const form = screen.getByRole("search")
    fireEvent.submit(form)

    // Check if router.push was called with the trimmed URL
    expect(mockRouter.push).toHaveBeenCalledWith("/search?q=Carthage")
  })
})
