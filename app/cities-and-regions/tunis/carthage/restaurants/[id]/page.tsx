import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { CarthageRestaurant } from "@/types/carthage"
import { ChevronLeft, MapPin, Clock, DollarSign, Utensils } from "lucide-react"

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const restaurant = await getRestaurant(params.id)

  if (!restaurant) {
    return {
      title: "Restaurant Not Found | Tunisia Guide",
    }
  }

  return {
    title: `${restaurant.name} | Carthage | Tunisia Guide`,
    description: `${restaurant.name} - ${restaurant.cuisine} restaurant in Carthage, Tunisia`,
  }
}

async function getRestaurant(id: string) {
  const supabase = createClient()

  // Try to fetch by ID first
  const { data, error } = await supabase.from("restaurants_carthage").select("*").eq("id", id).single()

  if (error || !data) {
    // If not found by ID, try to fetch by name (converted to slug)
    const nameFromSlug = id.replace(/-/g, " ")

    const { data: dataByName, error: errorByName } = await supabase
      .from("restaurants_carthage")
      .select("*")
      .ilike("name", nameFromSlug)
      .single()

    if (errorByName || !dataByName) {
      return null
    }

    return dataByName as CarthageRestaurant
  }

  return data as CarthageRestaurant
}

export default async function RestaurantPage({ params }: PageProps) {
  const restaurant = await getRestaurant(params.id)

  if (!restaurant) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/cities-and-regions/tunis/carthage">
          <Button variant="ghost" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Carthage
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{restaurant.name}</h1>
            {restaurant.rating && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                ★ {restaurant.rating}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              <Utensils className="h-3 w-3" />
              {restaurant.cuisine}
            </span>

            {restaurant.price_range && (
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {restaurant.price_range}
              </span>
            )}

            {restaurant.opening_hours && (
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {restaurant.opening_hours}
              </span>
            )}
          </div>

          <div className="relative h-[400px] w-full mb-8 overflow-hidden rounded-xl">
            <img
              src={`/abstract-geometric-shapes.png?height=400&width=800&query=${encodeURIComponent(restaurant.name + " restaurant Carthage")}`}
              alt={restaurant.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">About {restaurant.name}</h2>

            {restaurant.comment ? (
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <p className="text-lg italic">"{restaurant.comment}"</p>
              </div>
            ) : (
              <p className="text-lg">
                {restaurant.name} is a {restaurant.cuisine.toLowerCase()} restaurant located in Carthage, Tunisia.
                {restaurant.price_range ? ` It offers meals in the price range of ${restaurant.price_range}.` : ""}
              </p>
            )}

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-3">What to Expect</h3>
              <ul className="space-y-2">
                <li>Authentic {restaurant.cuisine.toLowerCase()} cuisine</li>
                <li>Located in the historic area of Carthage</li>
                <li>Friendly service and welcoming atmosphere</li>
                {restaurant.price_range && <li>Prices in the range of {restaurant.price_range}</li>}
              </ul>
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Location</h3>

              {restaurant.google_map_link ? (
                <a
                  href={restaurant.google_map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <MapPin className="h-5 w-5" />
                  View on Google Maps
                </a>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin className="h-5 w-5" />
                  Carthage, Tunisia
                </div>
              )}

              <div className="mt-4 h-[200px] w-full overflow-hidden rounded-lg">
                <img
                  src={`/abstract-geometric-shapes.png?height=200&width=400&query=${encodeURIComponent("Map of " + restaurant.name + " Carthage Tunisia")}`}
                  alt={`Map of ${restaurant.name}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                {restaurant.opening_hours && (
                  <div>
                    <p className="font-medium">Opening Hours</p>
                    <p className="text-gray-600">{restaurant.opening_hours}</p>
                  </div>
                )}
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-gray-600">+216 XX XXX XXX</p>
                </div>
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-gray-600">Carthage, Tunisia</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
