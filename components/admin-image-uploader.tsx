"use client"

import { CardFooter } from "@/components/ui/card"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, CheckCircle2, Loader2, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"

interface ImageUploaderProps {
  onSuccess?: (imageUrl: string) => void
}

type ImageType = "city_hero" | "attraction" | "restaurant" | "activity" | "gallery"
type ImageTarget = { table: string; column: string; idColumn?: string; idValue?: string }

export default function AdminImageUploader({ onSuccess }: ImageUploaderProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imageType, setImageType] = useState<ImageType>("city_hero")
  const [citySlug, setCitySlug] = useState("")
  const [itemId, setItemId] = useState("")
  const [cities, setCities] = useState<Array<{ name: string; slug: string }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isLoadingCities, setIsLoadingCities] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchCities = async () => {
    try {
      setIsLoadingCities(true)
      const { data, error } = await supabase.from("cities").select("name, slug").order("name", { ascending: true })

      if (error) throw error
      if (data) setCities(data)
    } catch (error) {
      console.error("Error fetching cities:", error)
      toast({
        title: "Error",
        description: "Failed to load cities. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingCities(false)
    }
  }

  useEffect(() => {
    fetchCities()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)

      // Create a preview URL
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreview(objectUrl)

      // Auto-fill title from filename if empty
      if (!title) {
        const fileName = selectedFile.name.split(".")[0]
        setTitle(fileName.replace(/-|_/g, " "))
      }
    }
  }

  const getImageTarget = (): ImageTarget => {
    switch (imageType) {
      case "city_hero":
        return { table: "cities", column: "photo_url" }
      case "attraction":
        return { table: "attractions", column: "image_url", idColumn: "id", idValue: itemId }
      case "restaurant":
        return { table: "restaurants", column: "image_url", idColumn: "id", idValue: itemId }
      case "activity":
        return { table: "activities", column: "image_url", idColumn: "id", idValue: itemId }
      case "gallery":
        return { table: "media_galleries", column: "url" }
      default:
        return { table: "cities", column: "photo_url" }
    }
  }

  const uploadToBlob = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)

    const xhr = new XMLHttpRequest()

    // Track upload progress
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100)
        setUploadProgress(percentComplete)
      }
    })

    return new Promise((resolve, reject) => {
      xhr.open("POST", "/api/upload-blob")

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText)
          resolve(response.url)
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      }

      xhr.onerror = () => reject(new Error("Network error during upload"))

      xhr.send(formData)
    })
  }

  const saveToSupabase = async (imageUrl: string, target: ImageTarget) => {
    try {
      if (target.table === "cities") {
        if (!citySlug) throw new Error("City slug is required")

        const { error } = await supabase
          .from(target.table)
          .update({ [target.column]: imageUrl })
          .eq("slug", citySlug)

        if (error) throw error
      } else if (target.table === "media_galleries") {
        const { error } = await supabase.from(target.table).insert({
          title,
          description,
          url: imageUrl,
          type: "image",
          city_slug: citySlug,
          added_by: user?.id,
        })

        if (error) throw error
      } else {
        // For attractions, restaurants, activities
        if (!target.idColumn || !target.idValue) {
          throw new Error("Item ID is required")
        }

        const { error } = await supabase
          .from(target.table)
          .update({ [target.column]: imageUrl })
          .eq(target.idColumn, target.idValue)

        if (error) throw error

        // Also update city-specific table if it exists
        if (citySlug) {
          const formattedSlug = citySlug.replace(/-/g, "_")
          const citySpecificTable = `${target.table}_${formattedSlug}`

          // Check if table exists
          const { data: tableExists } = await supabase.rpc("table_exists", {
            table_name: citySpecificTable,
          })

          if (tableExists) {
            await supabase
              .from(citySpecificTable)
              .update({ [target.column]: imageUrl })
              .eq(target.idColumn, target.idValue)
          }
        }
      }
    } catch (error) {
      console.error("Error saving to Supabase:", error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please select a file to upload")
      return
    }

    if (imageType === "city_hero" && !citySlug) {
      setError("Please select a city")
      return
    }

    if ((imageType === "attraction" || imageType === "restaurant" || imageType === "activity") && !itemId) {
      setError("Please enter an item ID")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)
    setUploadProgress(0)

    try {
      // 1. Upload to Vercel Blob
      const imageUrl = await uploadToBlob(file)

      // 2. Save URL to Supabase
      const target = getImageTarget()
      await saveToSupabase(imageUrl, target)

      // 3. Show success message
      setSuccess("Image uploaded and saved successfully!")
      toast({
        title: "Success",
        description: "Image uploaded and saved successfully!",
      })

      // 4. Reset form
      setFile(null)
      setPreview(null)
      setTitle("")
      setDescription("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // 5. Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(imageUrl)
      }
    } catch (error) {
      console.error("Upload error:", error)
      setError(`Upload failed: ${error.message}`)
      toast({
        title: "Error",
        description: `Upload failed: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Images</CardTitle>
        <CardDescription>Upload images for cities, attractions, restaurants, and activities</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="imageType">Image Type</Label>
              <Select value={imageType} onValueChange={(value) => setImageType(value as ImageType)}>
                <SelectTrigger id="imageType">
                  <SelectValue placeholder="Select image type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="city_hero">City Hero Image</SelectItem>
                  <SelectItem value="attraction">Attraction Image</SelectItem>
                  <SelectItem value="restaurant">Restaurant Image</SelectItem>
                  <SelectItem value="activity">Activity Image</SelectItem>
                  <SelectItem value="gallery">Gallery Image</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Select value={citySlug} onValueChange={setCitySlug}>
                <SelectTrigger id="city">
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.slug} value={city.slug}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(imageType === "attraction" || imageType === "restaurant" || imageType === "activity") && (
              <div>
                <Label htmlFor="itemId">Item ID</Label>
                <Input
                  id="itemId"
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                  placeholder="Enter the ID of the item"
                />
                <p className="text-xs text-gray-500 mt-1">Enter the ID of the {imageType} you want to update</p>
              </div>
            )}

            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Image title" />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Image description"
                className="min-h-20"
              />
            </div>

            <div>
              <Label htmlFor="image">Image File</Label>
              <div className="mt-1 flex items-center">
                <Input
                  ref={fileInputRef}
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="flex-1"
                />
              </div>
            </div>

            {preview && (
              <div className="mt-4">
                <Label>Preview</Label>
                <div className="relative h-64 w-full mt-1 rounded-md overflow-hidden border">
                  <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
                </div>
              </div>
            )}

            {loading && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <p className="text-sm text-center mt-2">Uploading: {uploadProgress}%</p>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success</AlertTitle>
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={loading || !file} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
