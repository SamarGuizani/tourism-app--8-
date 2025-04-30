import { createServerSupabaseClient } from "@/lib/supabase"
import { notFound } from "next/navigation"
import GuideBookingForm from "@/components/guide-booking-form"

interface GuideBookingPageProps {
  params: {
    guideId: string
  }
  searchParams: {
    city?: string
    attraction?: string
    restaurant?: string
    activity?: string
  }
}

export default async function GuideBookingPage({ params, searchParams }: GuideBookingPageProps) {
  const { guideId } = params
  const { city, attraction, restaurant, activity } = searchParams

  if (!guideId) {
    notFound()
  }

  const supabase = createServerSupabaseClient()

  // Fetch guide data
  const { data: guide, error } = await supabase.from("guides").select("*").eq("id", guideId).single()

  if (error || !guide) {
    console.error("Error fetching guide:", error)
    notFound()
  }

  // Fetch user data for the guide - removed avatar_url from the select query
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("name, email")
    .eq("id", guide.user_id)
    .single()

  if (userError) {
    console.error("Error fetching user data:", userError)
    // Continue without user data, we'll handle it in the component
  }

  // Combine guide and user data - removed avatar_url from the combined data
  const guideWithUserData = {
    ...guide,
    name: userData?.name || "Unknown Guide",
    email: userData?.email,
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Book Your Guide</h1>
      <GuideBookingForm
        guide={guideWithUserData}
        citySlug={city}
        attractionId={attraction}
        restaurantId={restaurant}
        activityId={activity}
      />
    </div>
  )
}
