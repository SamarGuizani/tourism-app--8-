"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SimpleDebugPage() {
  const [cities, setCities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchCities()
  }, [])

  async function fetchCities() {
    try {
      setLoading(true)
      setError(null)

      // Fetch all cities directly from the database
      const { data, error } = await supabase.from("cities").select("*")

      if (error) {
        throw error
      }

      setCities(data || [])
    } catch (err) {
      console.error("Error fetching cities:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  async function fetchCitiesFromAPI() {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/cities")
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setCities(data || [])
    } catch (err) {
      console.error("Error fetching cities from API:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Simple Database Debug</h1>

      <div className="flex gap-4 mb-6">
        <Button onClick={fetchCities} disabled={loading}>
          Fetch Cities Directly
        </Button>
        <Button onClick={fetchCitiesFromAPI} disabled={loading} variant="outline">
          Fetch Cities from API
        </Button>
      </div>

      {loading && <div className="text-center p-4">Loading...</div>}

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">Error: {error}</div>}

      <h2 className="text-xl font-semibold mb-4">Found {cities.length} Cities</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities.map((city) => (
          <Card key={city.id || Math.random()} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{city.name || "Unnamed City"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>ID:</strong> {city.id}
                </p>
                <p>
                  <strong>Slug:</strong> {city.slug || "No slug"}
                </p>
                <p>
                  <strong>Region:</strong> {city.region || "No region"}
                </p>
                <p>
                  <strong>Description:</strong> {city.description?.substring(0, 100) || "No description"}...
                </p>

                <div className="mt-4">
                  <h4 className="font-semibold">Raw Data:</h4>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-40">
                    {JSON.stringify(city, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {cities.length === 0 && !loading && (
        <div className="text-center p-8 bg-yellow-50 rounded-lg">
          <p className="text-yellow-600">No cities found in the database.</p>
        </div>
      )}
    </div>
  )
}
