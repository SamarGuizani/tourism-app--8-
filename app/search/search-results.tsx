"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-client"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface SearchResultsProps {
  query: string
}

export default function SearchResults({ query }: SearchResultsProps) {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function searchPlaces() {
      if (!query) {
        setResults([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const supabase = createClient()

        // Search in attractions
        const { data: attractionsData, error: attractionsError } = await supabase
          .from("attractions")
          .select("*")
          .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

        if (attractionsError) throw attractionsError

        // Search in restaurants
        const { data: restaurantsData, error: restaurantsError } = await supabase
          .from("restaurants")
          .select("*")
          .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

        if (restaurantsError) throw restaurantsError

        // Search in activities
        const { data: activitiesData, error: activitiesError } = await supabase
          .from("activities")
          .select("*")
          .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

        if (activitiesError) throw activitiesError

        // Combine results
        const combinedResults = [
          ...(attractionsData || []).map((item) => ({ ...item, type: "attraction" })),
          ...(restaurantsData || []).map((item) => ({ ...item, type: "restaurant" })),
          ...(activitiesData || []).map((item) => ({ ...item, type: "activity" })),
        ]

        setResults(combinedResults)
      } catch (err) {
        console.error("Search error:", err)
        setError("Failed to perform search. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    searchPlaces()
  }, [query])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  if (results.length === 0) {
    return <div className="p-4">No results found for "{query}"</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {results.map((item) => (
        <Card key={`${item.type}-${item.id}`} className="overflow-hidden">
          {item.image_url && (
            <div className="relative h-48 w-full">
              <Image src={item.image_url || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
            </div>
          )}
          <CardHeader>
            <CardTitle>{item.name}</CardTitle>
            <CardDescription>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)} in {item.region || "Tunisia"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3">{item.description}</p>
          </CardContent>
          <CardFooter>
            <Link href={`/${item.type}s/${item.slug || item.id}`} passHref>
              <Button>View Details</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
