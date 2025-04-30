"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Landmark, MapPin, Info, Users, ArrowLeft } from "lucide-react"
import DrivePhotoGallery from "@/components/drive-photo-gallery"

interface ChebbaAttractionDetailProps {
  attractionId: string
}

export default function ChebbaAttractionDetailPage({ attractionId }: ChebbaAttractionDetailProps) {
  const [attraction, setAttraction] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    async function fetchAttractionData() {
      try {
        // Fetch the attraction data from attractions_chebba table
        const { data, error } = await supabase.from("attractions_chebba").select("*").eq("id", attractionId).single()

        if (error) {
          throw error
        }

        if (data) {
          setAttraction(data)
        } else {
          setError("Attraction not found")
        }
      } catch (err) {
        console.error("Error fetching attraction:", err)
        setError("Failed to load attraction data")
      } finally {
        setLoading(false)
      }
    }

    fetchAttractionData()
  }, [attractionId])

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !attraction) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error || "Failed to load attraction data"}</p>
          <Link href="/cities/chebba">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Chebba
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Handle image URL
  const imageUrl =
    attraction.image_url || `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(attraction.name)}`

  // Check if it's a Google Drive URL
  const isDriveUrl = typeof imageUrl === "string" && imageUrl.includes("drive.google.com")

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/cities/chebba" className="text-primary hover:underline flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Chebba
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Landmark className="mr-3 h-7 w-7 text-primary" />
            {attraction.name}
          </h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="mb-8">
                <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-6">
                  <Image src={imageUrl || "/placeholder.svg"} alt={attraction.name} fill className="object-cover" />
                </div>

                <div className="prose max-w-none">
                  <p className="text-lg mb-6">{attraction.description}</p>
                  {attraction.details && <p className="mb-6">{attraction.details}</p>}

                  <div className="flex items-center mb-4">
                    <MapPin className="h-5 w-5 text-red-500 mr-2" />
                    <span className="font-medium">Location:</span>
                    <span className="ml-2">Chebba, {attraction.region || "Tunisia"}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="photos">
              {isDriveUrl ? (
                <DrivePhotoGallery photos={[imageUrl]} />
              ) : (
                <div className="relative h-[400px] rounded-lg overflow-hidden">
                  <Image src={imageUrl || "/placeholder.svg"} alt={attraction.name} fill className="object-cover" />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Visit Information</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium flex items-center">
                    <Info className="h-4 w-4 mr-2 text-primary" />
                    Best Time to Visit
                  </h3>
                  <p className="text-gray-600 mt-1">Morning or late afternoon for the best lighting and fewer crowds</p>
                </div>

                <div>
                  <h3 className="font-medium flex items-center">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    Good For
                  </h3>
                  <p className="text-gray-600 mt-1">Families, couples, solo travelers, photography enthusiasts</p>
                </div>
              </div>

              <div className="mt-6">
                <Link href={`/book-guide?location=chebba&attraction=${attractionId}`}>
                  <Button className="w-full">Book a Guide for This Attraction</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
