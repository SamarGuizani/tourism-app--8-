"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Utensils, Compass, ExternalLink } from "lucide-react"

interface Coordinates {
  latitude: number
  longitude: number
}

interface CityProps {
  city: {
    name: string
    title?: string
    description?: string
    heroImage?: string
    images?: string[]
    region?: string
    gettingThere?: string
    bestTimeToVisit?: string
    slug: string
    coordinates?: Coordinates
    governorate_id?: string
  }
  attractions?: any[]
  restaurants?: any[]
  activities?: any[]
}

export default function CityTemplate(props: CityProps) {
  const city = props.city || {}
  const attractions = props.attractions || []
  const restaurants = props.restaurants || []
  const activities = props.activities || []

  const [heroImageSrc, setHeroImageSrc] = React.useState(city.heroImage || "/sahara-oasis.png")
  const [activeTab, setActiveTab] = React.useState("overview")

  function handleImageError() {
    setHeroImageSrc("/sahara-oasis.png")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
        <Image
          src={heroImageSrc || "/placeholder.svg"}
          alt={`${city.name || "City"} landscape`}
          fill
          className="object-cover"
          onError={handleImageError}
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="p-6 text-white">
            <h1 className="text-4xl font-bold">{city.name || "City"}</h1>
            {city.region && <p className="text-lg mt-2">{city.region}</p>}
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attractions">Attractions</TabsTrigger>
          <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-8">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">About {city.name}</h2>
              <p className="text-gray-700">
                {city.description || `Explore the beautiful area of ${city.name || "this city"}.`}
              </p>
            </div>

            {/* Travel Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">Getting There</h3>
                  <p>{city.gettingThere || "Information about getting to this destination will be available soon."}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">Best Time to Visit</h3>
                  <p>{city.bestTimeToVisit || "This destination can be visited year-round."}</p>
                </CardContent>
              </Card>
            </div>

            {/* Featured Sections */}
            {attractions && attractions.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Top Attractions</h2>
                  <Button variant="link" onClick={() => setActiveTab("attractions")}>
                    View All
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {attractions.slice(0, 3).map((attraction, index) => (
                    <AttractionCard key={attraction?.id || index} attraction={attraction} citySlug={city.slug} />
                  ))}
                </div>
              </div>
            )}

            {/* Restaurants Section */}
            {restaurants && restaurants.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Popular Restaurants</h2>
                  <Button variant="link" onClick={() => setActiveTab("restaurants")}>
                    View All
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurants.slice(0, 3).map((restaurant, index) => (
                    <RestaurantCard key={restaurant?.id || index} restaurant={restaurant} citySlug={city.slug} />
                  ))}
                </div>
              </div>
            )}

            {/* Activities Section */}
            {activities && activities.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Things to Do</h2>
                  <Button variant="link" onClick={() => setActiveTab("activities")}>
                    View All
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activities.slice(0, 3).map((activity, index) => (
                    <ActivityCard key={activity?.id || index} activity={activity} citySlug={city.slug} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="attractions">
          <div>
            <h2 className="text-2xl font-bold mb-6">Attractions in {city.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {attractions && attractions.length > 0 ? (
                attractions.map((attraction, index) => (
                  <AttractionCard key={attraction?.id || index} attraction={attraction} citySlug={city.slug} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No attractions found for {city.name}</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="restaurants">
          <div>
            <h2 className="text-2xl font-bold mb-6">Restaurants in {city.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants && restaurants.length > 0 ? (
                restaurants.map((restaurant, index) => (
                  <RestaurantCard key={restaurant?.id || index} restaurant={restaurant} citySlug={city.slug} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No restaurants found for {city.name}</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activities">
          <div>
            <h2 className="text-2xl font-bold mb-6">Activities in {city.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities && activities.length > 0 ? (
                activities.map((activity, index) => (
                  <ActivityCard key={activity?.id || index} activity={activity} citySlug={city.slug} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No activities found for {city.name}</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Governorate Link */}
      {city.governorate_id && (
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Explore the Region</h3>
              <p className="mb-4">
                {city.name} is located in the {city.region || city.governorate_id} region. Explore more cities and
                attractions in this region.
              </p>
              <Link
                href={`/regions/${city.region?.toLowerCase().replace(/\s+/g, "-") || city.governorate_id?.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-primary hover:underline"
              >
                Explore {city.region || city.governorate_id} Region
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Attraction Card Component
function AttractionCard({ attraction, citySlug }) {
  const [imageSrc, setImageSrc] = React.useState(
    attraction?.image_url ||
      `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(attraction?.name || "attraction")}`,
  )

  function handleImageError() {
    setImageSrc(`/placeholder.svg?height=400&width=600&query=${encodeURIComponent(attraction?.name || "attraction")}`)
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={attraction?.name || "Attraction"}
          fill
          className="object-cover"
          onError={handleImageError}
        />
      </div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          {attraction?.name || "Attraction"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 line-clamp-3">{attraction?.description || "No description available."}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        <Link href={`/attractions/${attraction.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            Learn More
          </Button>
        </Link>
        {attraction?.google_map_link && (
          <a
            href={attraction.google_map_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 flex items-center gap-1 hover:text-primary"
          >
            <MapPin className="h-3 w-3" /> View on map <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        )}
      </CardFooter>
    </Card>
  )
}

// Restaurant Card Component
function RestaurantCard({ restaurant, citySlug }) {
  const [imageSrc, setImageSrc] = React.useState(
    restaurant?.image_url ||
      `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(restaurant?.name || "restaurant")}`,
  )

  function handleImageError() {
    setImageSrc(`/placeholder.svg?height=400&width=600&query=${encodeURIComponent(restaurant?.name || "restaurant")}`)
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={restaurant?.name || "Restaurant"}
          fill
          className="object-cover"
          onError={handleImageError}
        />
      </div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="h-4 w-4 text-primary" />
          {restaurant?.name || "Restaurant"}
        </CardTitle>
        {restaurant?.cuisine && <CardDescription>{restaurant.cuisine}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 line-clamp-3">{restaurant?.description || "No description available."}</p>
        {restaurant?.price_range && (
          <Badge variant="outline" className="mt-2">
            {restaurant.price_range}
          </Badge>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        <Link href={`/restaurants/${restaurant?.id}`} className="text-primary hover:underline">
          Learn more
        </Link>
        {restaurant?.google_map_link && (
          <a
            href={restaurant.google_map_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 flex items-center gap-1 hover:text-primary"
          >
            <MapPin className="h-3 w-3" /> View on map <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        )}
      </CardFooter>
    </Card>
  )
}

// Activity Card Component
function ActivityCard({ activity, citySlug }) {
  const [imageSrc, setImageSrc] = React.useState(
    activity?.image_url ||
      `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(activity?.name || "activity")}`,
  )

  function handleImageError() {
    setImageSrc(`/placeholder.svg?height=400&width=600&query=${encodeURIComponent(activity?.name || "activity")}`)
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={activity?.name || "Activity"}
          fill
          className="object-cover"
          onError={handleImageError}
        />
      </div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-primary" />
          {activity?.name || "Activity"}
        </CardTitle>
        {activity?.duration && <CardDescription>{activity.duration}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 line-clamp-3">{activity?.description || "No description available."}</p>
        {activity?.difficulty && (
          <Badge variant="outline" className="mt-2">
            {activity.difficulty}
          </Badge>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        <Link href={`/activities/${activity?.id}`} className="text-primary hover:underline">
          Learn more
        </Link>
        {activity?.google_map_link && (
          <a
            href={activity.google_map_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 flex items-center gap-1 hover:text-primary"
          >
            <MapPin className="h-3 w-3" /> View on map <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        )}
      </CardFooter>
    </Card>
  )
}
