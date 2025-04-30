"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Guide {
  id: string
  name: string
  bio: string
  profile_image_url?: string
  photo_url?: string
  languages: string[]
  specialties: string[]
  phone_number?: string
  age?: number
  contact_email?: string
}

interface City {
  slug: string
  name: string
}

export default function GuidesByCity() {
  const [cities, setCities] = useState<City[]>([
    { slug: "tunis", name: "Tunis" },
    { slug: "sousse", name: "Sousse" },
    { slug: "sfax", name: "Sfax" },
    { slug: "djerba", name: "Djerba" },
    { slug: "hammamet", name: "Hammamet" },
  ])
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (selectedCity) {
      fetchGuidesByCity(selectedCity)
    }
  }, [selectedCity])

  const fetchGuidesByCity = async (citySlug: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/guides/by-city?city_slug=${citySlug}`)
      const data = await response.json()

      if (response.ok) {
        setGuides(data.guides || [])
      } else {
        console.error("Error fetching guides:", data.error)
        setGuides([])
      }
    } catch (error) {
      console.error("Failed to fetch guides:", error)
      setGuides([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Find Local Guides</h1>

      <div className="mb-8">
        <h2 className="text-lg font-medium mb-2">Select a City</h2>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Choose a city" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.slug} value={city.slug}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <p>Loading guides...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.length > 0
            ? guides.map((guide) => (
                <Card key={guide.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={
                            guide.photo_url ||
                            guide.profile_image_url ||
                            "/placeholder.svg?height=48&width=48&query=person"
                          }
                          alt={guide.name}
                        />
                        <AvatarFallback>{guide.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl">{guide.name}</CardTitle>
                        {guide.age && <CardDescription>Age: {guide.age}</CardDescription>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{guide.bio}</p>

                    {guide.languages && guide.languages.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold mb-1">Languages</h4>
                        <div className="flex flex-wrap gap-1">
                          {guide.languages.map((language, index) => (
                            <Badge key={index} variant="outline">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {guide.specialties && guide.specialties.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Specialties</h4>
                        <div className="flex flex-wrap gap-1">
                          {guide.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col items-start pt-0">
                    {guide.contact_email && (
                      <p className="text-sm">
                        <span className="font-medium">Email:</span> {guide.contact_email}
                      </p>
                    )}
                    {guide.phone_number && (
                      <p className="text-sm">
                        <span className="font-medium">Phone:</span> {guide.phone_number}
                      </p>
                    )}
                  </CardFooter>
                </Card>
              ))
            : selectedCity && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No guides found for this city.</p>
                </div>
              )}
        </div>
      )}
    </div>
  )
}
