"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function MigrateCityDataPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const runMigration = async () => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch("/api/migrate-city-data")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to migrate city data")
      }

      setResults(data.results)
    } catch (err) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Migrate City-Specific Data</CardTitle>
          <CardDescription>
            This tool will copy data from city-specific tables (like restaurants_chebba) to the main tables
            (restaurants, activities).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {results && (
            <div className="space-y-4">
              <Alert className="mb-4">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Migration Complete</AlertTitle>
                <AlertDescription>The data migration has been completed.</AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Restaurants</h3>
                  <p>Successfully processed: {results.restaurants.success} cities</p>
                  {results.restaurants.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="text-red-500">Errors:</p>
                      <ul className="list-disc pl-5">
                        {results.restaurants.errors.map((err, i) => (
                          <li key={i}>
                            {err.city}: {err.error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Activities</h3>
                  <p>Successfully processed: {results.activities.success} cities</p>
                  {results.activities.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="text-red-500">Errors:</p>
                      <ul className="list-disc pl-5">
                        {results.activities.errors.map((err, i) => (
                          <li key={i}>
                            {err.city}: {err.error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={runMigration} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Migrating Data...
              </>
            ) : (
              "Start Migration"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
