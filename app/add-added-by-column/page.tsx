"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function AddAddedByColumnPage() {
  const [isAdding, setIsAdding] = useState(false)
  const [addSuccess, setAddSuccess] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  const addAddedByColumn = async () => {
    setIsAdding(true)
    setAddError(null)

    try {
      const response = await fetch("/api/add-added-by-column")
      const data = await response.json()

      if (data.message) {
        setAddSuccess(true)
      } else {
        setAddError(data.error || "Failed to add 'added_by' column")
      }
    } catch (error) {
      setAddError(String(error))
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Add 'added_by' Column to Cities Table</h1>

      <div className="grid gap-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add Missing Column</CardTitle>
            <CardDescription>
              This will add the 'added_by' column to the cities table if it doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {addSuccess ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="mr-2" />
                Added 'added_by' column successfully!
              </div>
            ) : addError ? (
              <div className="flex items-center text-red-600">
                <XCircle className="mr-2" />
                {addError}
              </div>
            ) : null}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button onClick={addAddedByColumn} disabled={isAdding || addSuccess} className="w-full">
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : addSuccess ? (
                "Added Successfully"
              ) : (
                "Add 'added_by' Column"
              )}
            </Button>
            {addSuccess && (
              <Link href="/add-content" className="w-full">
                <Button variant="outline" className="w-full">
                  Go to Add Content
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
