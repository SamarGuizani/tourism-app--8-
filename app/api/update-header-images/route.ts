import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Get all cities
    const { data: cities, error: fetchError } = await supabase.from("city").select("id, slug, hero_image_link")

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    const updates = []

    // Update each city's header_image_link to match its hero_image_link
    for (const city of cities) {
      if (city.hero_image_link) {
        const { data, error: updateError } = await supabase
          .from("city")
          .update({ header_image_link: city.hero_image_link })
          .eq("id", city.id)
          .select("id, name, slug")

        if (updateError) {
          console.error(`Error updating ${city.slug}:`, updateError)
        } else {
          updates.push(data[0])
        }
      }
    }

    return NextResponse.json({
      message: "Header images updated successfully",
      updated: updates.length,
      cities: updates,
    })
  } catch (error) {
    console.error("Error updating header images:", error)
    return NextResponse.json({ error: "Failed to update header images" }, { status: 500 })
  }
}
