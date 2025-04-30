"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ContentTable from "@/components/admin/content-table"
import AddContentForm from "@/components/admin/add-content-form"

interface City {
  id: string
  name: string
  slug: string
  region: string
}

interface AdminDashboardProps {
  cities: City[]
  regions: string[]
  user: User
}

export default function AdminDashboard({ cities, regions, user }: AdminDashboardProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [activeTab, setActiveTab] = useState("view")
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdminStatus = async () => {
      // Check if the user has admin role
      if (!user) {
        router.push("/login")
        return
      }

      const supabase = createClientComponentClient()
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", user.id)
        .single()

      if (userError) {
        console.error("Error fetching user data:", userError)
        router.push("/") // Redirect to home if there's an error
        return
      }

      if (userData?.is_admin) {
        setIsAdmin(true)
      } else {
        router.push("/") // Redirect to home if not an admin
      }
    }

    checkAdminStatus()
  }, [user, router])

  if (!isAdmin) {
    return null // Don't render anything if not an admin (already redirected)
  }

  // Filter cities based on selected region
  const filteredCities = selectedRegion ? cities.filter((city) => city.region === selectedRegion) : cities

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Tunisia Tourism Admin</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view">View Content</TabsTrigger>
          <TabsTrigger value="add">Add Content</TabsTrigger>
        </TabsList>

        <TabsContent value="view" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
              <CardDescription>Select a table to view its schema and data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Region</label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      {filteredCities.map((city) => (
                        <SelectItem key={city.id} value={city.slug}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <ContentTable contentType="restaurants" citySlug={selectedCity} region={selectedRegion} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="mt-6">
          <AddContentForm cities={cities} userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
