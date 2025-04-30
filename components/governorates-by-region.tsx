"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase-client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface GovernoratesByRegionProps {
  regionSlug: string
}

export default function GovernoratesByRegion({ regionSlug }: GovernoratesByRegionProps) {
  const [governorates, setGovernorates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [regionName, setRegionName] = useState<string>("")

  useEffect(() => {
    async function fetchGovernorates() {
      setLoading(true)
      setError(null)

      try {
        const supabase = createClient()

        // First, get the region name
        const { data: regionData, error: regionError } = await supabase
          .from("regions")
          .select("name")
          .eq("slug", regionSlug)
          .single()

        if (regionError) throw regionError

        if (regionData) {
          setRegionName(regionData.name)
        }

        // Then get cities/governorates in this region
        const { data: citiesData, error: citiesError } = await supabase
          .from("cities")
          .select("*")
          .eq("region_id", (await supabase.from("regions").select("id").eq("slug", regionSlug).single()).data?.id)
          .order("name")

        if (citiesError) throw citiesError

        setGovernorates(citiesData || [])
      } catch (err) {
        console.error("Error fetching governorates:", err)
        setError("Failed to load governorates. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (regionSlug) {
      fetchGovernorates()
    }
  }, [regionSlug])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
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
      </div>
    )
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  if (governorates.length === 0) {
    return (
      <div className="p-4">
        <h2 className="mb-4 text-2xl font-bold">Governorates in {regionName || regionSlug}</h2>
        <p>No governorates found for this region.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Governorates in {regionName}</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {governorates.map((governorate) => (
          <Card key={governorate.id} className="overflow-hidden">
            {governorate.image_url && (
              <div className="relative h-48 w-full">
                <Image
                  src={governorate.image_url || "/placeholder.svg"}
                  alt={governorate.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle>{governorate.name}</CardTitle>
              <CardDescription>
                Explore {governorate.name} in {regionName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3">
                {governorate.description || `Discover the beauty and attractions of ${governorate.name}.`}
              </p>
            </CardContent>
            <CardFooter>
              <Link href={`/cities/${governorate.slug}`} passHref>
                <Button>Explore {governorate.name}</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
