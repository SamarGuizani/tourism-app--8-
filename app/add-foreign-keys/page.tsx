"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function AddForeignKeysPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const addForeignKeys = async () => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch("/api/add-foreign-keys")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add foreign keys")
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
          <CardTitle>Add Foreign Key Relationships</CardTitle>
          <CardDescription>
            This tool will add foreign key relationships between the restaurants/activities tables and the cities table.
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
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Foreign Keys Added</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 mt-2">
                  <li className={results.restaurants_fk ? "text-green-600" : "text-red-600"}>
                    Restaurants foreign key: {results.restaurants_fk ? "Added successfully" : "Failed to add"}
                  </li>
                  <li className={results.activities_fk ? "text-green-600" : "text-red-600"}>
                    Activities foreign key: {results.activities_fk ? "Added successfully" : "Failed to add"}
                  </li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={addForeignKeys} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding Foreign Keys...
              </>
            ) : (
              "Add Foreign Keys"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
