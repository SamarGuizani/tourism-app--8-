"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface MapViewProps {
  tables: string[]
}

interface Location {
  id: string
  name: string
  latitude: number
  longitude: number
  type: string
  tableName: string
  description?: string
  google_map_link?: string
}

// Declare google variable
declare global {
  interface Window {
    google?: any
  }
}

export function MapView({ tables }: MapViewProps) {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [mapLoaded, setMapLoaded] = useState(false)

  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchLocations() {
      setLoading(true)
      const allLocations: Location[] = []

      for (const tableName of tables) {
        const { data, error } = await supabase.from(tableName).select("*")

        if (error) {
          console.error(`Error fetching data from ${tableName}:`, error)
          continue
        }

        if (!data || data.length === 0) continue

        // Process each row to extract location data
        for (const row of data) {
          let latitude: number | null = null
          let longitude: number | null = null

          // Try to extract coordinates from different possible formats
          if (row.coordinates) {
            try {
              const coords = typeof row.coordinates === "string" ? JSON.parse(row.coordinates) : row.coordinates

              latitude = Number.parseFloat(coords.latitude || coords.lat)
              longitude = Number.parseFloat(coords.longitude || coords.lng)
            } catch (e) {
              console.error("Error parsing coordinates:", e)
            }
          } else if (row.latitude && row.longitude) {
            latitude = Number.parseFloat(row.latitude)
            longitude = Number.parseFloat(row.longitude)
          }

          // Only add locations with valid coordinates
          if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
            allLocations.push({
              id: row.id,
              name: row.name || "Unnamed Location",
              latitude,
              longitude,
              type: tableName.startsWith("restaurants_")
                ? "restaurant"
                : tableName.startsWith("activities_")
                  ? "activity"
                  : "other",
              tableName,
              description: row.description,
              google_map_link: row.google_map_link,
            })
          }
        }
      }

      setLocations(allLocations)
      setLoading(false)
    }

    fetchLocations()
  }, [tables, supabase])

  useEffect(() => {
    // Load Google Maps script
    if (!window.google && !document.getElementById("google-maps-script")) {
      const script = document.createElement("script")
      script.id = "google-maps-script"
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => setMapLoaded(true)
      document.head.appendChild(script)
    } else if (window.google) {
      setMapLoaded(true)
    }

    return () => {
      const script = document.getElementById("google-maps-script")
      if (script) {
        script.remove()
      }
    }
  }, [])

  useEffect(() => {
    if (mapLoaded && !loading && locations.length > 0) {
      // Initialize map
      const mapElement = document.getElementById("map")
      if (!mapElement) return

      const bounds = new window.google.maps.LatLngBounds()
      const map = new window.google.maps.Map(mapElement, {
        zoom: 7,
        center: { lat: 34.0, lng: 9.0 }, // Center of Tunisia
      })

      // Add markers for each location
      locations.forEach((location) => {
        const position = { lat: location.latitude, lng: location.longitude }
        bounds.extend(position)

        const marker = new window.google.maps.Marker({
          position,
          map,
          title: location.name,
          icon: {
            url:
              location.type === "restaurant"
                ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
                : location.type === "activity"
                  ? "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                  : "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
          },
        })

        // Add info window
        const infoContent = `
          <div style="max-width: 200px;">
            <h3 style="margin: 0 0 5px; font-size: 16px;">${location.name}</h3>
            <p style="margin: 0 0 5px; font-size: 12px;">${location.type}</p>
            ${location.description ? `<p style="margin: 0 0 5px; font-size: 12px;">${location.description.substring(0, 100)}${location.description.length > 100 ? "..." : ""}</p>` : ""}
            ${location.google_map_link ? `<a href="${location.google_map_link}" target="_blank" style="font-size: 12px;">View on Google Maps</a>` : ""}
          </div>
        `

        const infoWindow = new window.google.maps.InfoWindow({
          content: infoContent,
        })

        marker.addListener("click", () => {
          infoWindow.open(map, marker)
        })
      })

      // Fit map to bounds
      map.fitBounds(bounds)

      // Adjust zoom if too zoomed in
      const listener = window.google.maps.event.addListener(map, "idle", () => {
        if (map.getZoom() > 15) {
          map.setZoom(15)
        }
        window.google.maps.event.removeListener(listener)
      })
    }
  }, [mapLoaded, loading, locations])

  if (loading) {
    return <Skeleton className="h-[600px] w-full" />
  }

  if (locations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>No locations with map data found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div id="map" className="h-[600px] w-full rounded-md"></div>
      <div className="mt-4 flex items-center justify-center space-x-4">
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
          <span className="text-sm">Restaurants</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
          <span className="text-sm">Activities</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
          <span className="text-sm">Other</span>
        </div>
      </div>
    </div>
  )
}
