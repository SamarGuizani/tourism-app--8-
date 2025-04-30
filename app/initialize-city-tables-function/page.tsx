"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle } from "lucide-react"

export default function InitializeCityTablesFunction() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleInitialize = async () => {
    setIsInitializing(true)
    setResult(null)

    try {
      const response = await fetch("/api/create-city-tables-function")
      const data = await response.json()

      if (data.success) {
        setResult({
          success: true,
          message: "Successfully created city tables function",
        })
      } else {
        setResult({
          success: false,
          message: `Failed to create function: ${data.error}`,
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: `Error: ${error.message}`,
      })
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Initialize City Tables Function</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create City Tables Function</CardTitle>
          <CardDescription>This will create a SQL function that can generate tables for new cities</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This function allows the system to automatically create the necessary tables when a new city is added.
          </p>

          {result && (
            <div
              className={`p-4 rounded-md mt-4 ${
                result.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              <div className="flex items-center">
                {result.success ? (
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 mr-2 text-red-500" />
                )}
                <p>{result.message}</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleInitialize} disabled={isInitializing} className="w-full">
            {isInitializing ? "Initializing..." : "Initialize Function"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
