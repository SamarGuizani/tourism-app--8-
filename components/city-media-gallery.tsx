"use client"

import { useState, useEffect } from "react"
import { ClientImage as Image } from "@/components/client-image"
import { supabase } from "@/lib/supabase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, Film } from "lucide-react"

interface MediaItem {
  id: string
  city_slug: string
  media_type: string
  url: string
  title: string
  description?: string
  created_at: string
}

export default function CityMediaGallery({ citySlug, cityName }: { citySlug: string; cityName: string }) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMediaGallery() {
      setIsLoading(true)
      setError(null)

      try {
        const { data, error } = await supabase
          .from("media_galleries")
          .select("*")
          .eq("city_slug", citySlug)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching media gallery:", error)
          setError("Failed to load media gallery. Please try again later.")
          return
        }

        setMediaItems(data || [])
      } catch (err) {
        console.error("Error in fetchMediaGallery:", err)
        setError("An unexpected error occurred. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMediaGallery()
  }, [citySlug])

  // Filter media by type
  const images = mediaItems.filter((item) => item.media_type === "image")
  const videos = mediaItems.filter((item) => item.media_type === "video")

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  if (mediaItems.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No media available</h3>
        <p className="text-gray-500 mb-6">There are no photos or videos available for {cityName} yet.</p>
        <Button>Add Media</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Media Gallery for {cityName}</h2>

      <Tabs defaultValue="photos" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="photos" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Photos ({images.length})
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Film className="h-4 w-4" />
            Videos ({videos.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="photos">
          {images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden group cursor-pointer">
                  <div className="relative aspect-square">
                    <Image
                      src={
                        image.url || `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(image.title)}`
                      }
                      alt={image.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-3">
                    <p className="font-medium text-sm truncate">{image.title}</p>
                    {image.description && (
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{image.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No photos available for {cityName}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="videos">
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <iframe
                      src={video.url}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    ></iframe>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{video.title}</h3>
                    {video.description && <p className="text-sm text-gray-500 mt-1">{video.description}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No videos available for {cityName}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
