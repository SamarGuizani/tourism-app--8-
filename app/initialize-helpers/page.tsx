"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function InitializeHelpersPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const initializeHelpers = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/create-table-exists-function")
      const data = await response.json()

      if (data.success) {
        setResult({ success: true, message: "Helper functions initialized successfully!" })
      } else {
        setResult({ success: false, message: `Error: ${data.error}` })
      }
    } catch (error) {
      setResult({ success: false, message: `Error: ${error}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Initialize Helper Functions</CardTitle>
          <CardDescription>
            This will create helper functions in your database to support the data aggregation features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Click the button below to create the necessary helper functions in your Supabase database. This only needs
            to be done once.
          </p>
          {result && (
            <div
              className={`p-3 rounded-md ${result.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
            >
              {result.message}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={initializeHelpers} disabled={loading} className="w-full">
            {loading ? "Initializing..." : "Initialize Helper Functions"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
