"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock, Phone, ArrowLeft, Globe, Utensils, Instagram } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface RestaurantDetailProps {
  restaurant: {
    id: string
    name: string
    cuisine?: string
    description?: string
    ranking?: number
    photos?: string[]
    google_map_link?: string
    city_slug?: string
    city_name?: string
    address?: string
    opening_hours?: string
    price_range?: string
    contact?: {
      phone?: string
      instagram?: string
      website?: string
    }
    menu_highlights?: string[]
    features?: string[]
  }
}

export default function RestaurantDetailPage({ restaurant }: RestaurantDetailProps) {
  // Ensure restaurant is defined with default values
  const safeRestaurant = {
    id: restaurant?.id || "",
    name: restaurant?.name || "Restaurant",
    cuisine: restaurant?.cuisine || "Local Cuisine",
    description: restaurant?.description || "No description available",
    ranking: restaurant?.ranking,
    photos: restaurant?.photos || [],
    google_map_link: restaurant?.google_map_link,
    city_slug: restaurant?.city_slug || "chebba",
    city_name: restaurant?.city_name || "Chebba",
    address: restaurant?.address,
    opening_hours: restaurant?.opening_hours,
    price_range: restaurant?.price_range,
    contact: restaurant?.contact || {},
    menu_highlights: restaurant?.menu_highlights || [],
    features: restaurant?.features || [],
  }

  const [mainImage, setMainImage] = useState(
    safeRestaurant.photos && safeRestaurant.photos.length > 0
      ? safeRestaurant.photos[0]
      : `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(safeRestaurant.name)}`,
  )

  // Format photos for the gallery
  const formattedPhotos = safeRestaurant.photos
    ? safeRestaurant.photos.map((photo) => ({
        url: photo,
        alt: `${safeRestaurant.name} photo`,
      }))
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-cover bg-center">
        <Image src={mainImage || "/placeholder.svg"} alt={safeRestaurant.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="container mx-auto px-4 py-12 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 mr-1" />
                <span className="text-sm">{safeRestaurant.city_name}</span>
                {safeRestaurant.cuisine && (
                  <>
                    <span className="mx-2">•</span>
                    <Badge variant="outline" className="text-white border-white">
                      {safeRestaurant.cuisine}
                    </Badge>
                  </>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{safeRestaurant.name}</h1>
              {safeRestaurant.ranking && (
                <div className="flex items-center mb-4">
                  <Badge variant="secondary" className="mr-2">
                    Ranked #{safeRestaurant.ranking}
                  </Badge>
                  <span className="text-sm">in {safeRestaurant.city_name} Restaurants</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link href={`/cities/${safeRestaurant.city_slug}`}>
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to {safeRestaurant.city_name}
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
                {safeRestaurant.menu_highlights && safeRestaurant.menu_highlights.length > 0 && (
                  <TabsTrigger value="menu">Menu Highlights</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="overview">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold mb-4">About {safeRestaurant.name}</h2>
                  <p className="text-gray-700 whitespace-pre-line">{safeRestaurant.description}</p>

                  {/* Features Section */}
                  {safeRestaurant.features && safeRestaurant.features.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold mb-4">Restaurant Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {safeRestaurant.features.map((feature, index) => (
                          <Badge key={index} variant="secondary">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="photos">
                {formattedPhotos.length > 0 ? (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Photos of {safeRestaurant.name}</h2>
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
                    <p className="text-gray-500">No photos available for this restaurant.</p>
                  </div>
                )}
              </TabsContent>

              {safeRestaurant.menu_highlights && safeRestaurant.menu_highlights.length > 0 && (
                <TabsContent value="menu">
                  <h2 className="text-2xl font-bold mb-6">Menu Highlights</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {safeRestaurant.menu_highlights.map((item, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-2">
                            <Utensils className="h-5 w-5 text-primary mt-1" />
                            <p className="text-gray-700">{item}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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
                {safeRestaurant.address && (
                  <div className="flex items-start gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <p className="text-gray-600">{safeRestaurant.address}</p>
                  </div>
                )}
                {safeRestaurant.opening_hours && (
                  <div className="flex items-start gap-2 mb-4">
                    <Clock className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold">Opening Hours</h4>
                      <p className="text-gray-600">{safeRestaurant.opening_hours}</p>
                    </div>
                  </div>
                )}
                {safeRestaurant.contact?.phone && (
                  <div className="flex items-start gap-2 mb-4">
                    <Phone className="h-5 w-5 text-primary mt-1" />
                    <p className="text-gray-600">{safeRestaurant.contact.phone}</p>
                  </div>
                )}
                {safeRestaurant.contact?.instagram && (
                  <div className="flex items-start gap-2 mb-4">
                    <Instagram className="h-5 w-5 text-primary mt-1" />
                    <p className="text-gray-600">{safeRestaurant.contact.instagram}</p>
                  </div>
                )}
                {safeRestaurant.google_map_link && (
                  <a href={safeRestaurant.google_map_link} target="_blank" rel="noopener noreferrer" className="w-full">
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
                  <Link href={`/restaurants?city=${safeRestaurant.city_slug}`} className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                      <Utensils className="h-4 w-4 mr-2" />
                      More restaurants in {safeRestaurant.city_name}
                    </Button>
                  </Link>
                  <Link href={`/attractions?city=${safeRestaurant.city_slug}`} className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      Attractions nearby
                    </Button>
                  </Link>
                  <Link href={`/activities?city=${safeRestaurant.city_slug}`} className="w-full">
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
