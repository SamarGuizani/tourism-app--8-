"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

type Place = {
  id: string
  name: string
  description: string
  location?: string
  image_url?: string
}

export function PlacesList() {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchPlaces()

    // Set up realtime subscription
    const channel = supabase
      .channel("places-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "places",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setPlaces((current) => [...current, payload.new as Place])
          } else if (payload.eventType === "DELETE") {
            setPlaces((current) => current.filter((place) => place.id !== payload.old.id))
          } else if (payload.eventType === "UPDATE") {
            setPlaces((current) =>
              current.map((place) => (place.id === payload.new.id ? (payload.new as Place) : place)),
            )
          }
        },
      )
      .subscribe()

    return () => {
      supabase.channel("places-changes").unsubscribe()
    }
  }, [supabase])

  const fetchPlaces = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("places").select("*")

      if (error) {
        throw error
      }

      if (data) {
        setPlaces(data)
      }
    } catch (error) {
      console.error("Error fetching places:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("places").delete().match({ id })

      if (error) {
        throw error
      }

      setPlaces((current) => current.filter((place) => place.id !== id))
      router.refresh()
    } catch (error) {
      console.error("Error deleting place:", error)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-16 bg-gray-100"></CardHeader>
            <CardContent className="space-y-2">
              <div className="h-4 w-3/4 bg-gray-100"></div>
              <div className="h-4 w-full bg-gray-100"></div>
              <div className="h-4 w-1/2 bg-gray-100"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {places.length === 0 ? (
        <div className="col-span-full text-center">
          <p className="text-gray-500">No places found. Add some places to get started.</p>
        </div>
      ) : (
        places.map((place) => (
          <Card key={place.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{place.name}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(place.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{place.description}</p>
              {place.location && (
                <p className="mt-2 text-xs text-gray-500">
                  <span className="font-medium">Location:</span> {place.location}
                </p>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
