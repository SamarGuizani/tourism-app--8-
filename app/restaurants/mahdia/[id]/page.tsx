import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowLeft } from "lucide-react"
import { getImageUrl } from "@/lib/drive-utils"

export const dynamic = "force-dynamic"

export default async function MahdiaRestaurantDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  const { data: restaurant, error } = await supabase.from("mahdia_restaurants").select("*").eq("id", params.id).single()

  if (error || !restaurant) {
    console.error("Error fetching restaurant:", error)
    return notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <Link href="/cities-regions/mahdia-city" className="flex items-center mb-6 text-blue-600 hover:text-blue-800">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Mahdia
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-64 md:h-96 bg-gray-200 relative">
          <img
            src={
              restaurant.image_url
                ? getImageUrl(restaurant.image_url, restaurant.title)
                : `/abstract-geometric-shapes.png?height=800&width=1200&query=${encodeURIComponent(restaurant.title)}`
            }
            alt={restaurant.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold">{restaurant.title}</h1>
              <p className="text-gray-600 mt-1">{restaurant.type}</p>
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

          <div className="prose max-w-none">
            <p className="text-lg">{restaurant.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
