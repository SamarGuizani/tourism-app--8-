import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowLeft, Clock, Instagram } from "lucide-react"
import { getImageUrl } from "@/lib/drive-utils"

export const dynamic = "force-dynamic"

export default async function ElHaouariaRestaurantDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  const { data: restaurant, error } = await supabase
    .from("el_haouaria_restaurants")
    .select("*")
    .eq("id", params.id)
    .single()

  if (error || !restaurant) {
    console.error("Error fetching restaurant:", error)
    return notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <Link href="/cities-regions/haouaria" className="flex items-center mb-6 text-blue-600 hover:text-blue-800">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to El Haouaria
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-64 md:h-96 bg-gray-200 relative">
          <img
            src={getImageUrl(restaurant.image_url, restaurant.title) || "/placeholder.svg"}
            alt={restaurant.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold">{restaurant.title}</h1>
              <p className="text-gray-600 mt-1">{restaurant.cuisine}</p>
            </div>
            {restaurant.google_map_link && (
              <a href={restaurant.google_map_link} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  View on Map
                </Button>
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Details</h2>
              <div className="space-y-2">
                {restaurant.location && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
                    <p>{restaurant.location}</p>
                  </div>
                )}
                {restaurant.opening_hours && (
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
                    <p>{restaurant.opening_hours}</p>
                  </div>
                )}
                {restaurant.price_range && (
                  <div className="flex items-start">
                    <span className="font-medium mr-2">Price Range:</span>
                    <p>{restaurant.price_range}</p>
                  </div>
                )}
                {restaurant.instagram_url && (
                  <div className="flex items-center">
                    <Instagram className="h-5 w-5 mr-2 text-gray-500" />
                    <a
                      href={restaurant.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Instagram
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div>
              {restaurant.description && (
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p>{restaurant.description}</p>
                </div>
              )}

              {restaurant.bon_plan && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Bon Plan</h2>
                  <p className="italic">{restaurant.bon_plan}</p>
                </div>
              )}
            </div>
          </div>

          {restaurant.standout_dish && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Standout Dish</h2>
              <p>{restaurant.standout_dish}</p>
            </div>
          )}

          {restaurant.ambiance && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Ambiance</h2>
              <p>{restaurant.ambiance}</p>
            </div>
          )}

          {restaurant.specifics && Object.keys(restaurant.specifics).length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Additional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(restaurant.specifics).map(([key, value]) => (
                  <div key={key} className="border-l-4 border-gray-300 pl-4">
                    <h3 className="font-medium capitalize">{key}</h3>
                    <p>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
