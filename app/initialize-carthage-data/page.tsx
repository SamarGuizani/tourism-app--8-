"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function InitializeCarthageData() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initializeData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/initialize-carthage-data")
      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setSuccess(false)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError("Failed to initialize Carthage data")
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Initialize Carthage Data</CardTitle>
          <CardDescription>Add attractions and restaurants data for Carthage</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            This will create the necessary tables and add data for Carthage attractions and restaurants.
          </p>

          {success && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Carthage data initialized successfully!</span>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
              <XCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={initializeData} disabled={loading || success} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : success ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Initialized
              </>
            ) : (
              "Initialize Carthage Data"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
