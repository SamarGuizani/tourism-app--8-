import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { northTunisiaCities, centralTunisiaCities, southTunisiaCities } from "@/lib/region-data"

export async function GET() {
  try {
    // Get all city slugs
    const allCitySlugs = [...northTunisiaCities, ...centralTunisiaCities, ...southTunisiaCities]

    // Check if cities table exists
    const { error: tableCheckError } = await supabase.from("cities").select("id").limit(1)

    if (tableCheckError) {
      // Create cities table if it doesn't exist
      await supabase.rpc("create_cities_table")
    }

    // Process each city
    const results = []

    for (const slug of allCitySlugs) {
      // Check if city already exists
      const { data: existingCity, error: checkError } = await supabase.from("cities").select("id").eq("slug", slug)

      if (checkError) {
        results.push({ slug, status: "error", message: checkError.message })
        continue
      }

      // If city exists, skip
      if (existingCity && existingCity.length > 0) {
        results.push({ slug, status: "skipped", message: "City already exists" })
        continue
      }

      // Determine region
      let region = "North Tunisia"
      if (centralTunisiaCities.includes(slug)) {
        region = "Central Tunisia"
      } else if (southTunisiaCities.includes(slug)) {
        region = "South Tunisia"
      }

      // Create city name from slug
      const name = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      // Insert city
      const { error: insertError } = await supabase.from("cities").insert({
        slug,
        name,
        region,
        description: `Explore the beautiful area of ${name}.`,
        hero_image: `/placeholder.svg?height=800&width=1200&query=${encodeURIComponent(name)}`,
        image: `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(name)}`,
      })

      if (insertError) {
        results.push({ slug, status: "error", message: insertError.message })
      } else {
        results.push({ slug, status: "success", message: "City created" })
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("Error fixing cities table:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
