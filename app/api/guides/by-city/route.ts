import { createClient } from "@/utils/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const citySlug = searchParams.get("city_slug")

  if (!citySlug) {
    return NextResponse.json({ error: "city_slug parameter is required" }, { status: 400 })
  }

  const supabase = createClient()

  // Use the city_guides junction table to find guides for a specific city
  const { data: guides, error } = await supabase
    .from("guides")
    .select(`
      id,
      name,
      bio,
      profile_image_url,
      languages,
      specialties,
      phone_number,
      age,
      contact_email,
      photo_url,
      city_guides!inner(city_slug)
    `)
    .eq("city_guides.city_slug", citySlug)

  if (error) {
    console.error("Error fetching guides by city:", error)
    return NextResponse.json({ error: "Failed to fetch guides" }, { status: 500 })
  }

  return NextResponse.json({ guides })
}
