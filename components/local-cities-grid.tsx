"use client"

import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface City {
  id: string
  name: string
  slug: string
  region: string
  description: string
  hero_image: string
}

export default function LocalCitiesGrid() {
  const { user } = useAuth()
  const [localCities, setLocalCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLocalCities() {
      setLoading(true)
      setError(null)

      try {
        // Fetch cities added by locals
        const { data, error } = await supabase
          .from("cities")
          .select("*")
          .not("added_by", "is", null) // Filter out cities not added by locals
          .order("name")

        if (error) {
          throw new Error(`Failed to fetch local cities: ${error.message}`)
        }

        setLocalCities(data || [])
      } catch (err) {
        console.error("Error fetching local cities:", err)
        setError(`Error loading local cities: ${err instanceof Error ? err.message : "Unknown error"}`)
      } finally {
        setLoading(false)
      }
    }

    fetchLocalCities()
  }, [user])

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
      </div>
    )
  }

  if (localCities.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No cities added by locals yet.</p>
      </div>
    )
  }

  // Group cities by region
  const groupedCities = localCities.reduce((acc, city) => {
    if (!acc[city.region]) {
      acc[city.region] = []
    }
    acc[city.region].push(city)
    return acc
  }, {})

  return (
    <div className="space-y-8">
      {Object.entries(groupedCities).map(([region, cities]) => (
        <div key={region}>
          <h3 className="text-2xl font-bold mb-4">{region}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <Link key={city.id} href={`/cities/${city.slug}`} className="group">
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={city.hero_image || "/placeholder.svg"}
                      alt={city.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      {city.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3">{city.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Explore {city.name}
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
