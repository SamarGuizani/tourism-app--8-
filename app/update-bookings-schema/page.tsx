"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function UpdateBookingsSchemaPage() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)

  const updateBookingsSchema = async () => {
    setIsUpdating(true)
    setUpdateError(null)

    try {
      const response = await fetch("/api/update-bookings-schema")
      const data = await response.json()

      if (data.message) {
        setUpdateSuccess(true)
      } else {
        setUpdateError(data.error || "Failed to update bookings schema")
      }
    } catch (error) {
      setUpdateError(String(error))
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Update Bookings Schema</h1>

      <div className="grid gap-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add Missing Columns to Bookings Table</CardTitle>
            <CardDescription>
              This will add attraction_id, restaurant_id, and activity_id columns to the bookings table if they don't
              exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {updateSuccess ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="mr-2" />
                Bookings schema updated successfully!
              </div>
            ) : updateError ? (
              <div className="flex items-center text-red-600">
                <XCircle className="mr-2" />
                {updateError}
              </div>
            ) : null}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button onClick={updateBookingsSchema} disabled={isUpdating || updateSuccess} className="w-full">
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : updateSuccess ? (
                "Updated Successfully"
              ) : (
                "Update Bookings Schema"
              )}
            </Button>
            {updateSuccess && (
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
