"use client"

import { useState, useEffect } from "react"
import { getActivitiesByCity } from "@/lib/data-aggregator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Ticket } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Attraction {
  id: string
  name: string
  description: string
  location?: string
  image_url?: string
  activity_type?: string
  admission_fee?: string
  opening_hours?: string
}

interface CityAttractionsProps {
  citySlug: string
  cityName: string
  initialAttractions?: Attraction[]
}

export default function CityAttractions({ citySlug, cityName, initialAttractions = [] }: CityAttractionsProps) {
  const [attractions, setAttractions] = useState<Attraction[]>(initialAttractions)
  const [loading, setLoading] = useState(initialAttractions.length === 0)

  useEffect(() => {
    const fetchAttractions = async () => {
      if (initialAttractions.length > 0) return

      try {
        setLoading(true)
        const data = await getActivitiesByCity(citySlug)
        setAttractions(data)
      } catch (error) {
        console.error(`Error fetching attractions for ${cityName}:`, error)
      } finally {
        setLoading(false)
      }
    }

    fetchAttractions()
  }, [citySlug, cityName, initialAttractions])

  // Create a safe image URL with fallback
  const safeImageUrl = (url?: string, fallbackText?: string) => {
    if (!url || url.trim() === "") {
      return `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(fallbackText || "Attraction in Tunisia")}`
    }
    return url
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (attractions.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 mb-4">No attractions found for {cityName}</p>
        <Link href="/admin/attractions">
          <Button>Add an Attraction</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {attractions.map((attraction) => (
        <Card key={attraction.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-48">
            <Image
              src={safeImageUrl(attraction.image_url, attraction.name) || "/placeholder.svg"}
              alt={attraction.name}
              fill
              className="object-cover"
            />
            {attraction.activity_type && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-white/80 text-black backdrop-blur-sm">{attraction.activity_type}</Badge>
              </div>
            )}
          </div>
          <CardHeader>
            <CardTitle>{attraction.name}</CardTitle>
            {attraction.location && (
              <CardDescription className="flex items-center gap-1 mt-1">
                <MapPin className="h-4 w-4" />
                {attraction.location}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3 mb-3">{attraction.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {attraction.admission_fee && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Ticket className="h-3 w-3" />
                  {attraction.admission_fee}
                </div>
              )}
              {attraction.opening_hours && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {attraction.opening_hours}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/attractions/${attraction.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
