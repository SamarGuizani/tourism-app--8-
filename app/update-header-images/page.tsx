"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

export default function UpdateHeaderImagesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const updateHeaderImages = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/update-header-images")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update header images")
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Update Header Images</CardTitle>
          <CardDescription>This utility will update all city header images to match their hero images.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Use this tool to fix missing header images by copying the hero image URLs to the header image field. This is
            useful when you've uploaded hero images but the header images are still using placeholder URLs.
          </p>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Updated {result.updated} city header images.</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={updateHeaderImages} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Header Images"
            )}
          </Button>
        </CardFooter>
      </Card>

      {result && result.cities && result.cities.length > 0 && (
        <div className="mt-8 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Updated Cities</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {result.cities.map((city: any) => (
                  <tr key={city.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{city.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{city.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{city.slug}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
