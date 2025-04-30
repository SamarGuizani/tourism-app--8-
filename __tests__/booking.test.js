import { render, screen } from "@testing-library/react"
import BookingCard from "../components/booking-card"

describe("BookingCard Component", () => {
  const mockBooking = {
    id: "1",
    date: new Date("2023-05-15"),
    status: "confirmed",
    guide: {
      name: "Ahmed",
      expertise: "Historical Sites",
    },
    city: {
      name: "Carthage",
    },
  }

  it("renders booking information correctly", () => {
    render(<BookingCard booking={mockBooking} />)

    expect(screen.getByText(/ahmed/i)).toBeInTheDocument()
    expect(screen.getByText(/carthage/i)).toBeInTheDocument()
    expect(screen.getByText(/confirmed/i)).toBeInTheDocument()
    expect(screen.getByText(/may 15, 2023/i)).toBeInTheDocument()
  })
})
