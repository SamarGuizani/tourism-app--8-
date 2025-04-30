"use client"
import dynamic from "next/dynamic"

// Dynamically import Leaflet with no SSR to avoid window is not defined errors
const LeafletMap = dynamic(() => import("@/components/leaflet-map"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full rounded-lg bg-gray-200"></div>,
})

interface CityMapProps {
  center: [number, number]
  zoom?: number
  markers?: Array<{
    position: [number, number]
    title: string
    description?: string
  }>
}

export function CityMap(props: CityMapProps) {
  return <LeafletMap {...props} />
}
