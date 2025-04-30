import type { Metadata } from "next"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Chebba - Tunisia Tourism",
  description: "Discover the beautiful coastal city of Chebba in Tunisia",
}

export const dynamic = "force-dynamic"

export default async function ChebbaPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch attractions from attractions_chebba table
  const { data: attractions, error: attractionsError } = await supabase
    .from("attractions_chebba")
    .select("*")
    .order("name")

  if (attractionsError) {
    console.error("Error fetching attractions:", attractionsError)
  }

  // Fetch restaurants from restaurants_chebba table
  const { data: restaurants, error: restaurantsError } = await supabase
    .from("restaurants_chebba")
    .select("*")
    .order("name")

  if (restaurantsError) {
    console.error("Error fetching restaurants:", restaurantsError)
  }

  // Fetch activities from activities_chebba table
  const { data: activities, error: activitiesError } = await supabase
    .from("activities_chebba")
    .select("*")
    .order("name")

  if (activitiesError) {
    console.error("Error fetching activities:", activitiesError)
  }

  // If we couldn't fetch any data, show 404
  if (
    (!attractions || attractions.length === 0) &&
    (!restaurants || restaurants.length === 0) &&
    (!activities || activities.length === 0)
  ) {
    notFound()
  }

  // Find a suitable hero image from the attractions
  const heroImage =
    attractions?.find((a) => a.image_url && !a.image_url.includes("placeholder"))?.image_url ||
    "/chebba-beach-sunset.png"

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-8">
        <Image src={heroImage || "/placeholder.svg"} alt="Chebba, Tunisia" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/30 flex items-end">
          <div className="p-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Chebba</h1>
            <p className="text-lg max-w-2xl">
              A charming coastal city in eastern Tunisia known for its beautiful beaches and rich maritime heritage.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="attractions" className="mb-8">
        <TabsList className="mb-6">
          {attractions && attractions.length > 0 && <TabsTrigger value="attractions">Attractions</TabsTrigger>}
          {restaurants && restaurants.length > 0 && <TabsTrigger value="restaurants">Restaurants</TabsTrigger>}
          {activities && activities.length > 0 && <TabsTrigger value="activities">Activities</TabsTrigger>}
        </TabsList>

        {attractions && attractions.length > 0 && (
          <TabsContent value="attractions">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {attractions.map((attraction) => (
                <Card key={attraction.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={
                        attraction.image_url ||
                        `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(attraction.name || "attraction")}`
                      }
                      alt={attraction.name || "Attraction"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold mb-2">{attraction.name}</h3>
                    <p className="text-sm line-clamp-3 mb-4">{attraction.description}</p>
                    <Link href={`/attractions/${attraction.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}

        {restaurants && restaurants.length > 0 && (
          <TabsContent value="restaurants">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <Card key={restaurant.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={
                        restaurant.image_url ||
                        `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(restaurant.name || "restaurant")}`
                      }
                      alt={restaurant.name || "Restaurant"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold mb-2">{restaurant.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{restaurant.cuisine || "Local Cuisine"}</p>
                    <p className="text-sm line-clamp-3 mb-4">{restaurant.description}</p>
                    <Link href={`/restaurants/${restaurant.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}

        {activities && activities.length > 0 && (
          <TabsContent value="activities">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => (
                <Card key={activity.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={
                        activity.image_url ||
                        `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(activity.name || "activity")}`
                      }
                      alt={activity.name || "Activity"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold mb-2">{activity.name}</h3>
                    <p className="text-sm line-clamp-3 mb-4">{activity.description}</p>
                    <Link href={`/activities/${activity.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
