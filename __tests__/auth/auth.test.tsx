import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { SignIn } from "@/components/auth/sign-in"
import { SignUp } from "@/components/auth/sign-up"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Mock Supabase client
jest.mock("@supabase/auth-helpers-nextjs", () => ({
  createClientComponentClient: jest.fn(),
}))

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

describe("Authentication Components", () => {
  let mockSupabase: any

  beforeEach(() => {
    // Setup Supabase mock
    mockSupabase = {
      auth: {
        signInWithPassword: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
      },
    }
    ;(createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  describe("SignIn Component", () => {
    it("renders the sign in form correctly", () => {
      render(<SignIn />)

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()
    })

    it("calls signInWithPassword when form is submitted with valid data", async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: "123" } },
        error: null,
      })

      render(<SignIn />)

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "test@example.com" },
      })

      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "password123" },
      })

      fireEvent.click(screen.getByRole("button", { name: /sign in/i }))

      await waitFor(() => {
        expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
        })
      })
    })

    it("displays error message when sign in fails", async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: "Invalid login credentials" },
      })

      render(<SignIn />)

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "test@example.com" },
      })

      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "wrongpassword" },
      })

      fireEvent.click(screen.getByRole("button", { name: /sign in/i }))

      await waitFor(() => {
        expect(screen.getByText(/invalid login credentials/i)).toBeInTheDocument()
      })
    })
  })

  describe("SignUp Component", () => {
    it("renders the sign up form correctly", () => {
      render(<SignUp />)

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument()
    })

    it("calls signUp when form is submitted with valid data", async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: { id: "123" } },
        error: null,
      })

      render(<SignUp />)

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "newuser@example.com" },
      })

      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "password123" },
      })

      fireEvent.click(screen.getByRole("button", { name: /sign up/i }))

      await waitFor(() => {
        expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
          email: "newuser@example.com",
          password: "password123",
        })
      })
    })
  })
})
