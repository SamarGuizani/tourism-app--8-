"use client"

import { useState, useEffect } from "react"
import { getRestaurantsByCity } from "@/lib/data-aggregator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Utensils, DollarSign } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Restaurant {
  id: string
  name: string
  description: string
  location?: string
  image_url?: string
  cuisine?: string
  price_range?: string
}

interface CityRestaurantsProps {
  citySlug: string
  cityName: string
  initialRestaurants?: Restaurant[]
}

export default function CityRestaurants({ citySlug, cityName, initialRestaurants = [] }: CityRestaurantsProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants)
  const [loading, setLoading] = useState(initialRestaurants.length === 0)

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (initialRestaurants.length > 0) return

      try {
        setLoading(true)
        const data = await getRestaurantsByCity(citySlug)
        setRestaurants(data)
      } catch (error) {
        console.error(`Error fetching restaurants for ${cityName}:`, error)
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [citySlug, cityName, initialRestaurants])

  // Create a safe image URL with fallback
  const safeImageUrl = (url?: string, fallbackText?: string) => {
    if (!url || url.trim() === "") {
      return `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(fallbackText || "Restaurant")}`
    }
    return url
  }

  // Function to render price range as dollar signs
  const renderPriceRange = (priceRange?: string) => {
    if (!priceRange) return null

    const count = priceRange.length
    return (
      <div className="flex">
        {Array.from({ length: count }).map((_, i) => (
          <DollarSign key={i} className="h-4 w-4 text-amber-500" />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 mb-4">No restaurants found for {cityName}</p>
        <Link href="/admin/restaurants">
          <Button>Add a Restaurant</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-48">
            <Image
              src={safeImageUrl(restaurant.image_url, restaurant.name) || "/placeholder.svg"}
              alt={restaurant.name}
              fill
              className="object-cover"
            />
          </div>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>{restaurant.name}</CardTitle>
              <div>{renderPriceRange(restaurant.price_range)}</div>
            </div>
            {restaurant.location && <CardDescription>{restaurant.location}</CardDescription>}
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3 mb-3">{restaurant.description}</p>
            {restaurant.cuisine && (
              <Badge variant="outline" className="flex items-center gap-1 w-fit">
                <Utensils className="h-3 w-3" />
                {restaurant.cuisine}
              </Badge>
            )}
          </CardContent>
          <CardFooter>
            <Link href={`/restaurants/${restaurant.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
