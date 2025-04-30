"use client"

import { useState, useEffect } from "react"
import type { City } from "@/types/tourism"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, MapPin } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface CitiesGridProps {
  regionId?: string
}

export default function CitiesGrid({ regionId }: CitiesGridProps) {
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCities() {
      setLoading(true)
      try {
        let query = supabase.from("cities").select("*").order("name")

        if (regionId) {
          query = query.eq("region_id", regionId)
        }

        const { data, error } = await query

        if (error) {
          throw new Error(`Failed to fetch cities: ${error.message}`)
        }

        // Ensure we're working with an array and normalize the data
        const normalizedCities = Array.isArray(data)
          ? data.map((city) => ({
              ...city,
              // Ensure these fields exist with default values if they're missing
              description: city.description || "",
              image_url: city.image || null,
              population: city.population || null,
              attractions: Array.isArray(city.attractions) ? city.attractions : [],
            }))
          : []

        setCities(normalizedCities)
      } catch (err) {
        console.error("Error in fetchCities:", err)
        setError(`Error loading cities: ${err instanceof Error ? err.message : "Unknown error"}`)
      } finally {
        setLoading(false)
      }
    }

    fetchCities()
  }, [regionId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (cities.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No cities found. Try a different region.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Discover Cities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities && cities.length > 0 ? (
          cities.map((city) => (
            <Card key={city.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={
                    city.image_url ||
                    city.image ||
                    `/placeholder.svg?height=400&width=600&query=cityscape of ${city.name || "/placeholder.svg"}`
                  }
                  alt={city.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  {city.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  {city.region && (
                    <>
                      <MapPin className="h-4 w-4" />
                      <span className="mr-2">{city.region}</span>
                    </>
                  )}
                  {city.population ? (
                    <>
                      <Users className="h-4 w-4" />
                      {`${(city.population / 1000).toFixed(0)}K residents`}
                    </>
                  ) : (
                    <span className="text-muted-foreground">Vibrant city</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 mb-4">
                  {city.description ||
                    `Explore the charm and culture of ${city.name}, a beautiful city with unique attractions.`}
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/cities/${city.slug || city.id}`} className="w-full">
                  <button className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                    Visit {city.name}
                  </button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No cities found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
