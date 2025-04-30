import { fetchAttractions, fetchAttractionById, fetchAttractionsByCity } from "@/services/attractions"
import { createClientInstance } from "@/lib/supabase-client"

// Mock the Supabase client
jest.mock("@/lib/supabase-client", () => ({
  createClientInstance: jest.fn(),
}))

describe("Attractions Service", () => {
  let mockSupabase: any

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()

    // Setup mock Supabase client
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      data: null,
      error: null,
    }
    ;(createClientInstance as jest.Mock).mockReturnValue(mockSupabase)
  })

  describe("fetchAttractions", () => {
    it("should fetch all attractions successfully", async () => {
      const mockAttractions = [
        { id: "1", name: "Bardo Museum", description: "Historical museum" },
        { id: "2", name: "Carthage Ruins", description: "Ancient ruins" },
      ]

      mockSupabase.data = mockAttractions

      const result = await fetchAttractions()

      expect(mockSupabase.from).toHaveBeenCalledWith("attractions")
      expect(mockSupabase.select).toHaveBeenCalled()
      expect(result).toEqual(mockAttractions)
    })

    it("should throw an error when fetch fails", async () => {
      mockSupabase.data = null
      mockSupabase.error = { message: "Failed to fetch attractions" }

      await expect(fetchAttractions()).rejects.toThrow("Failed to fetch attractions")
    })
  })

  describe("fetchAttractionById", () => {
    it("should fetch an attraction by ID successfully", async () => {
      const mockAttraction = { id: "1", name: "Bardo Museum", description: "Historical museum" }

      mockSupabase.data = [mockAttraction]

      const result = await fetchAttractionById("1")

      expect(mockSupabase.from).toHaveBeenCalledWith("attractions")
      expect(mockSupabase.select).toHaveBeenCalled()
      expect(mockSupabase.eq).toHaveBeenCalledWith("id", "1")
      expect(result).toEqual(mockAttraction)
    })

    it("should return null when attraction is not found", async () => {
      mockSupabase.data = []

      const result = await fetchAttractionById("999")

      expect(mockSupabase.from).toHaveBeenCalledWith("attractions")
      expect(mockSupabase.select).toHaveBeenCalled()
      expect(mockSupabase.eq).toHaveBeenCalledWith("id", "999")
      expect(result).toBeNull()
    })
  })

  describe("fetchAttractionsByCity", () => {
    it("should fetch attractions by city ID successfully", async () => {
      const mockAttractions = [
        { id: "1", name: "Bardo Museum", description: "Historical museum", city_id: "city-1" },
        { id: "2", name: "Carthage Ruins", description: "Ancient ruins", city_id: "city-1" },
      ]

      mockSupabase.data = mockAttractions

      const result = await fetchAttractionsByCity("city-1")

      expect(mockSupabase.from).toHaveBeenCalledWith("attractions")
      expect(mockSupabase.select).toHaveBeenCalled()
      expect(mockSupabase.eq).toHaveBeenCalledWith("city_id", "city-1")
      expect(result).toEqual(mockAttractions)
    })

    it("should return empty array when no attractions found for city", async () => {
      mockSupabase.data = []

      const result = await fetchAttractionsByCity("city-999")

      expect(mockSupabase.from).toHaveBeenCalledWith("attractions")
      expect(mockSupabase.select).toHaveBeenCalled()
      expect(mockSupabase.eq).toHaveBeenCalledWith("city_id", "city-999")
      expect(result).toEqual([])
    })
  })
})
