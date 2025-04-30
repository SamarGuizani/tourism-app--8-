import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/utils/supabase/server"
import type { CarthageAttraction, CarthageRestaurant } from "@/types/carthage"
import { Utensils, Landmark } from "lucide-react"

export const metadata: Metadata = {
  title: "Carthage | Tunisia Guide",
  description: "Explore the ancient ruins and modern attractions of Carthage, Tunisia",
}

async function getAttractions() {
  const supabase = createClient()
  const { data, error } = await supabase.from("attractions_carthage").select("*")

  if (error) {
    console.error("Error fetching Carthage attractions:", error)
    return []
  }

  return data as CarthageAttraction[]
}

async function getRestaurants() {
  const supabase = createClient()
  const { data, error } = await supabase.from("restaurants_carthage").select("*")

  if (error) {
    console.error("Error fetching Carthage restaurants:", error)
    return []
  }

  return data as CarthageRestaurant[]
}

export default async function CarthagePage() {
  const attractions = await getAttractions()
  const restaurants = await getRestaurants()

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Carthage</h1>
        <p className="text-xl text-gray-600">Explore the ancient ruins and modern attractions of this historic city</p>
      </div>

      <div className="mb-8">
        <div className="relative h-[300px] w-full overflow-hidden rounded-xl">
          <img src="/carthage-ancient-remains.png" alt="Carthage, Tunisia" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-lg">
          Carthage, once a powerful ancient city-state and the center of the Carthaginian civilization, is now a wealthy
          suburb of Tunis that houses impressive archaeological sites. Founded by the Phoenicians in the 9th century BC,
          Carthage became a major power in the Mediterranean before being destroyed and later rebuilt by the Romans.
          Today, its UNESCO World Heritage ruins offer a fascinating glimpse into both Punic and Roman history.
        </p>
      </div>

      <Tabs defaultValue="attractions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="attractions" className="flex items-center gap-2">
            <Landmark className="h-4 w-4" />
            Attractions
          </TabsTrigger>
          <TabsTrigger value="restaurants" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            Restaurants
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attractions" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((attraction) => (
              <Link
                key={attraction.id || attraction.name}
                href={`/cities-and-regions/tunis/carthage/attractions/${attraction.id || encodeURIComponent(attraction.name.toLowerCase().replace(/\s+/g, "-"))}`}
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 w-full">
                    <img
                      src={
                        attraction.image ||
                        `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(attraction.name)}`
                      }
                      alt={attraction.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{attraction.name}</h3>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{attraction.type}</span>
                    </div>
                    <p className="text-gray-600 line-clamp-3">{attraction.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="restaurants" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id || restaurant.name}
                href={`/cities-and-regions/tunis/carthage/restaurants/${restaurant.id || encodeURIComponent(restaurant.name.toLowerCase().replace(/\s+/g, "-"))}`}
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 w-full">
                    <img
                      src={`/abstract-geometric-shapes.png?height=200&width=300&query=${encodeURIComponent(restaurant.name + " restaurant")}`}
                      alt={restaurant.name}
                      className="h-full w-full object-cover"
                    />
                    {restaurant.rating && (
                      <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-sm font-semibold">
                        ★ {restaurant.rating}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold mb-1">{restaurant.name}</h3>
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <span className="mr-3">{restaurant.cuisine}</span>
                      {restaurant.price_range && <span>{restaurant.price_range}</span>}
                    </div>
                    {restaurant.comment && (
                      <p className="text-gray-600 line-clamp-2 text-sm italic">"{restaurant.comment}"</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
