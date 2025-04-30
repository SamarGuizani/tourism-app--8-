"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateTableStructureFunctionPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)

  async function handleCreateFunction() {
    try {
      setLoading(true)
      const response = await fetch("/api/create-table-structure-function")
      const data = await response.json()

      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Table Structure Function</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This will create a PostgreSQL function that allows us to query the structure of database tables. This is
            useful for debugging database issues.
          </p>

          <Button onClick={handleCreateFunction} disabled={loading}>
            {loading ? "Creating..." : "Create Function"}
          </Button>

          {result && (
            <div className={`mt-4 p-4 rounded ${result.success ? "bg-green-50" : "bg-red-50"}`}>
              {result.success ? (
                <p className="text-green-600">{result.message}</p>
              ) : (
                <p className="text-red-600">Error: {result.error}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
