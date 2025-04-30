import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Compass, Utensils } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface RegionPageProps {
  params: {
    slug: string
  }
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { slug } = params

  // First, try to fetch from regions table
  let { data: region, error } = await supabase.from("regions").select("*").eq("slug", slug).single()

  // If not found in regions table, try to find in governorates
  if (error || !region) {
    const { data: governorate, error: govError } = await supabase
      .from("governorates")
      .select("*")
      .eq("slug", slug)
      .single()

    if (govError || !governorate) {
      console.error("Region/Governorate not found:", slug)
      notFound()
    }

    region = governorate
  }

  // Fetch cities in this region/governorate
  let cities = []
  if (region) {
    const { data: citiesData } = await supabase
      .from("city")
      .select("*")
      .or(`region_id.eq.${region.id},governorate_id.eq.${region.id}`)
      .order("name")

    if (citiesData) {
      cities = citiesData
    }
  }

  // Fetch attractions for this region
  let attractions = []
  if (region) {
    const cityNames = cities.length > 0 ? cities.map((c) => `'${c.name}'`).join(",") : "''"
    const { data: attractionsData } = await supabase
      .from("attractions")
      .select("*")
      .or(`region.ilike.%${region.name}%,city.in.(${cityNames})`)
      .limit(6)

    if (attractionsData) {
      attractions = attractionsData
    }
  }

  // Fetch restaurants for this region
  let restaurants = []
  if (region) {
    const cityNames = cities.length > 0 ? cities.map((c) => `'${c.name}'`).join(",") : "''"
    const { data: restaurantsData } = await supabase
      .from("restaurants")
      .select("*")
      .or(`region.ilike.%${region.name}%,city.in.(${cityNames})`)
      .limit(6)

    if (restaurantsData) {
      restaurants = restaurantsData
    }
  }

  // Fetch activities for this region
  let activities = []
  if (region) {
    const cityNames = cities.length > 0 ? cities.map((c) => `'${c.name}'`).join(",") : "''"
    const { data: activitiesData } = await supabase
      .from("activities")
      .select("*")
      .or(`region.ilike.%${region.name}%,city.in.(${cityNames})`)
      .limit(6)

    if (activitiesData) {
      activities = activitiesData
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Region Header */}
        <div className="mb-8">
          <div className="relative h-[300px] w-full rounded-lg overflow-hidden mb-6">
            <Image
              src={
                region.image_url ||
                `/placeholder.svg?height=800&width=1200&query=${encodeURIComponent(region.name + " region Tunisia") || "/placeholder.svg"}`
              }
              alt={region.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl md:text-4xl font-bold">{region.name}</h1>
              </div>
            </div>
          </div>
          <p className="text-lg text-gray-700">
            {region.description || `Explore the beautiful region of ${region.name}.`}
          </p>
        </div>

        <Tabs defaultValue="cities" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="cities">Cities</TabsTrigger>
            <TabsTrigger value="attractions">Attractions</TabsTrigger>
            <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="cities">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities && cities.length > 0 ? (
                cities.map((city) => (
                  <Card key={city.id} className="overflow-hidden h-full flex flex-col">
                    <div className="relative h-48">
                      <Image
                        src={
                          city.hero_image_link ||
                          `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(city.name + " Tunisia") || "/placeholder.svg"}`
                        }
                        alt={city.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{city.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-600 line-clamp-3">
                        {city.about_city || `Explore the beautiful area of ${city.name}.`}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/cities/${city.slug}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          Explore {city.name}
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No cities found in this region</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="attractions">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {attractions && attractions.length > 0 ? (
                attractions.map((attraction) => (
                  <Card key={attraction.id} className="overflow-hidden h-full flex flex-col">
                    <div className="relative h-48">
                      <Image
                        src={
                          attraction.image_url ||
                          `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(attraction.name) || "/placeholder.svg"}`
                        }
                        alt={attraction.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        {attraction.name}
                      </CardTitle>
                      <CardDescription>{attraction.city}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-600 line-clamp-3">{attraction.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/attractions/${attraction.id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          Learn More
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No attractions found in this region</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="restaurants">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants && restaurants.length > 0 ? (
                restaurants.map((restaurant) => (
                  <Card key={restaurant.id} className="overflow-hidden h-full flex flex-col">
                    <div className="relative h-48">
                      <Image
                        src={
                          restaurant.image_url ||
                          `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(restaurant.name + " restaurant") || "/placeholder.svg"}`
                        }
                        alt={restaurant.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-primary" />
                        {restaurant.name}
                      </CardTitle>
                      <CardDescription>{restaurant.city}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-600 line-clamp-3">{restaurant.description}</p>
                      {restaurant.cuisine && (
                        <Badge variant="outline" className="mt-2">
                          {restaurant.cuisine}
                        </Badge>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Link href={`/restaurants/${restaurant.id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          Learn More
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No restaurants found in this region</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="activities">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities && activities.length > 0 ? (
                activities.map((activity) => (
                  <Card key={activity.id} className="overflow-hidden h-full flex flex-col">
                    <div className="relative h-48">
                      <Image
                        src={
                          activity.image_url ||
                          `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(activity.name + " activity") || "/placeholder.svg"}`
                        }
                        alt={activity.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Compass className="h-4 w-4 text-primary" />
                        {activity.name}
                      </CardTitle>
                      <CardDescription>{activity.city}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-600 line-clamp-3">{activity.description}</p>
                      {activity.duration && (
                        <Badge variant="outline" className="mt-2">
                          {activity.duration}
                        </Badge>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Link href={`/activities/${activity.id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          Learn More
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No activities found in this region</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
