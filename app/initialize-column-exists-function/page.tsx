"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"

export default function InitializeColumnExistsFunctionPage() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)

  const handleInitialize = async () => {
    setIsInitializing(true)
    setResult(null)

    try {
      const response = await fetch("/api/create-column-exists-function")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, error: error.message })
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Initialize Column Exists Function</CardTitle>
          <CardDescription>
            Create a SQL function to check if a column exists in a table. This is needed for the add new place
            functionality.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>
            This will create a SQL function called <code>column_exists</code> that can be used to check if a column
            exists in a table.
          </p>

          <div className="flex justify-center">
            <Button onClick={handleInitialize} disabled={isInitializing}>
              {isInitializing ? "Initializing..." : "Initialize Function"}
            </Button>
          </div>

          {result && (
            <div
              className={`p-4 rounded-md ${result.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
            >
              {result.success ? (
                <>
                  <p className="font-medium">{result.message}</p>
                  <p className="mt-2">
                    You can now use the <code>column_exists</code> function in your SQL queries.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium">Error: {result.error}</p>
                  <p className="mt-2">Please try again or check the console for more details.</p>
                </>
              )}
            </div>
          )}

          <div className="flex justify-center mt-6">
            <Link href="/add-content">
              <Button variant="outline">Back to Add Content</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
