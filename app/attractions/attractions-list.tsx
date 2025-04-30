"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

type Attraction = {
  id: string
  name: string
  description: string
  source_table: string
  image_url?: string
}

export function AttractionsList({ attractions }: { attractions: Attraction[] }) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter attractions based on search term
  const filteredAttractions = attractions.filter(
    (attraction) =>
      attraction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attraction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attraction.source_table.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search attractions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={() => setSearchTerm("")}>
          Clear
        </Button>
      </div>

      {filteredAttractions.length === 0 ? (
        <p className="text-center py-8 text-gray-500">No attractions found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAttractions.map((attraction) => (
            <Card key={`${attraction.source_table}-${attraction.id}`} className="overflow-hidden">
              <div className="h-48 relative">
                <Image
                  src={attraction.image_url || "/placeholder.svg?height=200&width=400&query=tourist attraction"}
                  alt={attraction.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">{attraction.name}</h2>
                <p className="text-sm text-gray-600 mb-3">
                  {attraction.source_table.replace("attractions_", "").replace(/_/g, " ")}
                </p>
                <p className="text-gray-700 line-clamp-3">{attraction.description}</p>
                <div className="mt-4">
                  <Link href={`/attractions/${attraction.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
