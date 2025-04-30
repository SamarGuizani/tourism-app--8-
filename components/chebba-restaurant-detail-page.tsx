"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Utensils, MapPin, Star, DollarSign, Clock, ArrowLeft, ExternalLink } from "lucide-react"

interface ChebbaRestaurantDetailProps {
  restaurantId: string
}

export default function ChebbaRestaurantDetailPage({ restaurantId }: ChebbaRestaurantDetailProps) {
  const [restaurant, setRestaurant] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    async function fetchRestaurantData() {
      try {
        // Check if the chebba_restaurants table exists
        const { data: tableExists } = await supabase.rpc("table_exists", { table_name: "chebba_restaurants" })

        if (!tableExists) {
          setError("Restaurant data not available")
          setLoading(false)
          return
        }

        // Fetch the restaurant data
        const { data, error } = await supabase.from("chebba_restaurants").select("*").eq("id", restaurantId).single()

        if (error) {
          throw error
        }

        if (data) {
          setRestaurant(data)
        } else {
          setError("Restaurant not found")
        }
      } catch (err) {
        console.error("Error fetching restaurant:", err)
        setError("Failed to load restaurant data")
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurantData()
  }, [restaurantId])

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !restaurant) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error || "Failed to load restaurant data"}</p>
          <Link href="/cities-regions/chebba">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Chebba
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Check if photos is a string and convert to array if needed
  const photos = Array.isArray(restaurant.photos)
    ? restaurant.photos
    : typeof restaurant.photos === "string"
      ? [restaurant.photos]
      : []

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/cities-regions/chebba" className="text-primary hover:underline flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Chebba
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Utensils className="mr-3 h-7 w-7 text-primary" />
            {restaurant.name}
          </h1>

          {restaurant.cuisine && (
            <Badge variant="outline" className="mb-4 capitalize">
              {restaurant.cuisine}
            </Badge>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="mb-8">
                <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-6">
                  <Image
                    src={
                      photos[0] ||
                      `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(restaurant.name + " restaurant")}`
                    }
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="prose max-w-none">
                  <p className="text-lg mb-6">
                    {restaurant.description || "A popular restaurant in Chebba offering delicious local cuisine."}
                  </p>

                  {restaurant.ranking && (
                    <div className="flex items-center mb-4">
                      <Star className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="font-medium">Ranking:</span>
                      <span className="ml-2">#{restaurant.ranking} in Chebba</span>
                    </div>
                  )}

                  <div className="flex items-center mb-4">
                    <MapPin className="h-5 w-5 text-red-500 mr-2" />
                    <span className="font-medium">Location:</span>
                    <span className="ml-2">Chebba, Tunisia</span>
                  </div>

                  {restaurant.price_range && (
                    <div className="flex items-center mb-4">
                      <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                      <span className="font-medium">Price Range:</span>
                      <span className="ml-2">{restaurant.price_range}</span>
                    </div>
                  )}

                  {restaurant.google_map_link && (
                    <a
                      href={restaurant.google_map_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:underline mb-4"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View on Google Maps
                    </a>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="photos">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {photos.length > 0 ? (
                  photos.map((photo, index) => (
                    <div key={index} className="relative h-64 rounded-lg overflow-hidden">
                      <Image
                        src={photo || "/placeholder.svg"}
                        alt={`${restaurant.name} - Photo ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No photos available</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Restaurant Information</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    Opening Hours
                  </h3>
                  <p className="text-gray-600 mt-1">{restaurant.opening_hours || "Please call for current hours"}</p>
                </div>

                <div>
                  <h3 className="font-medium flex items-center">
                    <Utensils className="h-4 w-4 mr-2 text-primary" />
                    Cuisine
                  </h3>
                  <p className="text-gray-600 mt-1 capitalize">{restaurant.cuisine || "Tunisian"}</p>
                </div>

                <div>
                  <h3 className="font-medium flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-primary" />
                    Price Range
                  </h3>
                  <p className="text-gray-600 mt-1">{restaurant.price_range || "Moderate"}</p>
                </div>
              </div>

              <div className="mt-6">
                <Link href={`/book-guide?location=chebba&restaurant=${restaurantId}`}>
                  <Button className="w-full">Book a Guide for This Restaurant</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
