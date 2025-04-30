"use client"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { SearchBar } from "@/components/search-bar"
import { useRouter } from "next/navigation"

// Mock the next/navigation router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

describe("SearchBar Component", () => {
  beforeEach(() => {
    // Setup router mock
    const mockPush = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  it("renders the search input correctly", () => {
    render(<SearchBar />)

    // Check if search input exists
    const searchInput = screen.getByPlaceholderText(/search/i)
    expect(searchInput).toBeInTheDocument()
  })

  it("updates input value when user types", () => {
    render(<SearchBar />)

    const searchInput = screen.getByPlaceholderText(/search/i) as HTMLInputElement
    fireEvent.change(searchInput, { target: { value: "beach" } })

    expect(searchInput.value).toBe("beach")
  })

  it("navigates to search results page on form submission", async () => {
    const { push } = useRouter() as { push: jest.Mock }
    render(<SearchBar />)

    const searchInput = screen.getByPlaceholderText(/search/i)
    const searchForm = searchInput.closest("form")

    // Type in search query
    fireEvent.change(searchInput, { target: { value: "beach" } })

    // Submit the form
    if (searchForm) {
      fireEvent.submit(searchForm)
    }

    // Check if router.push was called with the correct path
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/search?q=beach")
    })
  })

  it("does not navigate if search query is empty", async () => {
    const { push } = useRouter() as { push: jest.Mock }
    render(<SearchBar />)

    const searchInput = screen.getByPlaceholderText(/search/i)
    const searchForm = searchInput.closest("form")

    // Submit the form without typing anything
    if (searchForm) {
      fireEvent.submit(searchForm)
    }

    // Check that router.push was not called
    expect(push).not.toHaveBeenCalled()
  })
})
