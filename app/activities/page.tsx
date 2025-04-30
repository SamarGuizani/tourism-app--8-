"use client"

import { useState, useEffect } from "react"
import { getAllActivities } from "@/lib/data-aggregator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Compass, MapPin, Clock, BarChart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Activity {
  id: string
  name: string
  description: string
  location?: string
  city_name?: string
  city_slug?: string
  region?: string
  image_url?: string
  duration?: string
  difficulty?: string
  type?: string
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [uniqueRegions, setUniqueRegions] = useState<string[]>([])
  const [uniqueCities, setUniqueCities] = useState<string[]>([])
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([])
  const [uniqueDifficulties, setUniqueDifficulties] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getAllActivities()
        setActivities(data)
        setFilteredActivities(data)

        // Extract unique regions, cities, types, and difficulties
        const regions = Array.from(new Set(data.map((item) => item.region).filter(Boolean)))
        const cities = Array.from(new Set(data.map((item) => item.city_name).filter(Boolean)))
        const types = Array.from(new Set(data.map((item) => item.type).filter(Boolean)))
        const difficulties = Array.from(new Set(data.map((item) => item.difficulty).filter(Boolean)))

        setUniqueRegions(regions as string[])
        setUniqueCities(cities as string[])
        setUniqueTypes(types as string[])
        setUniqueDifficulties(difficulties as string[])
      } catch (error) {
        console.error("Error fetching activities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    // Filter activities based on search term and selected filters
    let filtered = activities

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (activity) =>
          activity.name?.toLowerCase().includes(term) ||
          activity.description?.toLowerCase().includes(term) ||
          activity.location?.toLowerCase().includes(term),
      )
    }

    if (selectedRegion !== "all") {
      filtered = filtered.filter((activity) => activity.region === selectedRegion)
    }

    if (selectedCity !== "all") {
      filtered = filtered.filter((activity) => activity.city_name === selectedCity)
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((activity) => activity.type === selectedType)
    }

    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((activity) => activity.difficulty === selectedDifficulty)
    }

    setFilteredActivities(filtered)
  }, [searchTerm, selectedRegion, selectedCity, selectedType, selectedDifficulty, activities])

  // Create a safe image URL with fallback
  const safeImageUrl = (url?: string, fallbackText?: string) => {
    if (!url || url.trim() === "") {
      return `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(fallbackText || "Activity")}`
    }
    return url
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Explore Activities</h1>
          <p className="text-gray-500">Discover exciting activities across Tunisia</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {uniqueRegions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {uniqueCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                {uniqueDifficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">No activities found matching your criteria</p>
              <Link href="/admin/activities">
                <Button>Add New Activity</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((activity) => (
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
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {activity.city_name || activity.location || "Unknown location"}
                    </CardDescription>
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
          )}
        </div>
      </div>
    </div>
  )
}
