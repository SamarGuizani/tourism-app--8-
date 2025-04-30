import { fetchActivities, fetchActivityById } from "@/services/activities"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { describe, beforeEach, it, expect, jest } from "@jest/globals"

// Mock Supabase client
jest.mock("@supabase/auth-helpers-nextjs", () => ({
  createClientComponentClient: jest.fn(),
}))

describe("Activities Service", () => {
  let mockSupabase: any

  beforeEach(() => {
    // Setup Supabase mock
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      match: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      data: null,
      error: null,
    }
    ;(createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  describe("fetchActivities", () => {
    it("fetches all activities successfully", async () => {
      const mockActivities = [
        { id: "1", name: "Scuba Diving", description: "Underwater adventure" },
        { id: "2", name: "Hiking", description: "Mountain trail hiking" },
      ]

      mockSupabase.data = mockActivities

      const result = await fetchActivities()

      expect(mockSupabase.from).toHaveBeenCalledWith("activities")
      expect(mockSupabase.select).toHaveBeenCalled()
      expect(result).toEqual(mockActivities)
    })

    it("handles errors when fetching activities fails", async () => {
      mockSupabase.data = null
      mockSupabase.error = { message: "Failed to fetch activities" }

      await expect(fetchActivities()).rejects.toThrow("Failed to fetch activities")

      expect(mockSupabase.from).toHaveBeenCalledWith("activities")
      expect(mockSupabase.select).toHaveBeenCalled()
    })
  })

  describe("fetchActivityById", () => {
    it("fetches an activity by ID successfully", async () => {
      const mockActivity = { id: "1", name: "Scuba Diving", description: "Underwater adventure" }

      mockSupabase.data = [mockActivity]

      const result = await fetchActivityById("1")

      expect(mockSupabase.from).toHaveBeenCalledWith("activities")
      expect(mockSupabase.select).toHaveBeenCalled()
      expect(mockSupabase.eq).toHaveBeenCalledWith("id", "1")
      expect(result).toEqual(mockActivity)
    })

    it("returns null when activity is not found", async () => {
      mockSupabase.data = []

      const result = await fetchActivityById("999")

      expect(mockSupabase.from).toHaveBeenCalledWith("activities")
      expect(mockSupabase.select).toHaveBeenCalled()
      expect(mockSupabase.eq).toHaveBeenCalledWith("id", "999")
      expect(result).toBeNull()
    })
  })
})
