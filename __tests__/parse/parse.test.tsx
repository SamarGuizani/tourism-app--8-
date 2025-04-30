import { render, screen, waitFor } from "@testing-library/react"
import ParseTest from "@/app/tests/parse/page"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Mock Supabase client
jest.mock("@supabase/auth-helpers-nextjs", () => ({
  createClientComponentClient: jest.fn(),
}))

describe("Parse Test Component", () => {
  let mockSupabase: any

  beforeEach(() => {
    // Setup Supabase mock
    mockSupabase = {
      auth: {
        getSession: jest.fn(),
      },
    }
    ;(createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  it("renders the Parse test component correctly", () => {
    render(<ParseTest />)

    expect(screen.getByText(/Parse Server Test/i)).toBeInTheDocument()
    expect(screen.getByText(/Parse Connection Status/i)).toBeInTheDocument()
    expect(screen.getByText(/Test Objects/i)).toBeInTheDocument()
  })

  it("displays an error message when Parse environment variables are not configured", async () => {
    render(<ParseTest />)

    await waitFor(() => {
      expect(screen.getByText(/Parse environment variables are not configured/i)).toBeInTheDocument()
    })
  })
})
