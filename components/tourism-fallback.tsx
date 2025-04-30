"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Building2 } from "lucide-react"

export default function TourismFallback() {
  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Sample Tourism Data</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          It looks like we couldn't connect to your database or no data was found. Here's some sample content to show
          how the components will look when data is available.
        </p>
      </div>

      <h3 className="text-2xl font-bold mb-6">Sample Regions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {[
          { name: "Mediterranean Coast", country: "Spain" },
          { name: "Alpine Mountains", country: "Switzerland" },
          { name: "Coastal Islands", country: "Greece" },
        ].map((region, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 overflow-hidden">
              <img
                src={`/mountain-lake-vista.png?height=400&width=600&query=scenic landscape of ${region.name}`}
                alt={region.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {region.name}
              </CardTitle>
              <CardDescription>{region.country}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3">
                Discover the wonders and attractions of {region.name}, a must-visit destination for travelers.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Explore {region.name}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <h3 className="text-2xl font-bold mb-6">Sample Cities</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: "Barcelona", population: 1620000 },
          { name: "Zurich", population: 402762 },
          { name: "Santorini", population: 15550 },
        ].map((city, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 overflow-hidden">
              <img
                src={`/vibrant-cityscape.png?height=400&width=600&query=cityscape of ${city.name}`}
                alt={city.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                {city.name}
              </CardTitle>
              <CardDescription>{(city.population / 1000).toFixed(0)}K residents</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3">
                Explore the charm and culture of {city.name}, a beautiful city with unique attractions.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Visit {city.name}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
