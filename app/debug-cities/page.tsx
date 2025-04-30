"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugCitiesPage() {
  const [cities, setCities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tableStructure, setTableStructure] = useState<any[]>([])

  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchCities() {
      try {
        setLoading(true)

        // Fetch all cities directly from the database
        const { data, error } = await supabase.from("cities").select("*")

        if (error) throw error

        setCities(data || [])

        // Get table structure
        const { data: structureData, error: structureError } = await supabase
          .rpc("get_table_structure", { table_name: "cities" })
          .select("*")

        if (!structureError && structureData) {
          setTableStructure(structureData)
        }
      } catch (err) {
        console.error("Error fetching cities:", err)
        setError(err instanceof Error ? err.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchCities()
  }, [supabase])

  if (loading) {
    return <div className="p-8 text-center">Loading cities data...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Debug Cities Data</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Cities Table Structure</h2>
        {tableStructure.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Column Name</th>
                  <th className="border p-2">Data Type</th>
                  <th className="border p-2">Is Nullable</th>
                </tr>
              </thead>
              <tbody>
                {tableStructure.map((column, index) => (
                  <tr key={index} className="border-b">
                    <td className="border p-2">{column.column_name}</td>
                    <td className="border p-2">{column.data_type}</td>
                    <td className="border p-2">{column.is_nullable ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Could not retrieve table structure</p>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-4">Found {cities.length} Cities in Database</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities.map((city) => (
          <Card key={city.id} className="overflow-hidden">
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
                  <strong>Region ID:</strong> {city.region_id || "No region ID"}
                </p>
                <p>
                  <strong>Description:</strong> {city.description?.substring(0, 100) || "No description"}...
                </p>
                <p>
                  <strong>Created At:</strong> {city.created_at || "Unknown"}
                </p>

                <div className="mt-4">
                  <h4 className="font-semibold">Raw Data:</h4>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{JSON.stringify(city, null, 2)}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {cities.length === 0 && (
        <div className="text-center p-8 bg-yellow-50 rounded-lg">
          <p className="text-yellow-600">No cities found in the database.</p>
        </div>
      )}
    </div>
  )
}
