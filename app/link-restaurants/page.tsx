"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"

export default function LinkRestaurantsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    error?: string
    count?: number
  } | null>(null)

  const handleLinkRestaurants = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/link-restaurants")
      const data = await response.json()

      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Link Restaurants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This will link all restaurants to their respective cities and regions in the database. It will create a view
            and functions to easily query all restaurants with their city and region information.
          </p>

          <Button onClick={handleLinkRestaurants} disabled={isLoading} className="w-full">
            {isLoading ? "Processing..." : "Link Restaurants"}
          </Button>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"} className="mt-4">
              <div className="flex items-center gap-2">
                {result.success ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
              </div>
              <AlertDescription className="mt-2">
                {result.success ? `${result.message}. Linked ${result.count} restaurants.` : result.error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
