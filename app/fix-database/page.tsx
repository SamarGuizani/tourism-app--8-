"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function FixDatabasePage() {
  const [isFixingGuides, setIsFixingGuides] = useState(false)
  const [guidesFixed, setGuidesFixed] = useState(false)
  const [guidesError, setGuidesError] = useState<string | null>(null)

  const fixGuideRelationships = async () => {
    setIsFixingGuides(true)
    setGuidesError(null)

    try {
      const response = await fetch("/api/fix-guide-relationships")
      const data = await response.json()

      if (data.success) {
        setGuidesFixed(true)
      } else {
        setGuidesError(data.error || "Failed to fix guide relationships")
      }
    } catch (error) {
      setGuidesError(String(error))
    } finally {
      setIsFixingGuides(false)
    }
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Fix Database Issues</h1>

      <div className="grid gap-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Fix Guide Relationships</CardTitle>
            <CardDescription>
              This will fix the relationship between guides and cities to ensure guides appear correctly on city pages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {guidesFixed ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="mr-2" />
                Guide relationships fixed successfully!
              </div>
            ) : guidesError ? (
              <div className="flex items-center text-red-600">
                <XCircle className="mr-2" />
                {guidesError}
              </div>
            ) : null}
          </CardContent>
          <CardFooter>
            <Button onClick={fixGuideRelationships} disabled={isFixingGuides || guidesFixed} className="w-full">
              {isFixingGuides ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fixing...
                </>
              ) : guidesFixed ? (
                "Fixed Successfully"
              ) : (
                "Fix Guide Relationships"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
