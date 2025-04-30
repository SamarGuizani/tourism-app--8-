"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { CheckCircle, AlertCircle, RefreshCw, Trash2, Plus, Search } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

export default function DatabaseSyncTest() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("cities")
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    slug: "",
    region: "North Tunisia",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  // Fetch data based on active tab
  useEffect(() => {
    fetchItems()
  }, [activeTab])

  const fetchItems = async () => {
    setLoading(true)
    setError(null)
    setItems([])

    try {
      let data: any[] = []
      let error: any = null

      // Fetch data based on active tab
      switch (activeTab) {
        case "cities":
          // Try cities table first
          const citiesResult = await supabase.from("cities").select("*").order("name")
          if (citiesResult.error || (citiesResult.data && citiesResult.data.length === 0)) {
            // Fallback to city table
            const cityResult = await supabase.from("city").select("*").order("name")
            data = cityResult.data || []
            error = cityResult.error
          } else {
            data = citiesResult.data || []
            error = citiesResult.error
          }
          break
        case "attractions":
          const attractionsResult = await supabase.from("attractions").select("*").order("name")
          data = attractionsResult.data || []
          error = attractionsResult.error
          break
        case "restaurants":
          const restaurantsResult = await supabase.from("restaurants").select("*").order("name")
          data = restaurantsResult.data || []
          error = restaurantsResult.error
          break
        case "activities":
          const activitiesResult = await supabase.from("activities").select("*").order("name")
          data = activitiesResult.data || []
          error = activitiesResult.error
          break
        case "regions":
          const regionsResult = await supabase.from("regions").select("*").order("name")
          data = regionsResult.data || []
          error = regionsResult.error
          break
      }

      if (error) throw error
      setItems(data)
    } catch (err: any) {
      console.error(`Error fetching ${activeTab}:`, err)
      setError(`Failed to fetch ${activeTab}: ${err.message || "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchItems()
    setRefreshing(false)
  }

  const handleDelete = async (id: string) => {
    setError(null)
    setSuccess(null)

    try {
      const tableName = activeTab
      // Handle special case for cities table
      if (activeTab === "cities") {
        // Try to delete from cities table first
        const { error: citiesError } = await supabase.from("cities").delete().eq("id", id)

        if (citiesError) {
          // If that fails, try the city table
          const { error: cityError } = await supabase.from("city").delete().eq("id", id)
          if (cityError) throw cityError
        }
      } else {
        const { error } = await supabase.from(tableName).delete().eq("id", id)
        if (error) throw error
      }

      setSuccess(`Successfully deleted item from ${activeTab}`)
      // Refresh the list
      fetchItems()
    } catch (err: any) {
      console.error(`Error deleting from ${activeTab}:`, err)
      setError(`Failed to delete: ${err.message || "Unknown error"}`)
    }
  }

  const handleAddItem = async () => {
    setError(null)
    setSuccess(null)

    if (!newItem.name || !newItem.slug) {
      setError("Name and slug are required")
      return
    }

    try {
      const tableName = activeTab
      // Handle special case for cities table
      if (activeTab === "cities") {
        // Try to insert into cities table first
        const { error: citiesError } = await supabase.from("cities").insert([newItem])

        if (citiesError) {
          // If that fails, try the city table
          const { error: cityError } = await supabase.from("city").insert([newItem])
          if (cityError) throw cityError
        }
      } else {
        const { error } = await supabase.from(tableName).insert([newItem])
        if (error) throw error
      }

      setSuccess(`Successfully added new item to ${activeTab}`)
      // Reset form
      setNewItem({
        name: "",
        description: "",
        slug: "",
        region: "North Tunisia",
      })
      // Refresh the list
      fetchItems()
    } catch (err: any) {
      console.error(`Error adding to ${activeTab}:`, err)
      setError(`Failed to add item: ${err.message || "Unknown error"}`)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setSearching(true)
    setError(null)
    setSearchResults([])

    try {
      let results: any[] = []

      // Search in cities
      const citiesResult = await supabase.from("cities").select("*").ilike("name", `%${searchQuery}%`).order("name")

      if (citiesResult.data && citiesResult.data.length > 0) {
        results = [...results, ...citiesResult.data.map((item) => ({ ...item, type: "city" }))]
      } else {
        // Try city table
        const cityResult = await supabase.from("city").select("*").ilike("name", `%${searchQuery}%`).order("name")

        if (cityResult.data) {
          results = [...results, ...cityResult.data.map((item) => ({ ...item, type: "city" }))]
        }
      }

      // Search in attractions
      const attractionsResult = await supabase
        .from("attractions")
        .select("*")
        .ilike("name", `%${searchQuery}%`)
        .order("name")

      if (attractionsResult.data) {
        results = [...results, ...attractionsResult.data.map((item) => ({ ...item, type: "attraction" }))]
      }

      // Search in restaurants
      const restaurantsResult = await supabase
        .from("restaurants")
        .select("*")
        .ilike("name", `%${searchQuery}%`)
        .order("name")

      if (restaurantsResult.data) {
        results = [...results, ...restaurantsResult.data.map((item) => ({ ...item, type: "restaurant" }))]
      }

      // Search in activities
      const activitiesResult = await supabase
        .from("activities")
        .select("*")
        .ilike("name", `%${searchQuery}%`)
        .order("name")

      if (activitiesResult.data) {
        results = [...results, ...activitiesResult.data.map((item) => ({ ...item, type: "activity" }))]
      }

      setSearchResults(results)
    } catch (err: any) {
      console.error("Error searching:", err)
      setError(`Search failed: ${err.message || "Unknown error"}`)
    } finally {
      setSearching(false)
    }
  }

  const handleItemClick = (item: any) => {
    setSelectedItem(item)
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Database Sync Test Interface</h1>
      <p className="text-gray-600 mb-8">
        This interface allows you to test database operations and verify that changes are reflected in the frontend.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="cities">Cities</TabsTrigger>
              <TabsTrigger value="attractions">Attractions</TabsTrigger>
              <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="regions">Regions</TabsTrigger>
            </TabsList>

            {["cities", "attractions", "restaurants", "activities", "regions"].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold capitalize">{tab}</h2>
                  <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                    <p className="mt-2 text-gray-500">Loading {tab}...</p>
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-center py-8 border rounded-lg bg-gray-50">
                    <p className="text-gray-500">No {tab} found in the database.</p>
                    <Button variant="outline" className="mt-4" onClick={() => setActiveTab(tab)}>
                      Add your first {tab.slice(0, -1)}
                    </Button>
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Slug
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Region
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleItemClick(item)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium">{item.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.slug}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.region}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDelete(item.id)
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Add New {activeTab.slice(0, -1)}</CardTitle>
                    <CardDescription>
                      Create a new entry in the {activeTab} table and verify it appears in the list above.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={newItem.name}
                          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                          placeholder={`Enter ${activeTab.slice(0, -1)} name`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                          id="slug"
                          value={newItem.slug}
                          onChange={(e) => setNewItem({ ...newItem, slug: e.target.value })}
                          placeholder="e.g. tunis, carthage"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Select
                        value={newItem.region}
                        onValueChange={(value) => setNewItem({ ...newItem, region: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="North Tunisia">North Tunisia</SelectItem>
                          <SelectItem value="Central Tunisia">Central Tunisia</SelectItem>
                          <SelectItem value="South Tunisia">South Tunisia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        placeholder={`Enter ${activeTab.slice(0, -1)} description`}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleAddItem} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add {activeTab.slice(0, -1)}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Search Test</CardTitle>
              <CardDescription>
                Test the search functionality to verify it returns results from the database.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input
                    placeholder="Search for places..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch} disabled={searching}>
                  {searching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>

              <div className="border rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
                <h3 className="font-medium mb-2">Search Results</h3>
                {searchResults.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    {searching ? "Searching..." : "No results found. Try a different search term."}
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {searchResults.map((result) => (
                      <li
                        key={`${result.type}-${result.id}`}
                        className="p-2 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => handleItemClick(result)}
                      >
                        <div className="font-medium">{result.name}</div>
                        <div className="text-xs text-gray-500 flex justify-between">
                          <span>{result.region}</span>
                          <span className="capitalize">{result.type}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>

          {selectedItem && (
            <Card className="mt-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedItem.name}</CardTitle>
                    <CardDescription className="capitalize">
                      {selectedItem.type || activeTab.slice(0, -1)}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Details</h4>
                  <div className="mt-2 space-y-2">
                    <div className="grid grid-cols-3 gap-1 text-sm">
                      <span className="text-gray-500">ID:</span>
                      <span className="col-span-2 font-mono text-xs">{selectedItem.id}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-sm">
                      <span className="text-gray-500">Slug:</span>
                      <span className="col-span-2">{selectedItem.slug}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-sm">
                      <span className="text-gray-500">Region:</span>
                      <span className="col-span-2">{selectedItem.region}</span>
                    </div>
                    {selectedItem.description && (
                      <div className="grid grid-cols-3 gap-1 text-sm">
                        <span className="text-gray-500">Description:</span>
                        <span className="col-span-2">{selectedItem.description}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Navigate to the item's page if available
                      const type = selectedItem.type || activeTab.slice(0, -1)
                      if (type === "city") {
                        router.push(`/cities/${selectedItem.slug}`)
                      } else if (type === "attraction") {
                        router.push(`/attractions/${selectedItem.id}`)
                      } else if (type === "restaurant") {
                        router.push(`/restaurants/${selectedItem.id}`)
                      } else if (type === "activity") {
                        router.push(`/activities/${selectedItem.id}`)
                      }
                    }}
                    className="w-full"
                  >
                    View in App
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Parse Test</CardTitle>
              <CardDescription>Test the Parse server connection and functionality.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/tests/parse")} className="w-full">
                Go to Parse Test
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
