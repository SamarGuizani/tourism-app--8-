import { CardContent } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowLeft } from "lucide-react"

interface AttractionPageProps {
  params: {
    id: string
  }
}

export default async function AttractionPage({ params }: AttractionPageProps) {
  const { id } = params

  // Try to fetch from the attractions table first
  let { data: attraction, error } = await supabase.from("attractions").select("*").eq("id", id).single()

  // If not found, try to fetch from city-specific attractions tables
  if (error || !attraction) {
    // Get all tables that start with attractions_
    const { data: tables } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .ilike("table_name", "attractions_%")

    // Try each table until we find the attraction
    if (tables) {
      for (const table of tables) {
        const tableName = table.table_name
        const { data, error: tableError } = await supabase.from(tableName).select("*").eq("id", id).single()

        if (!tableError && data) {
          attraction = data
          break
        }
      }
    }
  }

  if (!attraction) {
    console.error("Attraction not found:", id)
    notFound()
  }

  // Get the city data
  let city = null
  if (attraction.city) {
    const { data: cityData, error: cityError } = await supabase
      .from("city")
      .select("*")
      .eq("name", attraction.city)
      .single()

    if (!cityError) {
      city = cityData
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href={city ? `/cities/${city.slug}` : "/attractions"}
          className="flex items-center gap-2 mb-6 text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{city ? `Back to ${city.name}` : "Back to Attractions"}</span>
        </Link>

        <div className="relative h-[400px] w-full rounded-lg overflow-hidden mb-8">
          <Image
            src={
              attraction.image_url ||
              `/placeholder.svg?height=800&width=1200&query=${encodeURIComponent(attraction.name + " attraction") || "/placeholder.svg"}`
            }
            alt={attraction.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">{attraction.name}</h1>

        {attraction.city && (
          <div className="flex items-center gap-2 text-gray-600 mb-6">
            <MapPin className="h-5 w-5" />
            <span>{attraction.city}</span>
          </div>
        )}

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">About this Attraction</h2>
            <p className="text-gray-700 whitespace-pre-line">{attraction.description}</p>
          </CardContent>
        </Card>

        {/* Details Section */}
        {attraction.details && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="text-gray-700">
                {(() => {
                  try {
                    const details = JSON.parse(attraction.details)
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
                    return <p>{attraction.details}</p>
                  }
                })()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Map Link */}
        {attraction.google_map_link && (
          <div className="mb-8">
            <a href={attraction.google_map_link} target="_blank" rel="noopener noreferrer" className="w-full">
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
              Explore more attractions in {city.name}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
