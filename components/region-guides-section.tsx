"use client"

import { useState, useEffect } from "react"
import { ClientImage as Image } from "@/components/client-image"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StarIcon, MapPin, Languages, DollarSign } from "lucide-react"
import { getCitiesByRegion } from "@/lib/region-data"

interface Guide {
  id: string
  user_id: string
  bio: string
  languages: string[]
  locations: string[]
  tourist_price: number
  local_price: number
  rating: number
  photo_url?: string
  name?: string
  email?: string
}

export default function RegionGuidesSection({ regionName }: { regionName: string }) {
  const [guides, setGuides] = useState<Guide[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGuides() {
      setIsLoading(true)
      setError(null)

      try {
        // Get all cities in this region
        const regionCities = getCitiesByRegion(regionName.toLowerCase().replace(/\s+/g, "-"))
        const citySlugs = regionCities.map((city) => city.slug)

        if (!citySlugs.length) {
          setGuides([])
          setIsLoading(false)
          return
        }

        // Fetch guides that have locations matching any of the city slugs
        const { data: guidesData, error: guidesError } = await supabase
          .from("guides")
          .select("*")
          .order("rating", { ascending: false })

        if (guidesError) {
          console.error("Error fetching guides:", guidesError)
          setError("Failed to load guides. Please try again later.")
          return
        }

        if (!guidesData || guidesData.length === 0) {
          setGuides([])
          setIsLoading(false)
          return
        }

        // Filter guides that have at least one location in this region
        const regionGuides = guidesData.filter((guide) => {
          return guide.locations.some((location) => citySlugs.includes(location))
        })

        // Now fetch user data separately for each guide
        const guidePromises = regionGuides.map(async (guide) => {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("name, email")
            .eq("id", guide.user_id)
            .single()

          if (userError) {
            console.warn(`Could not fetch user data for guide ${guide.id}:`, userError)
            return {
              ...guide,
              name: "Unknown Guide",
              email: null,
            }
          }

          return {
            ...guide,
            name: userData?.name,
            email: userData?.email,
          }
        })

        const guidesWithUserData = await Promise.all(guidePromises)
        setGuides(guidesWithUserData)
      } catch (err) {
        console.error("Error in fetchGuides:", err)
        setError("An unexpected error occurred. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchGuides()
  }, [regionName])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {guides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Card key={guide.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden">
                    <Image
                      src={
                        guide.photo_url ||
                        `/placeholder.svg?height=64&width=64&query=${encodeURIComponent(guide.name || "Guide")}`
                      }
                      alt={guide.name || "Guide"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{guide.name || "Local Guide"}</CardTitle>
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.round(guide.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm text-gray-600">{guide.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 line-clamp-3 mb-4">{guide.bio}</p>

                <div className="flex items-center gap-2 mb-2">
                  <Languages className="h-4 w-4 text-gray-500" />
                  <div className="flex flex-wrap gap-1">
                    {guide.languages.map((language) => (
                      <Badge key={language} variant="outline" className="text-xs">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div className="flex flex-wrap gap-1">
                    {guide.locations.length > 3 ? (
                      <>
                        {guide.locations.slice(0, 2).map((location) => (
                          <Badge key={location} variant="outline" className="text-xs">
                            {location.replace(/-/g, " ")}
                          </Badge>
                        ))}
                        <Badge variant="outline" className="text-xs">
                          +{guide.locations.length - 2} more
                        </Badge>
                      </>
                    ) : (
                      guide.locations.map((location) => (
                        <Badge key={location} variant="outline" className="text-xs">
                          {location.replace(/-/g, " ")}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-500">Tourist</p>
                    <div className="flex items-center justify-center">
                      <DollarSign className="h-3 w-3" />
                      <p className="font-semibold">{guide.tourist_price} DT/h</p>
                    </div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-500">Local</p>
                    <div className="flex items-center justify-center">
                      <DollarSign className="h-3 w-3" />
                      <p className="font-semibold">{guide.local_price} DT/h</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/book-guide/${guide.id}`} className="w-full">
                  <Button className="w-full">Book This Guide</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No guides available for {regionName} yet</p>
          <p className="text-sm text-gray-500 mb-6">
            Are you knowledgeable about {regionName}? Consider becoming a guide!
          </p>
          <Link href="/become-guide">
            <Button>Become a Guide</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
