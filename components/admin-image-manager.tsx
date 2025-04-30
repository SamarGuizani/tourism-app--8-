"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Trash2, RefreshCw } from "lucide-react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

type ImageCategory = "cities" | "attractions" | "restaurants" | "activities" | "gallery"

interface ImageItem {
  id: string
  name: string
  url: string
  description?: string
  type?: string
}

export default function AdminImageManager() {
  const { toast } = useToast()
  const [category, setCategory] = useState<ImageCategory>("cities")
  const [citySlug, setCitySlug] = useState<string>("")
  const [cities, setCities] = useState<Array<{ name: string; slug: string }>>([])
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchCities()
  }, [])

  useEffect(() => {
    if (category) {
      fetchImages()
    }
  }, [category, citySlug])

  const fetchCities = async () => {
    try {
      const { data, error } = await supabase.from("cities").select("name, slug").order("name", { ascending: true })

      if (error) throw error
      if (data) {
        setCities(data)
        if (data.length > 0) {
          setCitySlug(data[0].slug)
        }
      }
    } catch (error) {
      console.error("Error fetching cities:", error)
      toast({
        title: "Error",
        description: "Failed to load cities. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchImages = async () => {
    try {
      setLoading(true)
      setError(null)
      let data: ImageItem[] = []

      switch (category) {
        case "cities":
          const { data: citiesData, error: citiesError } = await supabase
            .from("cities")
            .select("id, name, photo_url, description")
            .order("name")

          if (citiesError) throw citiesError
          data = (citiesData || [])
            .filter((city) => city.photo_url)
            .map((city) => ({
              id: city.id,
              name: city.name,
              url: city.photo_url,
              description: city.description,
            }))
          break

        case "attractions":
        case "restaurants":
        case "activities":
          const filter = citySlug ? { city_slug: citySlug } : {}
          const { data: itemsData, error: itemsError } = await supabase
            .from(category)
            .select("id, name, image_url, description, type")
            .match(filter)
            .order("name")

          if (itemsError) throw itemsError
          data = (itemsData || [])
            .filter((item) => item.image_url)
            .map((item) => ({
              id: item.id,
              name: item.name,
              url: item.image_url,
              description: item.description,
              type: item.type,
            }))
          break

        case "gallery":
          const galleryFilter = citySlug ? { city_slug: citySlug } : {}
          const { data: galleryData, error: galleryError } = await supabase
            .from("media_galleries")
            .select("id, title, url, description, type")
            .match({ ...galleryFilter, type: "image" })
            .order("created_at", { ascending: false })

          if (galleryError) throw galleryError
          data = (galleryData || []).map((item) => ({
            id: item.id,
            name: item.title,
            url: item.url,
            description: item.description,
          }))
          break
      }

      setImages(data)
    } catch (error) {
      console.error(`Error fetching ${category}:`, error)
      setError(`Failed to load images. ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (image: ImageItem) => {
    setSelectedImage(image)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!selectedImage) return

    try {
      setIsDeleting(true)

      // First, determine which table and column to update
      let table: string
      let column: string

      switch (category) {
        case "cities":
          table = "cities"
          column = "photo_url"
          break
        case "attractions":
        case "restaurants":
        case "activities":
          table = category
          column = "image_url"
          break
        case "gallery":
          // For gallery, we delete the entire row
          const { error: deleteError } = await supabase.from("media_galleries").delete().eq("id", selectedImage.id)

          if (deleteError) throw deleteError

          toast({
            title: "Success",
            description: "Image deleted successfully",
          })

          setShowDeleteDialog(false)
          fetchImages()
          return
      }

      // For other categories, we set the image URL to null
      const { error: updateError } = await supabase
        .from(table)
        .update({ [column]: null })
        .eq("id", selectedImage.id)

      if (updateError) throw updateError

      // If city-specific table exists, update that too
      if (category !== "cities" && citySlug) {
        const formattedSlug = citySlug.replace(/-/g, "_")
        const citySpecificTable = `${category}_${formattedSlug}`

        // Check if table exists
        const { data: tableExists } = await supabase.rpc("table_exists", {
          table_name: citySpecificTable,
        })

        if (tableExists) {
          await supabase
            .from(citySpecificTable)
            .update({ [column]: null })
            .eq("id", selectedImage.id)
        }
      }

      toast({
        title: "Success",
        description: "Image removed successfully",
      })

      setShowDeleteDialog(false)
      fetchImages()
    } catch (error) {
      console.error("Error deleting image:", error)
      toast({
        title: "Error",
        description: `Failed to delete image: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manage Images</CardTitle>
        <CardDescription>View and manage images across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as ImageCategory)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cities">City Hero Images</SelectItem>
                  <SelectItem value="attractions">Attraction Images</SelectItem>
                  <SelectItem value="restaurants">Restaurant Images</SelectItem>
                  <SelectItem value="activities">Activity Images</SelectItem>
                  <SelectItem value="gallery">Gallery Images</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {category !== "cities" && (
              <div className="w-full md:w-1/2">
                <Label htmlFor="city">Filter by City</Label>
                <Select value={citySlug} onValueChange={setCitySlug}>
                  <SelectTrigger id="city">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city.slug} value={city.slug}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={fetchImages} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-8">Loading images...</div>
          ) : images.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No images found for this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <Card key={`${image.id}-${image.url}`} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image src={image.url || "/placeholder.svg"} alt={image.name} fill className="object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold truncate">{image.name}</h3>
                    {image.type && <p className="text-sm text-gray-500 mt-1">{image.type}</p>}
                    <div className="flex justify-end mt-2">
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(image)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Removal</DialogTitle>
              <DialogDescription>
                {category === "gallery"
                  ? "Are you sure you want to delete this image? This action cannot be undone."
                  : "Are you sure you want to remove this image? The image URL will be removed from the database."}
              </DialogDescription>
            </DialogHeader>
            {selectedImage && (
              <div className="relative h-48 my-4">
                <Image
                  src={selectedImage.url || "/placeholder.svg"}
                  alt={selectedImage.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? "Removing..." : "Remove Image"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
