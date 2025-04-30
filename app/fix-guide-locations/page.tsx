"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function FixGuideLocationsPage() {
  const [isFixing, setIsFixing] = useState(false)
  const [fixSuccess, setFixSuccess] = useState(false)
  const [fixError, setFixError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  const fixGuideLocations = async () => {
    setIsFixing(true)
    setFixError(null)

    try {
      const response = await fetch("/api/fix-guide-locations")
      const data = await response.json()

      if (data.message) {
        setFixSuccess(true)
        setResult(data)
      } else {
        setFixError(data.error || "Failed to fix guide locations")
      }
    } catch (error) {
      setFixError(String(error))
    } finally {
      setIsFixing(false)
    }
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Fix Guide Locations</h1>

      <div className="grid gap-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Fix Guide Locations</CardTitle>
            <CardDescription>
              This will ensure all guides have valid locations. Guides with empty or invalid locations will be assigned
              all available cities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {fixSuccess ? (
              <div className="flex flex-col gap-2 text-green-600">
                <div className="flex items-center">
                  <CheckCircle className="mr-2" />
                  {result?.message}
                </div>
                {result?.updatedGuides && result.updatedGuides.length > 0 && (
                  <p className="text-sm">Updated {result.updatedGuides.length} guides with valid locations.</p>
                )}
              </div>
            ) : fixError ? (
              <div className="flex items-center text-red-600">
                <XCircle className="mr-2" />
                {fixError}
              </div>
            ) : null}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button onClick={fixGuideLocations} disabled={isFixing || fixSuccess} className="w-full">
              {isFixing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fixing...
                </>
              ) : fixSuccess ? (
                "Fixed Successfully"
              ) : (
                "Fix Guide Locations"
              )}
            </Button>
            {fixSuccess && (
              <Link href="/book-guide" className="w-full">
                <Button variant="outline" className="w-full">
                  Go to Book Guide
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
