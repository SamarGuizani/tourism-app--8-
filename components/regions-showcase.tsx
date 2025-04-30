"use client"

import { useState, useEffect } from "react"
import type { Region } from "@/types/tourism"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ClientImage as Image } from "@/components/client-image"

export default function RegionsShowcase() {
  const [regions, setRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const initializeRegions = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/setup-regions")
      if (!response.ok) {
        throw new Error(`Failed to initialize regions: ${response.status}`)
      }
      // Refresh the page to show the new data
      router.refresh()
    } catch (err) {
      console.error("Error initializing regions:", err)
      setError(`Error initializing regions: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function fetchRegions() {
      setLoading(true)
      try {
        console.log("Fetching regions")
        const response = await fetch("/api/regions")
        console.log("Response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Error response:", errorText)
          throw new Error(`Failed to fetch regions: ${response.status} ${errorText}`)
        }

        const data = await response.json()
        console.log("Regions data received:", data)
        setRegions(Array.isArray(data) ? data : [])
        if (!data || (Array.isArray(data) && data.length === 0)) {
          console.warn("No regions data found. Consider initializing.")
        }
      } catch (err) {
        console.error("Error in fetchRegions:", err)
        setError(`Error loading regions: ${err instanceof Error ? err.message : "Unknown error"}`)
      } finally {
        setLoading(false)
      }
    }

    fetchRegions()
  }, [])

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
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={initializeRegions} className="bg-primary text-white">
          Initialize Regions Data
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Explore Regions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regions.map((region) => (
          <Card key={region.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 overflow-hidden">
              <Image
                src={
                  region.image_url || `/placeholder.svg?height=400&width=600&query=scenic landscape of ${region.name}`
                }
                alt={region.name}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {region.name}
              </CardTitle>
              <CardDescription>{region.country || "Explore this beautiful region"}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3">
                {region.description ||
                  `Discover the wonders and attractions of ${region.name}, a must-visit destination for travelers.`}
              </p>
            </CardContent>
            <CardFooter>
              <Link href={`/regions/${region.slug || region.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  Explore {region.name}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
