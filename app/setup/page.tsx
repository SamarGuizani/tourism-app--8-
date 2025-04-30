"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<{
    regions?: { success: boolean; message: string }
    cities?: { success: boolean; message: string }
    database?: { success: boolean; message: string }
  }>({})

  const setupRegions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/setup-regions")
      const data = await response.json()
      setResults((prev) => ({
        ...prev,
        regions: {
          success: response.ok,
          message: response.ok ? data.message : data.error || "Failed to set up regions",
        },
      }))
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        regions: {
          success: false,
          message: error instanceof Error ? error.message : "Unknown error",
        },
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const setupCities = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/setup-city-tables")
      const data = await response.json()
      setResults((prev) => ({
        ...prev,
        cities: {
          success: response.ok,
          message: response.ok ? data.message : data.error || "Failed to set up city tables",
        },
      }))
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        cities: {
          success: false,
          message: error instanceof Error ? error.message : "Unknown error",
        },
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const setupDatabase = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/setup-database")
      const data = await response.json()
      setResults((prev) => ({
        ...prev,
        database: {
          success: response.ok,
          message: response.ok ? data.message : data.error || "Failed to set up database",
        },
      }))
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        database: {
          success: false,
          message: error instanceof Error ? error.message : "Unknown error",
        },
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const setupAll = async () => {
    await setupRegions()
    await setupCities()
    await setupDatabase()
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Database Setup</CardTitle>
          <CardDescription>Initialize and set up your tourism application database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Regions Table</h3>
                <p className="text-sm text-gray-500">Create and populate the regions table</p>
              </div>
              <div className="flex items-center gap-2">
                {results.regions && (
                  <span className="flex items-center">
                    {results.regions.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </span>
                )}
                <Button onClick={setupRegions} disabled={isLoading} size="sm">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Setup Regions
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">City Tables</h3>
                <p className="text-sm text-gray-500">Create tables for attractions, restaurants, and activities</p>
              </div>
              <div className="flex items-center gap-2">
                {results.cities && (
                  <span className="flex items-center">
                    {results.cities.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </span>
                )}
                <Button onClick={setupCities} disabled={isLoading} size="sm">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Setup City Tables
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Sample Data</h3>
                <p className="text-sm text-gray-500">Populate tables with sample data</p>
              </div>
              <div className="flex items-center gap-2">
                {results.database && (
                  <span className="flex items-center">
                    {results.database.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </span>
                )}
                <Button onClick={setupDatabase} disabled={isLoading} size="sm">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Setup Sample Data
                </Button>
              </div>
            </div>
          </div>

          {Object.values(results).some((result) => result) && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Results:</h3>
              <ul className="space-y-2">
                {results.regions && (
                  <li className={`text-sm ${results.regions.success ? "text-green-600" : "text-red-600"}`}>
                    Regions: {results.regions.message}
                  </li>
                )}
                {results.cities && (
                  <li className={`text-sm ${results.cities.success ? "text-green-600" : "text-red-600"}`}>
                    City Tables: {results.cities.message}
                  </li>
                )}
                {results.database && (
                  <li className={`text-sm ${results.database.success ? "text-green-600" : "text-red-600"}`}>
                    Sample Data: {results.database.message}
                  </li>
                )}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
          <Button onClick={setupAll} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Setup Everything
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
