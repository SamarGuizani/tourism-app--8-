import { getPublicUrl, uploadImage, deleteImage } from "@/utils/blob-url"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { describe, beforeEach, it, expect, jest } from "@jest/globals"

// Mock Supabase client
jest.mock("@supabase/auth-helpers-nextjs", () => ({
  createClientComponentClient: jest.fn(),
}))

describe("Blob URL Utilities", () => {
  let mockSupabase: any

  beforeEach(() => {
    // Setup Supabase mock
    mockSupabase = {
      storage: {
        from: jest.fn().mockReturnThis(),
        upload: jest.fn().mockReturnThis(),
        remove: jest.fn().mockReturnThis(),
        getPublicUrl: jest.fn(),
      },
      data: null,
      error: null,
    }
    ;(createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  describe("getPublicUrl", () => {
    it("returns the public URL for a blob path", () => {
      const mockPublicUrl = "https://example.com/storage/v1/object/public/place-images/image.jpg"

      mockSupabase.storage.from().getPublicUrl.mockReturnValue({
        data: { publicUrl: mockPublicUrl },
      })

      const result = getPublicUrl("place-images", "image.jpg")

      expect(mockSupabase.storage.from).toHaveBeenCalledWith("place-images")
      expect(mockSupabase.storage.from().getPublicUrl).toHaveBeenCalledWith("image.jpg")
      expect(result).toBe(mockPublicUrl)
    })
  })

  describe("uploadImage", () => {
    it("uploads an image to Supabase storage", async () => {
      const mockFile = new File(["dummy content"], "image.jpg", { type: "image/jpeg" })
      const mockPublicUrl = "https://example.com/storage/v1/object/public/place-images/image.jpg"

      mockSupabase.storage.from().upload.mockReturnValue({
        data: { path: "image.jpg" },
        error: null,
      })

      mockSupabase.storage.from().getPublicUrl.mockReturnValue({
        data: { publicUrl: mockPublicUrl },
      })

      const result = await uploadImage("place-images", mockFile, "image.jpg")

      expect(mockSupabase.storage.from).toHaveBeenCalledWith("place-images")
      expect(mockSupabase.storage.from().upload).toHaveBeenCalledWith("image.jpg", mockFile, {
        cacheControl: "3600",
        upsert: true,
      })
      expect(result).toBe(mockPublicUrl)
    })

    it("throws an error when upload fails", async () => {
      const mockFile = new File(["dummy content"], "image.jpg", { type: "image/jpeg" })

      mockSupabase.storage.from().upload.mockReturnValue({
        data: null,
        error: { message: "Upload failed" },
      })

      await expect(uploadImage("place-images", mockFile, "image.jpg")).rejects.toThrow("Upload failed")

      expect(mockSupabase.storage.from).toHaveBeenCalledWith("place-images")
      expect(mockSupabase.storage.from().upload).toHaveBeenCalledWith("image.jpg", mockFile, {
        cacheControl: "3600",
        upsert: true,
      })
    })
  })

  describe("deleteImage", () => {
    it("deletes an image from Supabase storage", async () => {
      mockSupabase.storage.from().remove.mockReturnValue({
        data: { path: "image.jpg" },
        error: null,
      })

      await deleteImage("place-images", "image.jpg")

      expect(mockSupabase.storage.from).toHaveBeenCalledWith("place-images")
      expect(mockSupabase.storage.from().remove).toHaveBeenCalledWith(["image.jpg"])
    })

    it("throws an error when deletion fails", async () => {
      mockSupabase.storage.from().remove.mockReturnValue({
        data: null,
        error: { message: "Deletion failed" },
      })

      await expect(deleteImage("place-images", "image.jpg")).rejects.toThrow("Deletion failed")

      expect(mockSupabase.storage.from).toHaveBeenCalledWith("place-images")
      expect(mockSupabase.storage.from().remove).toHaveBeenCalledWith(["image.jpg"])
    })
  })
})
