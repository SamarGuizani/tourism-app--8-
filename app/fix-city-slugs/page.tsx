"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FixCitySlugsPage() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fixSlugs = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/fix-city-slugs")
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to fix city slugs")
      }

      setResults(data.results)
    } catch (err) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Fix City Slugs</CardTitle>
          <CardDescription>This utility fixes URL encoded slugs like "Ben%20arous" to "ben arous"</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fixSlugs} disabled={loading}>
            {loading ? "Fixing..." : "Fix City Slugs"}
          </Button>

          {error && <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">{error}</div>}

          {results.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Results:</h3>
              <ul className="space-y-2">
                {results.map((result, index) => (
                  <li key={index} className={`p-2 rounded ${result.success ? "bg-green-100" : "bg-red-100"}`}>
                    {result.success ? (
                      <>
                        Fixed: <strong>{result.slug}</strong> → <strong>{result.newSlug}</strong>
                      </>
                    ) : (
                      <>
                        Error fixing {result.slug}: {result.error}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
