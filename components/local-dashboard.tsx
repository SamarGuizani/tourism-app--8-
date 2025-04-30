"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function LocalDashboard() {
  const [contributions, setContributions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchContributions()
  }, [])

  const fetchContributions = async () => {
    setIsLoading(true)
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData?.user) return

      // Fetch contributions from city table
      const { data: cityData, error: cityError } = await supabase
        .from("city")
        .select("*")
        .eq("added_by", userData.user.id)

      if (cityError) console.error("Error fetching city data:", cityError)

      // Fetch contributions from attractions table
      const { data: attractionsData, error: attractionsError } = await supabase
        .from("attractions")
        .select("*")
        .eq("added_by", userData.user.id)

      if (attractionsError) console.error("Error fetching attractions data:", attractionsError)

      // Fetch contributions from restaurants table
      const { data: restaurantsData, error: restaurantsError } = await supabase
        .from("restaurants")
        .select("*")
        .eq("added_by", userData.user.id)

      if (restaurantsError) console.error("Error fetching restaurants data:", restaurantsError)

      // Fetch contributions from activities table
      const { data: activitiesData, error: activitiesError } = await supabase
        .from("activities")
        .select("*")
        .eq("added_by", userData.user.id)

      if (activitiesError) console.error("Error fetching activities data:", activitiesError)

      // Combine all contributions
      const allContributions = [
        ...(cityData || []).map((item) => ({ ...item, type: "city" })),
        ...(attractionsData || []).map((item) => ({ ...item, type: "attraction" })),
        ...(restaurantsData || []).map((item) => ({ ...item, type: "restaurant" })),
        ...(activitiesData || []).map((item) => ({ ...item, type: "activity" })),
      ]

      setContributions(allContributions)
    } catch (error) {
      console.error("Error fetching contributions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Local Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Your Contributions</h3>
            {isLoading ? (
              <p>Loading your contributions...</p>
            ) : contributions.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {contributions.map((item, index) => (
                  <Card key={`${item.type}-${item.id || index}`} className="overflow-hidden">
                    <CardContent className="p-4">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                      <p className="text-sm mt-2 line-clamp-2">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p>You haven't added any content yet.</p>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/add-content">
              <Button>Add New Content</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
