"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Search } from "lucide-react"
import Navbar from "@/components/navbar"

export default function NavbarSearchTest() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setError(null)
    setSuccess(null)
    setSearchResults([])

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)

      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`)
      }

      const data = await response.json()
      setSearchResults(data)
      setSuccess(`Found ${data.length} results for "${searchQuery}"`)
    } catch (err) {
      console.error("Search error:", err)
      setError(`Search failed: ${err.message}`)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container py-24">
        <h1 className="text-3xl font-bold mb-6">Navbar Search Test</h1>
        <p className="text-gray-600 mb-8">
          This page tests the search functionality in the navbar. Try using the search icon in the navbar to search for
          cities, attractions, etc.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Manual Search Test</CardTitle>
              <CardDescription>Test the search functionality directly from this page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input
                  placeholder="Search for places..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={isSearching}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Search Results</h3>
                {isSearching ? (
                  <p className="text-center py-4 text-gray-500">Searching...</p>
                ) : searchResults.length === 0 ? (
                  <p className="text-center py-4 text-gray-500">No results found</p>
                ) : (
                  <div className="space-y-2">
                    {searchResults.map((result) => (
                      <div key={result.id} className="p-2 hover:bg-gray-50 rounded">
                        <div className="font-medium">{result.name}</div>
                        <div className="text-xs text-gray-500 flex justify-between">
                          <span>{result.type}</span>
                          {result.region && <span>{result.region}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Navbar Search Instructions</CardTitle>
              <CardDescription>How to use the search functionality in the navbar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Desktop</h3>
                <ol className="mt-2 space-y-2 list-decimal list-inside">
                  <li>Click the search icon in the top-right corner of the navbar</li>
                  <li>Type your search query in the search box that appears</li>
                  <li>Press Enter to search</li>
                  <li>You will be redirected to the search results page</li>
                </ol>
              </div>

              <div>
                <h3 className="font-medium">Mobile</h3>
                <ol className="mt-2 space-y-2 list-decimal list-inside">
                  <li>Tap the search icon in the top-right corner of the navbar</li>
                  <li>Type your search query in the search box that appears</li>
                  <li>Tap the search icon or press Enter to search</li>
                  <li>You will be redirected to the search results page</li>
                </ol>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium">Test Queries</h3>
                <p className="mt-2 text-sm text-gray-600">Try searching for these terms:</p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
                  <li>Tunis</li>
                  <li>Beach</li>
                  <li>Restaurant</li>
                  <li>Museum</li>
                  <li>North Tunisia</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
