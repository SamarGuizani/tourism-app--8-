"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock, Phone, ArrowLeft, Globe, Compass, Instagram } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ActivityDetailProps {
  activity: {
    id: string
    name: string
    type?: string
    description?: string
    photos?: string[]
    google_map_link?: string
    city_slug?: string
    city_name?: string
    address?: string
    duration?: string
    price?: string
    contact?: {
      phone?: string
      instagram?: string
      website?: string
    }
    availability?: string
    requirements?: string[]
    included?: string[]
    not_included?: string[]
  }
}

export default function ActivityDetailPage({ activity }: ActivityDetailProps) {
  // Ensure activity is defined with default values
  const safeActivity = {
    id: activity?.id || "",
    name: activity?.name || "Activity",
    type: activity?.type,
    description: activity?.description || "No description available",
    photos: activity?.photos || [],
    google_map_link: activity?.google_map_link,
    city_slug: activity?.city_slug || "chebba",
    city_name: activity?.city_name || "Chebba",
    address: activity?.address,
    duration: activity?.duration,
    price: activity?.price,
    contact: activity?.contact || {},
    availability: activity?.availability,
    requirements: activity?.requirements || [],
    included: activity?.included || [],
    not_included: activity?.not_included || [],
  }

  const [mainImage, setMainImage] = useState(
    safeActivity.photos && safeActivity.photos.length > 0
      ? safeActivity.photos[0]
      : `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(safeActivity.name)}`,
  )

  // Format photos for the gallery
  const formattedPhotos = safeActivity.photos
    ? safeActivity.photos.map((photo) => ({
        url: photo,
        alt: `${safeActivity.name} photo`,
      }))
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-cover bg-center">
        <Image src={mainImage || "/placeholder.svg"} alt={safeActivity.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="container mx-auto px-4 py-12 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 mr-1" />
                <span className="text-sm">{safeActivity.city_name}</span>
                {safeActivity.type && (
                  <>
                    <span className="mx-2">•</span>
                    <Badge variant="outline" className="text-white border-white">
                      {safeActivity.type}
                    </Badge>
                  </>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{safeActivity.name}</h1>
              {safeActivity.duration && (
                <div className="flex items-center mb-4">
                  <Badge variant="secondary" className="mr-2">
                    <Clock className="h-4 w-4 mr-1" /> {safeActivity.duration}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link href={`/cities/${safeActivity.city_slug}`}>
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to {safeActivity.city_name}
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
                {(safeActivity.included?.length > 0 || safeActivity.not_included?.length > 0) && (
                  <TabsTrigger value="details">Details</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="overview">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold mb-4">About {safeActivity.name}</h2>
                  <p className="text-gray-700 whitespace-pre-line">{safeActivity.description}</p>

                  {/* Requirements Section */}
                  {safeActivity.requirements && safeActivity.requirements.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold mb-4">Requirements</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {safeActivity.requirements.map((requirement, index) => (
                          <li key={index} className="text-gray-700">
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Availability Section */}
                  {safeActivity.availability && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold mb-4">Availability</h3>
                      <p className="text-gray-700">{safeActivity.availability}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="photos">
                {formattedPhotos.length > 0 ? (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Photos of {safeActivity.name}</h2>
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
                    <p className="text-gray-500">No photos available for this activity.</p>
                  </div>
                )}
              </TabsContent>

              {(safeActivity.included?.length > 0 || safeActivity.not_included?.length > 0) && (
                <TabsContent value="details">
                  <h2 className="text-2xl font-bold mb-6">Activity Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {safeActivity.included && safeActivity.included.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-green-600">What's Included</h3>
                        <ul className="space-y-2">
                          {safeActivity.included.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-500 mt-1">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {safeActivity.not_included && safeActivity.not_included.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-red-600">Not Included</h3>
                        <ul className="space-y-2">
                          {safeActivity.not_included.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-red-500 mt-1">✗</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">Location & Contact</h3>
                {safeActivity.address && (
                  <div className="flex items-start gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <p className="text-gray-600">{safeActivity.address}</p>
                  </div>
                )}
                {safeActivity.price && (
                  <div className="flex items-start gap-2 mb-4">
                    <Clock className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold">Price</h4>
                      <p className="text-gray-600">{safeActivity.price}</p>
                    </div>
                  </div>
                )}
                {safeActivity.contact?.phone && (
                  <div className="flex items-start gap-2 mb-4">
                    <Phone className="h-5 w-5 text-primary mt-1" />
                    <p className="text-gray-600">{safeActivity.contact.phone}</p>
                  </div>
                )}
                {safeActivity.contact?.instagram && (
                  <div className="flex items-start gap-2 mb-4">
                    <Instagram className="h-5 w-5 text-primary mt-1" />
                    <p className="text-gray-600">{safeActivity.contact.instagram}</p>
                  </div>
                )}
                {safeActivity.google_map_link && (
                  <a href={safeActivity.google_map_link} target="_blank" rel="noopener noreferrer" className="w-full">
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
                  <Link href={`/activities?city=${safeActivity.city_slug}`} className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                      <Compass className="h-4 w-4 mr-2" />
                      More activities in {safeActivity.city_name}
                    </Button>
                  </Link>
                  <Link href={`/attractions?city=${safeActivity.city_slug}`} className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      Attractions nearby
                    </Button>
                  </Link>
                  <Link href={`/restaurants?city=${safeActivity.city_slug}`} className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      Restaurants nearby
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
