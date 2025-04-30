import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { northTunisiaCities, centralTunisiaCities, southTunisiaCities } from "@/lib/region-data"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const allCities = [...northTunisiaCities, ...centralTunisiaCities, ...southTunisiaCities]

    // Format city slugs for table names
    const formattedCities = allCities.map((city) => city.replace(/-/g, "_"))

    // Create tables for each city
    for (const city of formattedCities) {
      // Create attractions table for this city
      await supabase.rpc("create_city_table", {
        city_name: city,
        table_type: "attractions",
      })

      // Create restaurants table for this city
      await supabase.rpc("create_city_table", {
        city_name: city,
        table_type: "restaurants",
      })

      // Create activities table for this city
      await supabase.rpc("create_city_table", {
        city_name: city,
        table_type: "activities",
      })
    }

    return NextResponse.json({
      message: "City tables setup initiated. Tables will be created asynchronously.",
      cities: formattedCities,
    })
  } catch (error) {
    console.error("Error setting up city tables:", error)
    return NextResponse.json({ error: "Failed to set up city tables" }, { status: 500 })
  }
}
