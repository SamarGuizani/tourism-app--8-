import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Utensils, Compass } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function MahdiaPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch attractions
  const { data: attractions, error: attractionsError } = await supabase.from("mahdia_attractions").select("*")

  // Fetch restaurants
  const { data: restaurants, error: restaurantsError } = await supabase.from("mahdia_restaurants").select("*")

  // Fetch activities
  const { data: activities, error: activitiesError } = await supabase.from("mahdia_activities").select("*")

  if (attractionsError || restaurantsError || activitiesError) {
    console.error("Error fetching data:", { attractionsError, restaurantsError, activitiesError })
  }

  if (!attractions?.length && !restaurants?.length && !activities?.length) {
    return notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Mahdia</h1>
        <p className="text-lg text-gray-700 mb-6">
          Discover the beautiful coastal city of Mahdia, known for its historical medina, stunning beaches, and rich
          cultural heritage.
        </p>
      </div>

      <Tabs defaultValue="attractions" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="attractions">Attractions</TabsTrigger>
          <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="attractions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions?.map((attraction) => (
              <Card key={attraction.id} className="overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src={`/abstract-geometric-shapes.png?height=400&width=600&query=${encodeURIComponent(attraction.title)}`}
                    alt={attraction.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{attraction.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{attraction.description}</p>
                  <div className="flex justify-between items-center">
                    <Link href={`/attractions/mahdia/${attraction.id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                    {attraction.google_map_link && (
                      <a href={attraction.google_map_link} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon">
                          <MapPin className="h-5 w-5" />
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="restaurants">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants?.map((restaurant) => (
              <Card key={restaurant.id} className="overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src={`/abstract-geometric-shapes.png?height=400&width=600&query=${encodeURIComponent(restaurant.title)}`}
                    alt={restaurant.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{restaurant.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{restaurant.type}</p>
                  <p className="text-gray-600 mb-4 line-clamp-3">{restaurant.description}</p>
                  <div className="flex justify-between items-center">
                    <Link href={`/restaurants/mahdia/${restaurant.id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                    {restaurant.google_map_link && (
                      <a href={restaurant.google_map_link} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon">
                          <Utensils className="h-5 w-5" />
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activities">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities?.map((activity) => (
              <Card key={activity.id} className="overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src={`/abstract-geometric-shapes.png?height=400&width=600&query=${encodeURIComponent(activity.title)}`}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{activity.type}</p>
                  <p className="text-gray-600 mb-4 line-clamp-3">{activity.description}</p>
                  <div className="flex justify-between items-center">
                    <Link href={`/activities/mahdia/${activity.id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                    {activity.google_map_link && (
                      <a href={activity.google_map_link} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon">
                          <Compass className="h-5 w-5" />
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
