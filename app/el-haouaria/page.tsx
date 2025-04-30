import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MapPin, Star, DollarSign, Utensils, Compass } from "lucide-react"
import { CityMap } from "@/components/city-map"

export default async function ElHaouariaPage() {
  const supabase = createServerComponentClient({ cookies })

  // Check if restaurants_el_haouaria table exists
  const { data: tableExists } = await supabase
    .from("information_schema.tables")
    .select("table_name")
    .eq("table_schema", "public")
    .eq("table_name", "restaurants_el_haouaria")
    .single()

  // Fetch El Haouaria restaurants if table exists
  let restaurants = []
  if (tableExists) {
    const { data, error } = await supabase.from("restaurants_el_haouaria").select("*").order("name")

    if (!error && data) {
      restaurants = data
    }
  }

  // Check if activities_el_haouaria table exists
  const { data: activitiesTableExists } = await supabase
    .from("information_schema.tables")
    .select("table_name")
    .eq("table_schema", "public")
    .eq("table_name", "activities_el_haouaria")
    .single()

  // Fetch El Haouaria activities if table exists
  let activities = []
  if (activitiesTableExists) {
    const { data, error } = await supabase.from("activities_el_haouaria").select("*").order("name")

    if (!error && data) {
      activities = data
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Link href="/regions">
          <Button variant="outline" size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">El Haouaria</h1>
        <Badge variant="outline" className="ml-2">
          North Tunisia
        </Badge>
      </div>

      <div className="relative w-full h-[300px] rounded-lg overflow-hidden mb-8">
        <Image
          src="/el-haouaria-cliffs.png?height=300&width=1200&query=el haouaria cliffs tunisia"
          alt="El Haouaria"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Discover El Haouaria</h2>
            <p className="max-w-2xl">
              Known for its dramatic cliffs, falcon training traditions, and beautiful Mediterranean views.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue={restaurants.length > 0 ? "restaurants" : "about"}>
        <TabsList className="mb-6">
          {restaurants.length > 0 && <TabsTrigger value="restaurants">Restaurants</TabsTrigger>}
          {activities.length > 0 && <TabsTrigger value="activities">Activities</TabsTrigger>}
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        {restaurants.length > 0 && (
          <TabsContent value="restaurants">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
            {restaurants.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p>No restaurants found for El Haouaria.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}

        {activities.length > 0 && (
          <TabsContent value="activities">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
            {activities.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p>No activities found for El Haouaria.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}

        <TabsContent value="map">
          <Card>
            <CardContent className="p-6">
              <CityMap
                city="El Haouaria"
                restaurants={restaurants}
                activities={activities}
                center={{ lat: 37.0566, lng: 11.0107 }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">About El Haouaria</h3>
              <p className="mb-4">
                El Haouaria is a coastal town located at the northeastern tip of the Cap Bon peninsula in Tunisia. The
                town is known for its dramatic cliffs, falcon training traditions, and beautiful Mediterranean views.
              </p>
              <p className="mb-4">
                One of the most notable features of El Haouaria is its annual falcon festival, which celebrates the
                ancient tradition of falcon training that has been practiced in the region for centuries. The town is
                also known for its proximity to the ruins of ancient quarries used by the Carthaginians and Romans.
              </p>
              <p>
                The surrounding area offers beautiful hiking opportunities along the coastal cliffs, with panoramic
                views of the Mediterranean Sea. The nearby beaches provide a perfect spot for relaxation and swimming
                during the summer months.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function RestaurantCard({ restaurant }: { restaurant: any }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative w-full h-[200px]">
        <Image
          src={`/cozy-italian-corner.png?height=200&width=400&query=restaurant ${restaurant.cuisine || ""} food ${restaurant.name}`}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{restaurant.name}</CardTitle>
          {restaurant.rating && (
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span>{restaurant.rating}</span>
            </div>
          )}
        </div>
        {restaurant.cuisine && (
          <CardDescription className="flex items-center">
            <Utensils className="h-3 w-3 mr-1" />
            {restaurant.cuisine}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-gray-700 line-clamp-3">{restaurant.description}</p>
        {restaurant.price_range && (
          <div className="flex items-center mt-2">
            <DollarSign className="h-3 w-3 text-green-600 mr-1" />
            <span className="text-sm text-gray-600">{restaurant.price_range}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        {restaurant.google_map_link && (
          <a
            href={restaurant.google_map_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline flex items-center"
          >
            <MapPin className="h-3 w-3 mr-1" />
            View on Google Maps
          </a>
        )}
      </CardFooter>
    </Card>
  )
}

function ActivityCard({ activity }: { activity: any }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative w-full h-[200px]">
        <Image
          src={
            activity.image_url ||
            `/activity-placeholder.png?height=200&width=400&query=activity ${activity.name} tunisia`
          }
          alt={activity.name}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{activity.name}</CardTitle>
        {activity.difficulty && (
          <CardDescription className="flex items-center">
            <Compass className="h-3 w-3 mr-1" />
            Difficulty: {activity.difficulty}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-gray-700 line-clamp-3">{activity.description}</p>
        {activity.duration && (
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-600">Duration: {activity.duration}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        {activity.google_map_link && (
          <a
            href={activity.google_map_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline flex items-center"
          >
            <MapPin className="h-3 w-3 mr-1" />
            View on Google Maps
          </a>
        )}
      </CardFooter>
    </Card>
  )
}
