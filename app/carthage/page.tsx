import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MapPin, Star, DollarSign, Utensils } from "lucide-react"
import { CarthageMap } from "@/components/carthage-map"

export default async function CarthagePage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch Carthage restaurants
  const { data: restaurants, error } = await supabase
    .from("restaurants_carthage")
    .select("*")
    .order("rating", { ascending: false })

  if (error) {
    console.error("Error fetching Carthage restaurants:", error)
    return notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Link href="/dashboard">
          <Button variant="outline" size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Carthage</h1>
        <Badge variant="outline" className="ml-2">
          Tunisia
        </Badge>
      </div>

      <div className="relative w-full h-[300px] rounded-lg overflow-hidden mb-8">
        <Image src="/carthage-coastline.png" alt="Carthage" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Discover Carthage</h2>
            <p className="max-w-2xl">
              Ancient ruins, beautiful Mediterranean views, and delicious cuisine await in this historic Tunisian city.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="restaurants">
        <TabsList className="mb-6">
          <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>

        <TabsContent value="restaurants">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardContent className="p-6">
              <CarthageMap restaurants={restaurants} />
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
          src={`/cozy-italian-corner.png?height=200&width=400&query=restaurant ${restaurant.cuisine} food ${restaurant.name}`}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{restaurant.name}</CardTitle>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span>{restaurant.rating}</span>
          </div>
        </div>
        <CardDescription className="flex items-center">
          <Utensils className="h-3 w-3 mr-1" />
          {restaurant.cuisine}
        </CardDescription>
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
