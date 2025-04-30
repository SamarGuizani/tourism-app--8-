import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a new Supabase client directly in the route handler
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!

export async function GET(request: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { searchParams } = new URL(request.url)
    const regionId = searchParams.get("region_id")
    const regionSlug = searchParams.get("region_slug")

    console.log("Fetching cities with params:", { regionId, regionSlug })

    let citiesQuery = supabase.from("cities").select("*")

    // If regionSlug is provided, try to filter by region
    if (regionSlug) {
      try {
        // First try to get the region from the regions table
        const { data: regionData, error: regionError } = await supabase
          .from("regions")
          .select("name")
          .eq("slug", regionSlug)
          .single()

        if (!regionError && regionData) {
          // If we found the region, filter cities by that region name
          citiesQuery = citiesQuery.eq("region", regionData.name)
        } else {
          console.log("Region not found by slug, trying direct mapping")
          // If regions table doesn't exist or region not found,
          // try to filter based on the slug directly
          if (regionSlug === "north-tunisia") {
            citiesQuery = citiesQuery.eq("region", "North Tunisia")
          } else if (regionSlug === "central-tunisia") {
            citiesQuery = citiesQuery.eq("region", "Central Tunisia")
          } else if (regionSlug === "south-tunisia") {
            citiesQuery = citiesQuery.eq("region", "South Tunisia")
          }
        }
      } catch (error) {
        console.error("Error fetching region:", error)
      }
    }

    if (regionId) {
      citiesQuery = citiesQuery.eq("region_id", regionId)
    }

    const { data, error } = await citiesQuery.order("name")

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Process the data to ensure it matches the expected format
    const processedData =
      data?.map((city) => ({
        ...city,
        // Ensure these fields exist with default values if they're missing
        description: city.description || "",
        image_url: city.image || null,
        population: city.population || null,
        attractions: Array.isArray(city.attractions) ? city.attractions : [],
      })) || []

    console.log(`Found ${processedData.length} cities after filtering`)
    return NextResponse.json(processedData)
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch cities" },
      { status: 500 },
    )
  }
}
