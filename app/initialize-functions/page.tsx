"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function InitializeFunctionsPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)

  const initializeFunctions = async () => {
    setLoading(true)
    setError(null)
    setResults({})

    try {
      // Create table structure function
      const tableStructureResponse = await fetch("/api/create-table-structure-function")
      const tableStructureData = await tableStructureResponse.json()
      setResults((prev) => ({ ...prev, tableStructure: tableStructureResponse.ok }))

      if (!tableStructureResponse.ok) {
        throw new Error(tableStructureData.error || "Failed to create table structure function")
      }

      // Create table exists function
      const tableExistsResponse = await fetch("/api/create-table-exists-function")
      const tableExistsData = await tableExistsResponse.json()
      setResults((prev) => ({ ...prev, tableExists: tableExistsResponse.ok }))

      if (!tableExistsResponse.ok) {
        throw new Error(tableExistsData.error || "Failed to create table exists function")
      }

      // Add more function initializations here if needed
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
          <CardTitle>Initialize Database Functions</CardTitle>
          <CardDescription>
            This tool will create necessary SQL functions in your database to support the application.
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

          {Object.keys(results).length > 0 && (
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Initialization Results</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 mt-2">
                  {Object.entries(results).map(([name, success]) => (
                    <li key={name} className={success ? "text-green-600" : "text-red-600"}>
                      {name}: {success ? "Success" : "Failed"}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={initializeFunctions} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Initializing Functions...
              </>
            ) : (
              "Initialize Functions"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
