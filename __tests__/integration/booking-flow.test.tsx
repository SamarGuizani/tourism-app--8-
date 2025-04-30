import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { GuideBookingForm } from "@/components/guide-booking-form"
import { useRouter } from "next/navigation"

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

// Mock the createClient function
jest.mock("@/lib/supabase-client", () => ({
  createClientInstance: jest.fn(() => ({
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          data: [{ id: "booking-123" }],
          error: null,
        })),
      })),
    })),
  })),
}))

describe("Booking Flow Integration", () => {
  const mockGuide = {
    id: "guide-123",
    name: "Ahmed",
    expertise: "Historical Sites",
    languages: ["English", "Arabic", "French"],
    hourly_rate: 50,
  }

  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it("should complete the booking process successfully", async () => {
    render(<GuideBookingForm guide={mockGuide} />)

    // Fill out the booking form
    const dateInput = screen.getByLabelText(/date/i)
    fireEvent.change(dateInput, { target: { value: "2023-12-25" } })

    const timeInput = screen.getByLabelText(/time/i)
    fireEvent.change(timeInput, { target: { value: "10:00" } })

    const hoursInput = screen.getByLabelText(/hours/i)
    fireEvent.change(hoursInput, { target: { value: "3" } })

    const notesInput = screen.getByLabelText(/notes/i)
    fireEvent.change(notesInput, { target: { value: "Interested in Roman ruins" } })

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /book now/i })
    fireEvent.click(submitButton)

    // Wait for the booking to be processed
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/booking-confirmation?id=booking-123")
    })
  })

  it("should display validation errors for missing fields", async () => {
    render(<GuideBookingForm guide={mockGuide} />)

    // Submit the form without filling any fields
    const submitButton = screen.getByRole("button", { name: /book now/i })
    fireEvent.click(submitButton)

    // Check for validation error messages
    await waitFor(() => {
      expect(screen.getByText(/date is required/i)).toBeInTheDocument()
      expect(screen.getByText(/time is required/i)).toBeInTheDocument()
      expect(screen.getByText(/hours is required/i)).toBeInTheDocument()
    })

    // Verify that the router was not called
    expect(mockRouter.push).not.toHaveBeenCalled()
  })

  it("should calculate and display the total price correctly", async () => {
    render(<GuideBookingForm guide={mockGuide} />)

    // Set hours to 4
    const hoursInput = screen.getByLabelText(/hours/i)
    fireEvent.change(hoursInput, { target: { value: "4" } })

    // Check if the total price is calculated correctly (4 hours * $50)
    await waitFor(() => {
      expect(screen.getByText(/\$200/)).toBeInTheDocument()
    })
  })
})
