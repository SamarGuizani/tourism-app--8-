import { render, screen, waitFor } from "@testing-library/react"
import { PlacesList } from "@/components/places-list"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Mock Supabase client
jest.mock("@supabase/auth-helpers-nextjs", () => ({
  createClientComponentClient: jest.fn(),
}))

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}))

describe("Supabase Data Synchronization", () => {
  let mockSupabase: any
  let realTimeChannel: any

  beforeEach(() => {
    // Setup Supabase mock with realtime capabilities
    realTimeChannel = {
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis(),
    }

    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      channel: jest.fn().mockReturnValue(realTimeChannel),
      data: [
        { id: "1", name: "Beach Resort", description: "Beautiful beach resort" },
        { id: "2", name: "Mountain Retreat", description: "Peaceful mountain getaway" },
      ],
      error: null,
    }
    ;(createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  it("subscribes to Supabase realtime changes", async () => {
    render(<PlacesList />)

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText("Beach Resort")).toBeInTheDocument()
      expect(screen.getByText("Mountain Retreat")).toBeInTheDocument()
    })

    // Verify that the component subscribed to Supabase realtime changes
    expect(mockSupabase.channel).toHaveBeenCalledWith("places-changes")
    expect(realTimeChannel.on).toHaveBeenCalledWith(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "places",
      },
      expect.any(Function),
    )
    expect(realTimeChannel.subscribe).toHaveBeenCalled()
  })

  it("updates UI when a new place is added in Supabase", async () => {
    render(<PlacesList />)

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText("Beach Resort")).toBeInTheDocument()
    })

    // Simulate a new place being added in Supabase
    const insertCallback = realTimeChannel.on.mock.calls.find((call) => call[0] === "postgres_changes")[2]

    // Call the callback with a new place
    insertCallback({
      new: { id: "3", name: "New Place", description: "Just added" },
      eventType: "INSERT",
    })

    // Check if the UI updates with the new place
    await waitFor(() => {
      expect(screen.getByText("New Place")).toBeInTheDocument()
    })
  })

  it("updates UI when a place is deleted in Supabase", async () => {
    render(<PlacesList />)

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText("Beach Resort")).toBeInTheDocument()
      expect(screen.getByText("Mountain Retreat")).toBeInTheDocument()
    })

    // Simulate a place being deleted in Supabase
    const deleteCallback = realTimeChannel.on.mock.calls.find((call) => call[0] === "postgres_changes")[2]

    // Call the callback with a deleted place
    deleteCallback({
      old: { id: "1", name: "Beach Resort" },
      eventType: "DELETE",
    })

    // Check if the UI updates by removing the deleted place
    await waitFor(() => {
      expect(screen.queryByText("Beach Resort")).not.toBeInTheDocument()
      expect(screen.getByText("Mountain Retreat")).toBeInTheDocument()
    })
  })
})
