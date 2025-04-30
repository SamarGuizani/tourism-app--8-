"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { insertChebbaAttractions } from "@/lib/chebba-data"

export default function InitializeChebbaAttractionsPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  async function handleInitialize() {
    setLoading(true)
    try {
      const result = await insertChebbaAttractions()
      setResult(result)
    } catch (error) {
      console.error("Error initializing Chebba attractions:", error)
      setResult({ success: false, message: "Error initializing Chebba attractions", error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Initialize Chebba Attractions</CardTitle>
          <CardDescription>This will insert all Chebba attractions data into the database.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleInitialize} disabled={loading} className="mb-4">
            {loading ? "Initializing..." : "Initialize Chebba Attractions"}
          </Button>

          {result && (
            <div
              className={`p-4 rounded-md ${result.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
            >
              <p className="font-medium">{result.message}</p>
              {result.error && <pre className="mt-2 text-sm">{JSON.stringify(result.error, null, 2)}</pre>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
