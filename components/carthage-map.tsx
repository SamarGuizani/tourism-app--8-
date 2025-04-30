"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface CarthageMapProps {
  restaurants: any[]
}

// Declare google variable
declare global {
  interface Window {
    google?: any
  }
}

export function CarthageMap({ restaurants }: CarthageMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false)

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
    if (mapLoaded && restaurants.length > 0) {
      // Initialize map
      const mapElement = document.getElementById("carthage-map")
      if (!mapElement) return

      const bounds = new window.google.maps.LatLngBounds()
      const map = new window.google.maps.Map(mapElement, {
        zoom: 15,
        center: { lat: 36.8525, lng: 10.323 }, // Center of Carthage
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        scrollwheel: false,
        draggable: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      })

      // Add markers for each restaurant
      restaurants.forEach((restaurant) => {
        let position

        // Try to extract coordinates from different possible formats
        if (restaurant.coordinates) {
          try {
            const coords =
              typeof restaurant.coordinates === "string" ? JSON.parse(restaurant.coordinates) : restaurant.coordinates

            position = {
              lat: Number.parseFloat(coords.latitude || coords.lat),
              lng: Number.parseFloat(coords.longitude || coords.lng),
            }
          } catch (e) {
            console.error("Error parsing coordinates:", e)
            return
          }
        } else {
          return
        }

        if (!position || isNaN(position.lat) || isNaN(position.lng)) {
          return
        }

        bounds.extend(position)

        const marker = new window.google.maps.Marker({
          position,
          map,
          title: restaurant.name,
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          },
        })

        // Add info window
        const infoContent = `
          <div style="max-width: 200px;">
            <h3 style="margin: 0 0 5px; font-size: 16px;">${restaurant.name}</h3>
            <p style="margin: 0 0 5px; font-size: 12px;">${restaurant.cuisine}</p>
            ${restaurant.description ? `<p style="margin: 0 0 5px; font-size: 12px;">${restaurant.description.substring(0, 100)}${restaurant.description.length > 100 ? "..." : ""}</p>` : ""}
            ${restaurant.price_range ? `<p style="margin: 0 0 5px; font-size: 12px;">Price: ${restaurant.price_range}</p>` : ""}
            ${restaurant.rating ? `<p style="margin: 0 0 5px; font-size: 12px;">Rating: ${restaurant.rating}</p>` : ""}
            ${restaurant.google_map_link ? `<a href="${restaurant.google_map_link}" target="_blank" style="font-size: 12px;">View on Google Maps</a>` : ""}
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
        if (map.getZoom() > 16) {
          map.setZoom(16)
        }
        window.google.maps.event.removeListener(listener)
      })
    }
  }, [mapLoaded, restaurants])

  if (!mapLoaded) {
    return <Skeleton className="h-[500px] w-full" />
  }

  return (
    <div>
      <div id="carthage-map" className="h-[500px] w-full rounded-md"></div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">About Carthage</h3>
        <p className="text-sm text-gray-700">
          Carthage is an ancient city located on the eastern side of the Lake of Tunis. Founded by the Phoenicians in
          the 9th century BC, it was once one of the most important trading centers in the Mediterranean. Today, it's a
          wealthy suburb of Tunis known for its archaeological sites, beautiful views, and excellent dining options.
        </p>
      </div>
    </div>
  )
}
