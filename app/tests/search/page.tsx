"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"

export default function SearchTest() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)

    try {
      // Test direct navigation
      const navigationTest = {
        method: "GET",
        url: `/search?q=${encodeURIComponent(searchQuery)}`,
        description: "Navigation to search page with query parameter",
      }

      // Test API endpoint if you have one
      let apiResults = null
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        if (!response.ok) throw new Error(`API returned ${response.status}`)
        apiResults = await response.json()
      } catch (apiError) {
        console.error("API search error:", apiError)
      }

      setSearchResults({
        query: searchQuery,
        navigationTest,
        apiResults,
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      console.error("Search test error:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Search Functionality Test</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Test Search</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="search"
              placeholder="Enter search query..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Searching..." : <Search className="h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Try searching for cities, attractions, or activities to test the search functionality.
            </p>
            <p className="text-sm text-gray-500">Example queries: "Tunis", "beach", "museum", "restaurant"</p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">Error: {error}</div>
      )}

      {searchResults && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results for "{searchResults.query}"</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Navigation Test:</h3>
                <p>
                  URL: <code className="bg-gray-100 px-1 py-0.5 rounded">{searchResults.navigationTest.url}</code>
                </p>
                <p>
                  Method: <code className="bg-gray-100 px-1 py-0.5 rounded">{searchResults.navigationTest.method}</code>
                </p>
                <p>Description: {searchResults.navigationTest.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => window.open(`/search?q=${encodeURIComponent(searchResults.query)}`, "_blank")}
                >
                  Open Search Page
                </Button>
              </div>

              {searchResults.apiResults && (
                <div>
                  <h3 className="font-medium">API Results:</h3>
                  <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-96 text-sm">
                    {JSON.stringify(searchResults.apiResults, null, 2)}
                  </pre>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500">
                  Test performed at: {new Date(searchResults.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
