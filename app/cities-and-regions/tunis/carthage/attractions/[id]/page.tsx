import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { CarthageAttraction } from "@/types/carthage"
import { ChevronLeft, MapPin } from "lucide-react"

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const attraction = await getAttraction(params.id)

  if (!attraction) {
    return {
      title: "Attraction Not Found | Tunisia Guide",
    }
  }

  return {
    title: `${attraction.name} | Carthage | Tunisia Guide`,
    description: attraction.description.substring(0, 160),
  }
}

async function getAttraction(id: string) {
  const supabase = createClient()

  // Try to fetch by ID first
  const { data, error } = await supabase.from("attractions_carthage").select("*").eq("id", id).single()

  if (error || !data) {
    // If not found by ID, try to fetch by name (converted to slug)
    const nameFromSlug = id.replace(/-/g, " ")

    const { data: dataByName, error: errorByName } = await supabase
      .from("attractions_carthage")
      .select("*")
      .ilike("name", nameFromSlug)
      .single()

    if (errorByName || !dataByName) {
      return null
    }

    return dataByName as CarthageAttraction
  }

  return data as CarthageAttraction
}

export default async function AttractionPage({ params }: PageProps) {
  const attraction = await getAttraction(params.id)

  if (!attraction) {
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
          <h1 className="text-3xl font-bold mb-2">{attraction.name}</h1>
          <div className="flex items-center gap-2 text-gray-500 mb-6">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{attraction.type}</span>
          </div>

          <div className="relative h-[400px] w-full mb-8 overflow-hidden rounded-xl">
            <img
              src={
                attraction.image || `/placeholder.svg?height=400&width=800&query=${encodeURIComponent(attraction.name)}`
              }
              alt={attraction.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">About {attraction.name}</h2>
            <p className="text-lg whitespace-pre-line">{attraction.description}</p>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Location</h3>

              {attraction.google_map_link ? (
                <a
                  href={attraction.google_map_link}
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
                  src={`/abstract-geometric-shapes.png?height=200&width=400&query=${encodeURIComponent("Map of " + attraction.name + " Carthage Tunisia")}`}
                  alt={`Map of ${attraction.name}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Visitor Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Opening Hours</p>
                  <p className="text-gray-600">8:30 AM - 5:30 PM (Winter)</p>
                  <p className="text-gray-600">8:00 AM - 7:00 PM (Summer)</p>
                </div>
                <div>
                  <p className="font-medium">Entrance Fee</p>
                  <p className="text-gray-600">10 DT (Carthage Pass: 30 DT for all sites)</p>
                </div>
                <div>
                  <p className="font-medium">Best Time to Visit</p>
                  <p className="text-gray-600">Early morning or late afternoon to avoid crowds and heat</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
