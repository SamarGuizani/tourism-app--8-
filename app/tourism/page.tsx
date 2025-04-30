"use client"

import { useState, useEffect } from "react"
import RegionsShowcase from "@/components/regions-showcase"
import CitiesGrid from "@/components/cities-grid"
import TourismFallback from "@/components/tourism-fallback"
import LocalCitiesGrid from "@/components/local-cities-grid" // Import the new component

export default function TourismPage() {
  const [hasError, setHasError] = useState(false)

  // Listen for errors from child components
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Error caught:", event.error)
      setHasError(true)
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Amazing Destinations</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Discover beautiful regions and cities around the world
          </p>
        </div>
      </div>

      {hasError ? (
        <TourismFallback />
      ) : (
        <>
          <RegionsShowcase />
          <div className="bg-gray-100 py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8 text-center">Popular Cities</h2>
              <CitiesGrid />
            </div>
          </div>
          <div className="bg-gray-100 py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8 text-center">Cities Added By Locals</h2>
              <LocalCitiesGrid /> {/* Render the new component */}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
