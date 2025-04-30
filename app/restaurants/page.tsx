"use client"

import { useState, useEffect } from "react"
import { getAllRestaurants } from "@/lib/data-aggregator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Utensils, DollarSign } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Restaurant {
  id: string
  name: string
  description: string
  location?: string
  city_name?: string
  city_slug?: string
  region?: string
  image_url?: string
  cuisine?: string
  price_range?: string
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all")
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all")
  const [uniqueRegions, setUniqueRegions] = useState<string[]>([])
  const [uniqueCities, setUniqueCities] = useState<string[]>([])
  const [uniqueCuisines, setUniqueCuisines] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getAllRestaurants()
        setRestaurants(data)
        setFilteredRestaurants(data)

        // Extract unique regions, cities, and cuisines
        const regions = Array.from(new Set(data.map((item) => item.region).filter(Boolean)))
        const cities = Array.from(new Set(data.map((item) => item.city_name).filter(Boolean)))

        // Extract and process cuisines (split multi-cuisines and deduplicate)
        const allCuisines = data
          .flatMap((item) => item.cuisine?.split(",").map((c) => c.trim()))
          .filter(Boolean) as string[]
        const cuisines = Array.from(new Set(allCuisines))

        setUniqueRegions(regions as string[])
        setUniqueCities(cities as string[])
        setUniqueCuisines(cuisines as string[])
      } catch (error) {
        console.error("Error fetching restaurants:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    // Filter restaurants based on search term and selected filters
    let filtered = restaurants

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.name?.toLowerCase().includes(term) ||
          restaurant.description?.toLowerCase().includes(term) ||
          restaurant.location?.toLowerCase().includes(term) ||
          restaurant.cuisine?.toLowerCase().includes(term),
      )
    }

    if (selectedRegion !== "all") {
      filtered = filtered.filter((restaurant) => restaurant.region === selectedRegion)
    }

    if (selectedCity !== "all") {
      filtered = filtered.filter((restaurant) => restaurant.city_name === selectedCity)
    }

    if (selectedCuisine !== "all") {
      filtered = filtered.filter((restaurant) =>
        restaurant.cuisine?.toLowerCase().includes(selectedCuisine.toLowerCase()),
      )
    }

    if (selectedPriceRange !== "all") {
      filtered = filtered.filter((restaurant) => restaurant.price_range === selectedPriceRange)
    }

    setFilteredRestaurants(filtered)
  }, [searchTerm, selectedRegion, selectedCity, selectedCuisine, selectedPriceRange, restaurants])

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
          <DollarSign key={i} className="h-4 w-4" />
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Explore Restaurants</h1>
          <p className="text-gray-500">Discover delicious dining across Tunisia</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <Input
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {uniqueRegions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {uniqueCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by cuisine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cuisines</SelectItem>
                {uniqueCuisines.map((cuisine) => (
                  <SelectItem key={cuisine} value={cuisine}>
                    {cuisine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="$">$ (Budget)</SelectItem>
                <SelectItem value="$$">$$ (Moderate)</SelectItem>
                <SelectItem value="$$$">$$$ (Upscale)</SelectItem>
                <SelectItem value="$$$$">$$$$ (Luxury)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredRestaurants.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">No restaurants found matching your criteria</p>
              <Link href="/admin/restaurants">
                <Button>Add New Restaurant</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
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
                      <div>
                        <CardTitle>{restaurant.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-4 w-4" />
                          {restaurant.city_name || restaurant.location || "Unknown location"}
                        </CardDescription>
                      </div>
                      <div className="text-amber-500">{renderPriceRange(restaurant.price_range)}</div>
                    </div>
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
          )}
        </div>
      </div>
    </div>
  )
}
