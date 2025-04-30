"use client"

import { useState, useEffect } from "react"
import { getActivitiesByCity } from "@/lib/data-aggregator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Compass, Clock, BarChart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Activity {
  id: string
  name: string
  description: string
  location?: string
  image_url?: string
  duration?: string
  difficulty?: string
  type?: string
}

interface CityActivitiesProps {
  citySlug: string
  cityName: string
  initialActivities?: Activity[]
}

export default function CityActivities({ citySlug, cityName, initialActivities = [] }: CityActivitiesProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities)
  const [loading, setLoading] = useState(initialActivities.length === 0)

  useEffect(() => {
    const fetchActivities = async () => {
      if (initialActivities.length > 0) return

      try {
        setLoading(true)
        const data = await getActivitiesByCity(citySlug)
        setActivities(data)
      } catch (error) {
        console.error(`Error fetching activities for ${cityName}:`, error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [citySlug, cityName, initialActivities])

  // Create a safe image URL with fallback
  const safeImageUrl = (url?: string, fallbackText?: string) => {
    if (!url || url.trim() === "") {
      return `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(fallbackText || "Activity")}`
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

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 mb-4">No activities found for {cityName}</p>
        <Link href="/admin/activities">
          <Button>Add an Activity</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activities.map((activity) => (
        <Card key={activity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-48">
            <Image
              src={safeImageUrl(activity.image_url, activity.name) || "/placeholder.svg"}
              alt={activity.name}
              fill
              className="object-cover"
            />
          </div>
          <CardHeader>
            <CardTitle>{activity.name}</CardTitle>
            {activity.location && <CardDescription>{activity.location}</CardDescription>}
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3 mb-3">{activity.description}</p>
            <div className="flex flex-wrap gap-2">
              {activity.type && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Compass className="h-3 w-3" />
                  {activity.type}
                </Badge>
              )}
              {activity.duration && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activity.duration}
                </Badge>
              )}
              {activity.difficulty && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <BarChart className="h-3 w-3" />
                  {activity.difficulty}
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/activities/${activity.id}`} className="w-full">
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
