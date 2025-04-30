import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // First, get all cities
    const { data: cities, error: citiesError } = await supabase.from("cities").select("slug")

    if (citiesError) {
      throw new Error(`Error fetching cities: ${citiesError.message}`)
    }

    // Extract city slugs
    const citySlugsList = cities.map((city) => city.slug)

    // Get all guides
    const { data: guides, error: guidesError } = await supabase.from("guides").select("id, locations")

    if (guidesError) {
      throw new Error(`Error fetching guides: ${guidesError.message}`)
    }

    // Update guides with empty or invalid locations
    const updates = []
    for (const guide of guides) {
      let needsUpdate = false
      let locations = guide.locations || []

      // Check if locations is not an array
      if (!Array.isArray(locations)) {
        try {
          // Try to parse if it's a JSON string
          locations = JSON.parse(locations)
          if (!Array.isArray(locations)) {
            locations = []
            needsUpdate = true
          }
        } catch (e) {
          // If parsing fails, reset to empty array
          locations = []
          needsUpdate = true
        }
      }

      // If locations is empty, assign all cities
      if (locations.length === 0) {
        locations = citySlugsList
        needsUpdate = true
      }

      // Update the guide if needed
      if (needsUpdate) {
        updates.push(
          supabase
            .from("guides")
            .update({ locations })
            .eq("id", guide.id)
            .then(({ error }) => {
              if (error) {
                console.error(`Error updating guide ${guide.id}:`, error)
              }
              return { id: guide.id, success: !error }
            }),
        )
      }
    }

    // Wait for all updates to complete
    const results = await Promise.all(updates)

    return NextResponse.json({
      message: `Fixed guide locations. Updated ${results.filter((r) => r.success).length} guides.`,
      updatedGuides: results,
    })
  } catch (error) {
    console.error("Error fixing guide locations:", error)
    return NextResponse.json({ error: "Failed to fix guide locations" }, { status: 500 })
  }
}
