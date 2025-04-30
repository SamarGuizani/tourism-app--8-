"use client"

import { useSearchParams } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { StarIcon } from "lucide-react"
import { useEffect, useState } from "react"

export default function GuideListingPage() {
  const searchParams = useSearchParams()
  const city = searchParams.get("city")
  const attraction = searchParams.get("attraction")
  const restaurant = searchParams.get("restaurant")
  const activity = searchParams.get("activity")
  const supabase = createServerSupabaseClient()

  const [guides, setGuides] = useState([])
  const [cityName, setCityName] = useState("")
  const [locationName, setLocationName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch guides
        let guidesQuery = supabase.from("guides").select("*, user:users(*)").returns<any[]>()

        if (city) {
          guidesQuery = guidesQuery.contains("locations", [city])
        }

        const { data: guidesData, error: guidesError } = await guidesQuery

        if (guidesError) {
          console.error("Error fetching guides:", guidesError)
          throw guidesError
        }

        setGuides(guidesData || [])

        // Fetch city name if city slug is provided
        if (city) {
          const { data: cityData, error: cityError } = await supabase
            .from("cities")
            .select("name")
            .eq("slug", city)
            .single()

          if (cityError) {
            console.error("Error fetching city name:", cityError)
          }

          if (cityData) {
            setCityName(cityData.name)
          }
        }

        // Fetch attraction/restaurant/activity name if ID is provided
        if (attraction) {
          const { data: attractionData, error: attractionError } = await supabase
            .from("attractions")
            .select("name")
            .eq("id", attraction)
            .single()

          if (attractionError) {
            console.error("Error fetching attraction name:", attractionError)
          }

          if (attractionData) {
            setLocationName(attractionData.name)
          }
        } else if (restaurant) {
          const { data: restaurantData, error: restaurantError } = await supabase
            .from("restaurants")
            .select("name")
            .eq("id", restaurant)
            .single()

          if (restaurantError) {
            console.error("Error fetching restaurant name:", restaurantError)
          }

          if (restaurantData) {
            setLocationName(restaurantData.name)
          }
        } else if (activity) {
          const { data: activityData, error: activityError } = await supabase
            .from("activities")
            .select("name")
            .eq("id", activity)
            .single()

          if (activityData) {
            setLocationName(activityData.name)
          }
        }
      } catch (error) {
        console.error("Error in fetchData:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [city, attraction, restaurant, activity, supabase])

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-2 text-center">Find a Guide</h1>

      {(cityName || locationName) && (
        <p className="text-center text-gray-600 mb-8">{locationName ? `For ${locationName}` : `In ${cityName}`}</p>
      )}

      {loading ? (
        <p>Loading guides...</p>
      ) : guides && guides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Card key={guide.id}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${guide.user?.name}`}
                    alt={guide.user?.name || "Guide"}
                  />
                  <AvatarFallback>{guide.user?.name?.charAt(0) || "G"}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{guide.user?.name}</CardTitle>
                  <CardDescription>{guide.languages.join(", ")}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-2">
                  <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                  <span>{guide.rating.toFixed(1)}</span>
                </div>
                <p className="text-sm text-gray-700 mb-4">{guide.bio}</p>
                <div className="flex justify-between text-sm">
                  <span>Tourist: {guide.tourist_price} DT/hour</span>
                  <span>Local: {guide.local_price} DT/hour</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/book-guide/${guide.id}?${searchParams.toString()}`} className="w-full">
                  <Button className="w-full">Book This Guide</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-6">No guides available for this location</p>
          <Link href="/become-guide">
            <Button>Become a Guide</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
