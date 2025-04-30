"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle } from "lucide-react"

export default function SetupChebbaDataPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; errors?: any } | null>(null)

  const handleSetup = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/insert-chebba-data")
      const data = await response.json()

      setResult({
        success: data.success,
        message: data.message || (data.success ? "Chebba data inserted successfully" : "Failed to insert Chebba data"),
        errors: data.errors,
      })
    } catch (error) {
      setResult({
        success: false,
        message: `Error: ${error.message}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Setup Chebba Data</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Insert Chebba Data</CardTitle>
          <CardDescription>
            This will create and populate tables for Chebba's attractions, restaurants, and activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This process will:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Create tables for Chebba attractions, restaurants, and activities if they don't exist</li>
            <li>Insert sample data for Chebba's points of interest</li>
            <li>Ensure Chebba is properly added to the cities table</li>
          </ul>

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

              {result.errors && Object.values(result.errors).some((error) => error !== null) && (
                <div className="mt-4">
                  <p className="font-semibold">Errors:</p>
                  <ul className="list-disc pl-6 mt-2">
                    {result.errors.attractions && <li>Attractions: {result.errors.attractions}</li>}
                    {result.errors.restaurants && <li>Restaurants: {result.errors.restaurants}</li>}
                    {result.errors.activities && <li>Activities: {result.errors.activities}</li>}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSetup} disabled={isLoading} className="w-full">
            {isLoading ? "Setting Up..." : "Setup Chebba Data"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
