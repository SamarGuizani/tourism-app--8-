"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function RefreshDataPage() {
  const [path, setPath] = useState("/")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/clear-cache?path=${encodeURIComponent(path)}`)
      const data = await response.json()

      toast({
        title: "Cache cleared",
        description: `Successfully refreshed data for path: ${path}`,
      })

      // Refresh the current page
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Refresh Data</CardTitle>
          <CardDescription>Clear the cache and refresh data for a specific page</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="path" className="text-sm font-medium">
                Path to refresh
              </label>
              <Input
                id="path"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="/cities/tunis-city"
              />
              <p className="text-xs text-muted-foreground">
                Enter the path you want to refresh (e.g., /cities/tunis-city)
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleRefresh} disabled={isLoading} className="w-full">
            {isLoading ? "Refreshing..." : "Refresh Data"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
