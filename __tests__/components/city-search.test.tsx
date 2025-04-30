"use client"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { CitySearch } from "@/components/city-search"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

// Mock Supabase client
jest.mock("@supabase/auth-helpers-nextjs", () => ({
  createClientComponentClient: jest.fn(),
}))

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}))

describe("CitySearch Component", () => {
  let mockSupabase: any

  beforeEach(() => {
    // Setup Supabase mock
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      ilike: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      data: [],
      error: null,
    }
    ;(createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  it("renders the search input correctly", () => {
    render(<CitySearch />)

    const searchInput = screen.getByPlaceholderText(/search tunisian cities/i)
    expect(searchInput).toBeInTheDocument()
  })

  it("updates input value when user types", () => {
    render(<CitySearch />)

    const searchInput = screen.getByPlaceholderText(/search tunisian cities/i) as HTMLInputElement
    fireEvent.change(searchInput, { target: { value: "tunis" } })

    expect(searchInput.value).toBe("tunis")
  })

  it("displays search results when user types", async () => {
    mockSupabase.data = [{ id: "1", name: "Tunis", slug: "tunis" }]

    render(<CitySearch />)

    const searchInput = screen.getByPlaceholderText(/search tunisian cities/i) as HTMLInputElement
    fireEvent.change(searchInput, { target: { value: "tunis" } })

    await waitFor(() => {
      expect(screen.getByText("Tunis")).toBeInTheDocument()
    })
  })

  it("navigates to city page when a result is clicked", async () => {
    mockSupabase.data = [{ id: "1", name: "Tunis", slug: "tunis" }]
    const { push } = useRouter() as { push: jest.Mock }

    render(<CitySearch />)

    const searchInput = screen.getByPlaceholderText(/search tunisian cities/i) as HTMLInputElement
    fireEvent.change(searchInput, { target: { value: "tunis" } })

    await waitFor(() => {
      const link = screen.getByRole("link", { name: "Tunis" })
      fireEvent.click(link)
    })

    expect(push).toHaveBeenCalledWith("/cities/tunis")
  })
})
