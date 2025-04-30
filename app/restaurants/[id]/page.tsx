import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface RestaurantPageProps {
  params: {
    id: string
  }
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = params

  // Try to fetch from the restaurants table first
  let { data: restaurant, error } = await supabase.from("restaurants").select("*").eq("id", id).single()

  // If not found, try to fetch from city-specific restaurants tables
  if (error || !restaurant) {
    // Get all tables that start with restaurants_
    const { data: tables } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .ilike("table_name", "restaurants_%")

    // Try each table until we find the restaurant
    if (tables) {
      for (const table of tables) {
        const tableName = table.table_name
        const { data, error: tableError } = await supabase.from(tableName).select("*").eq("id", id).single()

        if (!tableError && data) {
          restaurant = data
          break
        }
      }
    }
  }

  if (!restaurant) {
    console.error("Restaurant not found:", id)
    notFound()
  }

  // Get the city data
  let city = null
  if (restaurant.city) {
    const { data: cityData, error: cityError } = await supabase
      .from("city")
      .select("*")
      .eq("name", restaurant.city)
      .single()

    if (!cityError) {
      city = cityData
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href={city ? `/cities/${city.slug}` : "/restaurants"}
          className="flex items-center gap-2 mb-6 text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{city ? `Back to ${city.name}` : "Back to Restaurants"}</span>
        </Link>

        <div className="relative h-[400px] w-full rounded-lg overflow-hidden mb-8">
          <Image
            src={
              restaurant.image_url ||
              `/placeholder.svg?height=800&width=1200&query=${encodeURIComponent(restaurant.name + " restaurant") || "/placeholder.svg"}`
            }
            alt={restaurant.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">{restaurant.name}</h1>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          {restaurant.city && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>{restaurant.city}</span>
            </div>
          )}

          {restaurant.cuisine && (
            <Badge variant="outline" className="text-sm">
              {restaurant.cuisine}
            </Badge>
          )}

          {restaurant.price_range && (
            <Badge variant="secondary" className="text-sm">
              {restaurant.price_range}
            </Badge>
          )}
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">About this Restaurant</h2>
            <p className="text-gray-700 whitespace-pre-line">{restaurant.description}</p>
          </CardContent>
        </Card>

        {/* Details Section */}
        {restaurant.details && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="text-gray-700">
                {(() => {
                  try {
                    const details = JSON.parse(restaurant.details)
                    return (
                      <div className="space-y-2">
                        {Object.entries(details).map(([key, value]) => (
                          <div key={key} className="grid grid-cols-3 gap-4">
                            <span className="font-medium capitalize">{key.replace(/_/g, " ")}</span>
                            <span className="col-span-2">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )
                  } catch (e) {
                    return <p>{restaurant.details}</p>
                  }
                })()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Map Link */}
        {restaurant.google_map_link && (
          <div className="mb-8">
            <a href={restaurant.google_map_link} target="_blank" rel="noopener noreferrer" className="w-full">
              <Button className="w-full">
                <MapPin className="h-5 w-5 mr-2" /> View on Map
              </Button>
            </a>
          </div>
        )}

        {/* Back to City Link */}
        {city && (
          <div className="text-center mt-8">
            <Link href={`/cities/${city.slug}`} className="text-primary hover:underline">
              Explore more restaurants in {city.name}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
