"use client"
import { useState } from "react"
import type React from "react"

import { supabase } from "@/lib/supabase"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { v4 as uuidv4 } from "uuid"

type PlaceType = "attraction" | "restaurant" | "activity"

interface PlaceFormData {
  name: string
  description: string
  location: string
  address: string
  region: string
  city_name: string
  city_slug: string
  image_url: string
  google_map_link: string
  type: string
  difficulty?: string
  duration?: string
  cuisine?: string
  price_range?: string
  coordinates: {
    lat: number
    lng: number
  }
  image_gallery: string[]
  video_gallery: string[]
}

export default function AddPlaceForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [placeType, setPlaceType] = useState<PlaceType>("attraction")
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [videoUrls, setVideoUrls] = useState<string[]>([])
  const [heroImage, setHeroImage] = useState<File | null>(null)
  const [galleryImages, setGalleryImages] = useState<File[]>([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlaceFormData>()

  const addImageUrl = () => {
    setImageUrls([...imageUrls, ""])
  }

  const addVideoUrl = () => {
    setVideoUrls([...videoUrls, ""])
  }

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...imageUrls]
    newUrls[index] = value
    setImageUrls(newUrls)
  }

  const updateVideoUrl = (index: number, value: string) => {
    const newUrls = [...videoUrls]
    newUrls[index] = value
    setVideoUrls(newUrls)
  }

  const removeImageUrl = (index: number) => {
    const newUrls = [...imageUrls]
    newUrls.splice(index, 1)
    setImageUrls(newUrls)
  }

  const removeVideoUrl = (index: number) => {
    const newUrls = [...videoUrls]
    newUrls.splice(index, 1)
    setVideoUrls(newUrls)
  }

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setHeroImage(e.target.files[0])
    }
  }

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setGalleryImages([...galleryImages, ...newFiles])
    }
  }

  const removeGalleryImage = (index: number) => {
    const newImages = [...galleryImages]
    newImages.splice(index, 1)
    setGalleryImages(newImages)
  }

  const uploadImage = async (file: File, path: string) => {
    try {
      // First, check if the bucket exists and create it if it doesn't
      const { data: buckets } = await supabase.storage.listBuckets()
      const bucketName = "place-images"

      if (!buckets?.find((bucket) => bucket.name === bucketName)) {
        const { error: bucketError } = await supabase.storage.createBucket(bucketName, {
          public: true,
        })
        if (bucketError) throw new Error(`Error creating bucket: ${bucketError.message}`)
      }

      const { data, error } = await supabase.storage.from(bucketName).upload(path, file, {
        cacheControl: "3600",
        upsert: true,
      })

      if (error) throw error

      const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(path)
      return urlData.publicUrl
    } catch (error: any) {
      console.error("Error uploading image:", error)
      throw new Error(`Error uploading image: ${error.message}`)
    }
  }

  const onSubmit = async (data: PlaceFormData) => {
    try {
      setIsSubmitting(true)

      // Upload hero image if provided
      let heroImageUrl = data.image_url
      if (heroImage) {
        const fileName = `${uuidv4()}-${heroImage.name}`
        heroImageUrl = await uploadImage(heroImage, `${placeType}s/${fileName}`)
      }

      // Upload gallery images if provided
      const uploadedGalleryUrls = [...imageUrls]
      for (const image of galleryImages) {
        const fileName = `${uuidv4()}-${image.name}`
        const url = await uploadImage(image, `${placeType}s/gallery/${fileName}`)
        uploadedGalleryUrls.push(url)
      }

      // Create coordinates object
      let coordinates = { lat: 0, lng: 0 }
      if (data.google_map_link) {
        const match = data.google_map_link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
        if (match) {
          coordinates = {
            lat: Number.parseFloat(match[1]),
            lng: Number.parseFloat(match[2]),
          }
        }
      }

      // Prepare the data object
      const placeData = {
        ...data,
        image_url: heroImageUrl,
        coordinates,
        image_gallery: uploadedGalleryUrls.filter((url) => url.trim() !== ""),
        video_gallery: videoUrls.filter((url) => url.trim() !== ""),
      }

      // Select the table based on place type
      let tableName = ""
      switch (placeType) {
        case "attraction":
          tableName = "attractions"
          break
        case "restaurant":
          tableName = "restaurants"
          break
        case "activity":
          tableName = "activities"
          break
      }

      // Insert data into Supabase
      const { data: insertedData, error } = await supabase.from(tableName).insert(placeData).select()

      if (error) throw error

      toast.success("Place added successfully!")
      reset()
      setImageUrls([])
      setVideoUrls([])
      setHeroImage(null)
      setGalleryImages([])

      // Redirect to the appropriate page
      router.push(`/${placeType}s`)
    } catch (error: any) {
      console.error("Error adding place:", error)
      toast.error(`Failed to add place: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Add New Place</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Place Type</label>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setPlaceType("attraction")}
            className={`px-4 py-2 rounded-md ${placeType === "attraction" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Attraction
          </button>
          <button
            type="button"
            onClick={() => setPlaceType("restaurant")}
            className={`px-4 py-2 rounded-md ${placeType === "restaurant" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Restaurant
          </button>
          <button
            type="button"
            onClick={() => setPlaceType("activity")}
            className={`px-4 py-2 rounded-md ${placeType === "activity" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Activity
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name *</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Region *</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              {...register("region", { required: "Region is required" })}
            />
            {errors.region && <p className="text-red-500 text-sm">{errors.region.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">City Name *</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              {...register("city_name", { required: "City name is required" })}
            />
            {errors.city_name && <p className="text-red-500 text-sm">{errors.city_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">City Slug *</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              {...register("city_slug", { required: "City slug is required" })}
            />
            {errors.city_slug && <p className="text-red-500 text-sm">{errors.city_slug.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location *</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              {...register("location", { required: "Location is required" })}
            />
            {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Address *</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Google Maps Link *</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="https://maps.google.com/?q=..."
              {...register("google_map_link", {
                required: "Google Maps link is required",
              })}
            />
            {errors.google_map_link && <p className="text-red-500 text-sm">{errors.google_map_link.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Main Image URL</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Leave empty to upload an image file"
              {...register("image_url")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Upload Hero Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleHeroImageChange}
              className="w-full p-2 border rounded-md"
            />
            {heroImage && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Selected: {heroImage.name}</p>
              </div>
            )}
          </div>

          {placeType === "activity" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty</label>
                <select className="w-full p-2 border rounded-md" {...register("difficulty")}>
                  <option value="">Select difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Challenging">Challenging</option>
                  <option value="Difficult">Difficult</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="2 hours, Half day, etc."
                  {...register("duration")}
                />
              </div>
            </>
          )}

          {placeType === "restaurant" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Cuisine</label>
                <input type="text" className="w-full p-2 border rounded-md" {...register("cuisine")} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <select className="w-full p-2 border rounded-md" {...register("price_range")}>
                  <option value="">Select price range</option>
                  <option value="$">$ (Budget)</option>
                  <option value="$$">$$ (Mid-range)</option>
                  <option value="$$$">$$$ (High-end)</option>
                  <option value="$$$$">$$$$ (Luxury)</option>
                </select>
              </div>
            </>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description *</label>
          <textarea
            rows={4}
            className="w-full p-2 border rounded-md"
            {...register("description", { required: "Description is required" })}
          ></textarea>
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Upload Gallery Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryImagesChange}
            className="w-full p-2 border rounded-md"
          />
          {galleryImages.length > 0 && (
            <div className="mt-2 space-y-2">
              <p className="text-sm text-gray-600">Selected images:</p>
              <div className="flex flex-wrap gap-2">
                {galleryImages.map((image, index) => (
                  <div key={index} className="relative">
                    <div className="text-xs text-gray-600 truncate max-w-[150px]">{image.name}</div>
                    <button type="button" onClick={() => removeGalleryImage(index)} className="text-red-500 text-xs">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image Gallery URLs</label>
          {imageUrls.map((url, index) => (
            <div key={index} className="flex mb-2 space-x-2">
              <input
                type="text"
                value={url}
                onChange={(e) => updateImageUrl(index, e.target.value)}
                placeholder="Image URL"
                className="flex-1 p-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() => removeImageUrl(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-md"
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addImageUrl} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Add Image URL
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Video Gallery</label>
          {videoUrls.map((url, index) => (
            <div key={index} className="flex mb-2 space-x-2">
              <input
                type="text"
                value={url}
                onChange={(e) => updateVideoUrl(index, e.target.value)}
                placeholder="Video URL"
                className="flex-1 p-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() => removeVideoUrl(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-md"
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addVideoUrl} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Add Video URL
          </button>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSubmitting ? "Submitting..." : `Add ${placeType.charAt(0).toUpperCase() + placeType.slice(1)}`}
          </button>
        </div>
      </form>
    </div>
  )
}
