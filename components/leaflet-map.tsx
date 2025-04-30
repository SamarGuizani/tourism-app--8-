"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface LeafletMapProps {
  center: [number, number]
  zoom?: number
  markers?: Array<{
    position: [number, number]
    title: string
    description?: string
  }>
}

export default function LeafletMap({ center, zoom = 13, markers = [] }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    // Fix Leaflet default icon issue
    if (typeof window !== "undefined") {
      // @ts-ignore - Leaflet's icon import workaround
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/leaflet/marker-icon-2x.png",
        iconUrl: "/leaflet/marker-icon.png",
        shadowUrl: "/leaflet/marker-shadow.png",
      })
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current && !mapInstanceRef.current) {
      // Initialize the map
      const map = L.map(mapRef.current).setView(center, zoom)
      mapInstanceRef.current = map

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      // Add markers
      markers.forEach((marker) => {
        L.marker(marker.position)
          .addTo(map)
          .bindPopup(`<b>${marker.title}</b>${marker.description ? `<br>${marker.description}` : ""}`)
      })

      // Clean up on unmount
      return () => {
        map.remove()
        mapInstanceRef.current = null
      }
    }
  }, [center, zoom, markers])

  return <div ref={mapRef} className="h-[400px] w-full rounded-lg" />
}
