import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowLeft, Phone, Mail, Globe, Instagram } from "lucide-react"
import { getImageUrl } from "@/lib/drive-utils"
import { VideoGallery } from "@/components/video-gallery"

export const dynamic = "force-dynamic"

export default async function MahdiaActivityDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  const { data: activity, error } = await supabase.from("mahdia_activities").select("*").eq("id", params.id).single()

  if (error || !activity) {
    console.error("Error fetching activity:", error)
    return notFound()
  }

  const provider = activity.provider ? activity.provider : null
  const details = activity.details ? activity.details : null

  // Prepare videos array - if there's a single video_url, put it in an array
  const videos = activity.video_url ? [activity.video_url] : []

  // If there's a videos array in the activity data, add those too
  if (activity.videos && Array.isArray(activity.videos)) {
    videos.push(...activity.videos)
  }

  return (
    <div className="container mx-auto py-8">
      <Link href="/cities-regions/mahdia-city" className="flex items-center mb-6 text-blue-600 hover:text-blue-800">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Mahdia
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-64 md:h-96 bg-gray-200 relative">
          <img
            src={getImageUrl(activity.image_url, activity.title) || "/placeholder.svg"}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold">{activity.title}</h1>
              <p className="text-gray-600 mt-1">{activity.type}</p>
            </div>
            {activity.google_map_link && (
              <a href={activity.google_map_link} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  View on Map
                </Button>
              </a>
            )}
          </div>

          <div className="prose max-w-none mb-6">
            <p className="text-lg">{activity.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Details</h2>
              <div className="space-y-2">
                {activity.location && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
                    <p>{activity.location}</p>
                  </div>
                )}
                {activity.price && (
                  <div className="flex items-start">
                    <span className="font-medium mr-2">Price:</span>
                    <p>{activity.price}</p>
                  </div>
                )}
                {activity.bon_plan && (
                  <div className="mt-4">
                    <h3 className="font-medium">Bon Plan</h3>
                    <p className="italic">{activity.bon_plan}</p>
                  </div>
                )}
              </div>
            </div>

            {details && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Activity Details</h2>
                <div className="space-y-3">
                  {details.duration && (
                    <div>
                      <span className="font-medium">Duration:</span> {details.duration}
                    </div>
                  )}
                  {details.schedule && (
                    <div>
                      <span className="font-medium">Schedule:</span> {details.schedule}
                    </div>
                  )}
                  {details.inclusions && details.inclusions.length > 0 && (
                    <div>
                      <span className="font-medium">Inclusions:</span>
                      <ul className="list-disc pl-5 mt-1">
                        {details.inclusions.map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {details.notes && (
                    <div>
                      <span className="font-medium">Notes:</span> {details.notes}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {provider && (
            <div className="border-t pt-4">
              <h2 className="text-xl font-semibold mb-3">Provider Information</h2>
              <div className="space-y-2">
                {provider.name && (
                  <div>
                    <span className="font-medium">Provider:</span> {provider.name}
                  </div>
                )}
                {provider.contact && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-gray-500" />
                    <a href={`tel:${provider.contact}`} className="text-blue-600 hover:underline">
                      {provider.contact}
                    </a>
                  </div>
                )}
                {provider.email && (
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-gray-500" />
                    <a href={`mailto:${provider.email}`} className="text-blue-600 hover:underline">
                      {provider.email}
                    </a>
                  </div>
                )}
                {provider.website && (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-gray-500" />
                    <a
                      href={provider.website.startsWith("http") ? provider.website : `https://${provider.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {provider.website}
                    </a>
                  </div>
                )}
                {provider.instagram && (
                  <div className="flex items-center">
                    <Instagram className="h-5 w-5 mr-2 text-gray-500" />
                    <a
                      href={provider.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Instagram
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {videos.length > 0 && (
            <div className="mt-8">
              <VideoGallery videos={videos} title="Videos" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
