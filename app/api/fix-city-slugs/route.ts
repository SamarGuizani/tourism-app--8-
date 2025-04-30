import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Find all cities with URL encoded slugs
    const { data: cities, error: fetchError } = await supabase.from("city").select("id, slug")

    if (fetchError) {
      return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 })
    }

    const results = []

    // Fix each city with encoded slug
    for (const city of cities) {
      if (city.slug.includes("%20")) {
        const decodedSlug = decodeURIComponent(city.slug)

        // Update the city slug
        const { error: updateError } = await supabase.from("city").update({ slug: decodedSlug }).eq("id", city.id)

        if (updateError) {
          results.push({ id: city.id, slug: city.slug, success: false, error: updateError.message })
        } else {
          results.push({ id: city.id, slug: city.slug, newSlug: decodedSlug, success: true })
        }
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("Error fixing city slugs:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
