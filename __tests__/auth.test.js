import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { SignInForm } from "../components/auth/sign-in-form"

// Mock the server action
jest.mock("../app/actions", () => ({
  signIn: jest.fn(() => Promise.resolve({ success: true })),
}))

describe("SignInForm Component", () => {
  it("renders the sign in form correctly", () => {
    render(<SignInForm />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()
  })

  it("validates form inputs", async () => {
    render(<SignInForm />)

    const submitButton = screen.getByRole("button", { name: /sign in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })
})
