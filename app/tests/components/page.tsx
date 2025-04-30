"use client"

import { useState } from "react"
import { CitySearch } from "@/components/city-search"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllCities, getAllRestaurants, getAllActivities } from "@/lib/data-aggregator"

export default function ComponentTestPage() {
  const [cities, setCities] = useState<any[]>([])
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({
    cities: false,
    restaurants: false,
    activities: false,
  })
  const [error, setError] = useState<{ [key: string]: string | null }>({
    cities: null,
    restaurants: null,
    activities: null,
  })

  const fetchCities = async () => {
    try {
      setLoading((prev) => ({ ...prev, cities: true }))
      setError((prev) => ({ ...prev, cities: null }))
      const data = await getAllCities()
      setCities(data)
    } catch (err) {
      setError((prev) => ({ ...prev, cities: err instanceof Error ? err.message : "Failed to fetch cities" }))
    } finally {
      setLoading((prev) => ({ ...prev, cities: false }))
    }
  }

  const fetchRestaurants = async () => {
    try {
      setLoading((prev) => ({ ...prev, restaurants: true }))
      setError((prev) => ({ ...prev, restaurants: null }))
      const data = await getAllRestaurants()
      setRestaurants(data)
    } catch (err) {
      setError((prev) => ({
        ...prev,
        restaurants: err instanceof Error ? err.message : "Failed to fetch restaurants",
      }))
    } finally {
      setLoading((prev) => ({ ...prev, restaurants: false }))
    }
  }

  const fetchActivities = async () => {
    try {
      setLoading((prev) => ({ ...prev, activities: true }))
      setError((prev) => ({ ...prev, activities: null }))
      const data = await getAllActivities()
      setActivities(data)
    } catch (err) {
      setError((prev) => ({
        ...prev,
        activities: err instanceof Error ? err.message : "Failed to fetch activities",
      }))
    } finally {
      setLoading((prev) => ({ ...prev, activities: false }))
    }
  }

  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-8">Component Testing Page</h1>

      <Tabs defaultValue="search">
        <TabsList className="mb-4">
          <TabsTrigger value="search">City Search</TabsTrigger>
          <TabsTrigger value="data">Data Fetching</TabsTrigger>
        </TabsList>

        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>City Search Component</CardTitle>
              <CardDescription>Test the city search functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <CitySearch />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cities</CardTitle>
                <CardDescription>Test fetching cities data</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={fetchCities} disabled={loading.cities} className="mb-4">
                  {loading.cities ? "Loading..." : "Fetch Cities"}
                </Button>
                {error.cities && <p className="text-red-500 mb-2">{error.cities}</p>}
                <div className="h-60 overflow-auto">
                  <pre className="text-xs">{JSON.stringify(cities, null, 2)}</pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Restaurants</CardTitle>
                <CardDescription>Test fetching restaurants data</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={fetchRestaurants} disabled={loading.restaurants} className="mb-4">
                  {loading.restaurants ? "Loading..." : "Fetch Restaurants"}
                </Button>
                {error.restaurants && <p className="text-red-500 mb-2">{error.restaurants}</p>}
                <div className="h-60 overflow-auto">
                  <pre className="text-xs">{JSON.stringify(restaurants, null, 2)}</pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activities</CardTitle>
                <CardDescription>Test fetching activities data</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={fetchActivities} disabled={loading.activities} className="mb-4">
                  {loading.activities ? "Loading..." : "Fetch Activities"}
                </Button>
                {error.activities && <p className="text-red-500 mb-2">{error.activities}</p>}
                <div className="h-60 overflow-auto">
                  <pre className="text-xs">{JSON.stringify(activities, null, 2)}</pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
