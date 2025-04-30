"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Compass, MapPin, Clock, Phone, Instagram, ArrowLeft, ExternalLink } from "lucide-react"

interface ChebbaActivityDetailProps {
  activityId: string
}

export default function ChebbaActivityDetailPage({ activityId }: ChebbaActivityDetailProps) {
  const [activity, setActivity] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    async function fetchActivityData() {
      try {
        // Check if the chebba_activities table exists
        const { data: tableExists } = await supabase.rpc("table_exists", { table_name: "chebba_activities" })

        if (!tableExists) {
          setError("Activity data not available")
          setLoading(false)
          return
        }

        // Fetch the activity data
        const { data, error } = await supabase.from("chebba_activities").select("*").eq("id", activityId).single()

        if (error) {
          throw error
        }

        if (data) {
          setActivity(data)
        } else {
          setError("Activity not found")
        }
      } catch (err) {
        console.error("Error fetching activity:", err)
        setError("Failed to load activity data")
      } finally {
        setLoading(false)
      }
    }

    fetchActivityData()
  }, [activityId])

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !activity) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error || "Failed to load activity data"}</p>
          <Link href="/cities-regions/chebba">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Chebba
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Check if photos is a string and convert to array if needed
  const photos = Array.isArray(activity.photos)
    ? activity.photos
    : typeof activity.photos === "string"
      ? [activity.photos]
      : []

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/cities-regions/chebba" className="text-primary hover:underline flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Chebba
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Compass className="mr-3 h-7 w-7 text-primary" />
            {activity.name}
          </h1>

          {activity.type && (
            <Badge variant="outline" className="mb-4 capitalize">
              {activity.type}
            </Badge>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="mb-8">
                <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-6">
                  <Image
                    src={
                      photos[0] ||
                      `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(activity.name + " activity")}`
                    }
                    alt={activity.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="prose max-w-none">
                  <p className="text-lg mb-6">{activity.description}</p>

                  <div className="flex items-center mb-4">
                    <MapPin className="h-5 w-5 text-red-500 mr-2" />
                    <span className="font-medium">Location:</span>
                    <span className="ml-2">Chebba, Tunisia</span>
                  </div>

                  {activity.duration && (
                    <div className="flex items-center mb-4">
                      <Clock className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-medium">Duration:</span>
                      <span className="ml-2">{activity.duration}</span>
                    </div>
                  )}

                  {activity.difficulty && (
                    <div className="flex items-center mb-4">
                      <Compass className="h-5 w-5 text-green-500 mr-2" />
                      <span className="font-medium">Difficulty:</span>
                      <span className="ml-2">{activity.difficulty}</span>
                    </div>
                  )}

                  {activity.google_map_link && (
                    <a
                      href={activity.google_map_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:underline mb-4"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View on Google Maps
                    </a>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="photos">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {photos.length > 0 ? (
                  photos.map((photo, index) => (
                    <div key={index} className="relative h-64 rounded-lg overflow-hidden">
                      <Image
                        src={photo || "/placeholder.svg"}
                        alt={`${activity.name} - Photo ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No photos available</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Activity Information</h2>

              <div className="space-y-4">
                {activity.contact && (
                  <>
                    {activity.contact.phone && (
                      <div>
                        <h3 className="font-medium flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-primary" />
                          Contact
                        </h3>
                        <p className="text-gray-600 mt-1">{activity.contact.phone}</p>
                      </div>
                    )}

                    {activity.contact.instagram && (
                      <div>
                        <h3 className="font-medium flex items-center">
                          <Instagram className="h-4 w-4 mr-2 text-primary" />
                          Instagram
                        </h3>
                        <p className="text-gray-600 mt-1">{activity.contact.instagram}</p>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <h3 className="font-medium flex items-center">
                    <Compass className="h-4 w-4 mr-2 text-primary" />
                    Activity Type
                  </h3>
                  <p className="text-gray-600 mt-1 capitalize">{activity.type || "Adventure"}</p>
                </div>

                {activity.duration && (
                  <div>
                    <h3 className="font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      Duration
                    </h3>
                    <p className="text-gray-600 mt-1">{activity.duration}</p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <Link href={`/book-guide?location=chebba&activity=${activityId}`}>
                  <Button className="w-full">Book a Guide for This Activity</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
