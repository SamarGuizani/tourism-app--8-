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

export default async function SidiBouSaidPage() {
  const supabase = createServerComponentClient({ cookies })

  // Check if restaurants_sidi_bou_said table exists
  const { data: tableExists } = await supabase
    .from("information_schema.tables")
    .select("table_name")
    .eq("table_schema", "public")
    .eq("table_name", "restaurants_sidi_bou_said")
    .single()

  // Fetch Sidi Bou Said restaurants if table exists
  let restaurants = []
  if (tableExists) {
    const { data, error } = await supabase.from("restaurants_sidi_bou_said").select("*").order("name")

    if (!error && data) {
      restaurants = data
    }
  }

  // Check if activities_sidi_bou_said table exists
  const { data: activitiesTableExists } = await supabase
    .from("information_schema.tables")
    .select("table_name")
    .eq("table_schema", "public")
    .eq("table_name", "activities_sidi_bou_said")
    .single()

  // Fetch Sidi Bou Said activities if table exists
  let activities = []
  if (activitiesTableExists) {
    const { data, error } = await supabase.from("activities_sidi_bou_said").select("*").order("name")

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
        <h1 className="text-3xl font-bold">Sidi Bou Said</h1>
        <Badge variant="outline" className="ml-2">
          North Tunisia
        </Badge>
      </div>

      <div className="relative w-full h-[300px] rounded-lg overflow-hidden mb-8">
        <Image
          src="/sidi-bou-said.png?height=300&width=1200&query=sidi bou said blue white buildings tunisia"
          alt="Sidi Bou Said"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Discover Sidi Bou Said</h2>
            <p className="max-w-2xl">
              A picturesque blue and white village perched on a cliff overlooking the Mediterranean Sea.
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
                  <p>No restaurants found for Sidi Bou Said.</p>
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
                  <p>No activities found for Sidi Bou Said.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}

        <TabsContent value="map">
          <Card>
            <CardContent className="p-6">
              <CityMap
                city="Sidi Bou Said"
                restaurants={restaurants}
                activities={activities}
                center={{ lat: 36.8687, lng: 10.3414 }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">About Sidi Bou Said</h3>
              <p className="mb-4">
                Sidi Bou Said is a picturesque town located about 20 km from Tunis, the capital of Tunisia. The town is
                famous for its distinctive blue and white architecture, which creates a stunning contrast against the
                Mediterranean Sea.
              </p>
              <p className="mb-4">
                Named after a 13th-century Sufi saint, Sidi Bou Said has been a popular destination for artists,
                writers, and musicians for decades. The town has inspired many famous artists, including Paul Klee and
                August Macke.
              </p>
              <p>
                Visitors to Sidi Bou Said can enjoy wandering through the narrow, winding streets, shopping for
                traditional crafts, and dining in cafes with panoramic views of the Gulf of Tunis. The town is also home
                to the Ennejma Ezzahra palace, which now houses the Centre for Arab and Mediterranean Music.
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
