import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Fetch all attractions, restaurants, and activities from both cities
    const { data: chebbaAttractions } = await supabase.from("attractions_chebba").select("id, title")
    const { data: mahdiaAttractions } = await supabase.from("mahdia_attractions").select("id, title")

    const { data: chebbaRestaurants } = await supabase.from("restaurants_chebba").select("id, title")
    const { data: mahdiaRestaurants } = await supabase.from("mahdia_restaurants").select("id, title")

    const { data: chebbaActivities } = await supabase.from("activities_chebba").select("id, title")
    const { data: mahdiaActivities } = await supabase.from("mahdia_activities").select("id, title")

    // Update Chebba attractions
    if (chebbaAttractions && chebbaAttractions.length > 0) {
      for (const attraction of chebbaAttractions) {
        const searchQuery = `${attraction.title}, Chebba, Tunisia`
        const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`

        await supabase.from("attractions_chebba").update({ google_map_link: mapLink }).eq("id", attraction.id)
      }
    }

    // Update Mahdia attractions
    if (mahdiaAttractions && mahdiaAttractions.length > 0) {
      for (const attraction of mahdiaAttractions) {
        const searchQuery = `${attraction.title}, Mahdia, Tunisia`
        const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`

        await supabase.from("mahdia_attractions").update({ google_map_link: mapLink }).eq("id", attraction.id)
      }
    }

    // Update Chebba restaurants
    if (chebbaRestaurants && chebbaRestaurants.length > 0) {
      for (const restaurant of chebbaRestaurants) {
        const searchQuery = `${restaurant.title}, Chebba, Tunisia`
        const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`

        await supabase.from("restaurants_chebba").update({ google_map_link: mapLink }).eq("id", restaurant.id)
      }
    }

    // Update Mahdia restaurants
    if (mahdiaRestaurants && mahdiaRestaurants.length > 0) {
      for (const restaurant of mahdiaRestaurants) {
        const searchQuery = `${restaurant.title}, Mahdia, Tunisia`
        const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`

        await supabase.from("mahdia_restaurants").update({ google_map_link: mapLink }).eq("id", restaurant.id)
      }
    }

    // Update Chebba activities
    if (chebbaActivities && chebbaActivities.length > 0) {
      for (const activity of chebbaActivities) {
        const searchQuery = `${activity.title}, Chebba, Tunisia`
        const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`

        await supabase.from("activities_chebba").update({ google_map_link: mapLink }).eq("id", activity.id)
      }
    }

    // Update Mahdia activities
    if (mahdiaActivities && mahdiaActivities.length > 0) {
      for (const activity of mahdiaActivities) {
        const searchQuery = `${activity.title}, Mahdia, Tunisia`
        const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`

        await supabase.from("mahdia_activities").update({ google_map_link: mapLink }).eq("id", activity.id)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Map links updated successfully",
      counts: {
        chebbaAttractions: chebbaAttractions?.length || 0,
        mahdiaAttractions: mahdiaAttractions?.length || 0,
        chebbaRestaurants: chebbaRestaurants?.length || 0,
        mahdiaRestaurants: mahdiaRestaurants?.length || 0,
        chebbaActivities: chebbaActivities?.length || 0,
        mahdiaActivities: mahdiaActivities?.length || 0,
      },
    })
  } catch (error) {
    console.error("Error updating map links:", error)
    return NextResponse.json({ success: false, error: "Failed to update map links" }, { status: 500 })
  }
}
