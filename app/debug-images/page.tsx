import { supabase } from "@/lib/supabase"
import Image from "next/image"

export default async function DebugImagesPage() {
  // Fetch cities with their image URLs
  const { data: cities, error } = await supabase
    .from("city")
    .select("id, name, slug, hero_image_link, header_image_link")

  if (error) {
    return <div className="p-8">Error loading cities: {error.message}</div>
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Debug City Images</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cities.map((city) => (
          <div key={city.id} className="border rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-100">
              <h2 className="text-xl font-bold">{city.name}</h2>
              <p className="text-sm text-gray-500">Slug: {city.slug}</p>
            </div>

            <div className="p-4">
              <h3 className="font-medium mb-2">Hero Image:</h3>
              <p className="text-xs text-gray-500 mb-2 break-all">{city.hero_image_link || "No hero image"}</p>
              {city.hero_image_link ? (
                <div className="relative h-40 mb-4">
                  <Image
                    src={city.hero_image_link || "/placeholder.svg"}
                    alt={`${city.name} hero`}
                    fill
                    className="object-cover rounded"
                    onError={(e) => {
                      // @ts-ignore
                      e.target.src = `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(city.name)}`
                    }}
                  />
                </div>
              ) : (
                <div className="h-40 bg-gray-200 flex items-center justify-center rounded mb-4">
                  <span className="text-gray-500">No hero image</span>
                </div>
              )}

              <h3 className="font-medium mb-2">Header Image:</h3>
              <p className="text-xs text-gray-500 mb-2 break-all">{city.header_image_link || "No header image"}</p>
              {city.header_image_link ? (
                <div className="relative h-40">
                  <Image
                    src={city.header_image_link || "/placeholder.svg"}
                    alt={`${city.name} header`}
                    fill
                    className="object-cover rounded"
                    onError={(e) => {
                      // @ts-ignore
                      e.target.src = `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(city.name)}`
                    }}
                  />
                </div>
              ) : (
                <div className="h-40 bg-gray-200 flex items-center justify-center rounded">
                  <span className="text-gray-500">No header image</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t">
              <a
                href={`/cities/${city.slug}`}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View City Page
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
