"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Calendar, Clock, Info, ArrowLeft, Globe } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import VideoGallery from "./video-gallery"

interface AttractionDetailProps {
  attraction:
    | {
        id: string
        name: string
        type?: string
        description?: string
        ranking?: number
        photos?: string[]
        google_map_link?: string
        videos?: Array<{
          name: string
          url: string
          orientation?: string
        }>
        city_slug?: string
        city_name?: string
        address?: string
        opening_hours?: string
        entrance_fee?: string
        best_time_to_visit?: string
        tips?: string
        accessibility?: string
      }
    | undefined // Make attraction prop optional
}

export default function AttractionDetailPage({ attraction }: AttractionDetailProps) {
  const [mainImage, setMainImage] = useState(
    attraction?.photos && attraction.photos.length > 0
      ? attraction.photos[0]
      : `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(attraction?.name || "Attraction")}`,
  )

  // Format photos for the gallery
  const formattedPhotos = attraction?.photos
    ? attraction.photos.map((photo) => ({
        url: photo,
        alt: `${attraction.name} photo`,
      }))
    : []

  // Format videos for the gallery
  const formattedVideos = attraction?.videos
    ? attraction.videos.map((video) => ({
        name: video.name,
        url: video.url,
        orientation: video.orientation || "landscape",
      }))
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-cover bg-center">
        <Image
          src={mainImage || "/placeholder.svg"}
          alt={attraction?.name || "Attraction"}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="container mx-auto px-4 py-12 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 mr-1" />
                <span className="text-sm">{attraction?.city_name || "Chebba"}</span>
                {attraction?.type && (
                  <>
                    <span className="mx-2">•</span>
                    <Badge variant="outline" className="text-white border-white">
                      {attraction.type}
                    </Badge>
                  </>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{attraction?.name || "Attraction"}</h1>
              {attraction?.ranking && (
                <div className="flex items-center mb-4">
                  <Badge variant="secondary" className="mr-2">
                    Ranked #{attraction.ranking}
                  </Badge>
                  <span className="text-sm">in Chebba Attractions</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link href={`/cities/${attraction?.city_slug || "chebba"}`}>
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to {attraction?.city_name || "Chebba"}
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="mb-8">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
                {formattedVideos.length > 0 && <TabsTrigger value="videos">Videos</TabsTrigger>}
              </TabsList>

              <TabsContent value="overview">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold mb-4">About {attraction?.name}</h2>
                  <p className="text-gray-700 whitespace-pre-line">{attraction?.description}</p>

                  {/* Additional Information */}
                  {(attraction?.opening_hours || attraction?.entrance_fee || attraction?.best_time_to_visit) && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold mb-4">Visitor Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {attraction?.opening_hours && (
                          <div className="flex items-start gap-2">
                            <Clock className="h-5 w-5 text-primary mt-1" />
                            <div>
                              <h4 className="font-semibold">Opening Hours</h4>
                              <p className="text-gray-600">{attraction.opening_hours}</p>
                            </div>
                          </div>
                        )}

                        {attraction?.entrance_fee && (
                          <div className="flex items-start gap-2">
                            <Info className="h-5 w-5 text-primary mt-1" />
                            <div>
                              <h4 className="font-semibold">Entrance Fee</h4>
                              <p className="text-gray-600">{attraction.entrance_fee}</p>
                            </div>
                          </div>
                        )}

                        {attraction?.best_time_to_visit && (
                          <div className="flex items-start gap-2">
                            <Calendar className="h-5 w-5 text-primary mt-1" />
                            <div>
                              <h4 className="font-semibold">Best Time to Visit</h4>
                              <p className="text-gray-600">{attraction.best_time_to_visit}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tips Section */}
                  {attraction?.tips && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold mb-4">Tips for Visitors</h3>
                      <p className="text-gray-700 whitespace-pre-line">{attraction.tips}</p>
                    </div>
                  )}

                  {/* Accessibility Information */}
                  {attraction?.accessibility && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold mb-4">Accessibility</h3>
                      <p className="text-gray-700 whitespace-pre-line">{attraction.accessibility}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="photos">
                {formattedPhotos.length > 0 ? (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Photos of {attraction?.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {formattedPhotos.map((photo, index) => (
                        <div
                          key={index}
                          className="relative h-64 cursor-pointer rounded-lg overflow-hidden"
                          onClick={() => setMainImage(photo.url)}
                        >
                          <Image
                            src={photo.url || "/placeholder.svg"}
                            alt={photo.alt}
                            fill
                            className="object-cover hover:opacity-90 transition-opacity"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-100 rounded-lg">
                    <p className="text-gray-500">No photos available for this attraction.</p>
                  </div>
                )}
              </TabsContent>

              {formattedVideos.length > 0 && (
                <TabsContent value="videos">
                  <h2 className="text-2xl font-bold mb-6">Videos of {attraction?.name}</h2>
                  <VideoGallery videos={formattedVideos} />
                </TabsContent>
              )}
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">Location</h3>
                {attraction?.address && (
                  <div className="flex items-start gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <p className="text-gray-600">{attraction.address}</p>
                  </div>
                )}
                {attraction?.google_map_link && (
                  <a href={attraction.google_map_link} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      View on Google Maps
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">Explore More</h3>
                <div className="space-y-4">
                  <Link href={`/cities/${attraction?.city_slug || "chebba"}`} className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      More attractions in {attraction?.city_name || "Chebba"}
                    </Button>
                  </Link>
                  <Link href={`/restaurants?city=${attraction?.city_slug || "chebba"}`} className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      Restaurants nearby
                    </Button>
                  </Link>
                  <Link href={`/activities?city=${attraction?.city_slug || "chebba"}`} className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      Activities nearby
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
