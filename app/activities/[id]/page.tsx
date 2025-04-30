import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowLeft, Clock, BarChart } from "lucide-react"
import Link from "next/link"

interface ActivityPageProps {
  params: {
    id: string
  }
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const { id } = params

  // Try to fetch from the activities table first
  let { data: activity, error } = await supabase.from("activities").select("*").eq("id", id).single()

  // If not found, try to fetch from city-specific activities tables
  if (error || !activity) {
    // Get all tables that start with activities_
    const { data: tables } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .ilike("table_name", "activities_%")

    // Try each table until we find the activity
    if (tables) {
      for (const table of tables) {
        const tableName = table.table_name
        const { data, error: tableError } = await supabase.from(tableName).select("*").eq("id", id).single()

        if (!tableError && data) {
          activity = data
          break
        }
      }
    }
  }

  if (!activity) {
    console.error("Activity not found:", id)
    notFound()
  }

  // Get the city data
  let city = null
  if (activity.city) {
    const { data: cityData, error: cityError } = await supabase
      .from("city")
      .select("*")
      .eq("name", activity.city)
      .single()

    if (!cityError) {
      city = cityData
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href={city ? `/cities/${city.slug}` : "/activities"}
          className="flex items-center gap-2 mb-6 text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{city ? `Back to ${city.name}` : "Back to Activities"}</span>
        </Link>

        <div className="relative h-[400px] w-full rounded-lg overflow-hidden mb-8">
          <Image
            src={
              activity.image_url ||
              `/placeholder.svg?height=800&width=1200&query=${encodeURIComponent(activity.name + " activity") || "/placeholder.svg"}`
            }
            alt={activity.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">{activity.name}</h1>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          {activity.city && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>{activity.city}</span>
            </div>
          )}

          {activity.duration && (
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-5 w-5" />
              <span>{activity.duration}</span>
            </div>
          )}

          {activity.difficulty && (
            <div className="flex items-center gap-2 text-gray-600">
              <BarChart className="h-5 w-5" />
              <span>Difficulty: {activity.difficulty}</span>
            </div>
          )}
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">About this Activity</h2>
            <p className="text-gray-700 whitespace-pre-line">{activity.description}</p>
          </CardContent>
        </Card>

        {/* Details Section */}
        {activity.details && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="text-gray-700">
                {(() => {
                  try {
                    const details = JSON.parse(activity.details)
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
                    return <p>{activity.details}</p>
                  }
                })()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Map Link */}
        {activity.google_map_link && (
          <div className="mb-8">
            <a href={activity.google_map_link} target="_blank" rel="noopener noreferrer" className="w-full">
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
              Explore more activities in {city.name}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
