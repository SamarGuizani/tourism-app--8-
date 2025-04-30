import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const {
      guide_id,
      tourist_id,
      location,
      date,
      hours,
      total_price,
      commission,
      net_amount,
      attraction_id,
      restaurant_id,
      activity_id,
    } = await request.json()

    // Validate required fields
    if (!guide_id || !tourist_id || !location || !date || !hours || !total_price || !commission || !net_amount) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Validate tourist_id exists in auth.users
    const { data: userData, error: userError } = await supabase.from("users").select("id").eq("id", tourist_id).single()

    if (userError || !userData) {
      return NextResponse.json({ success: false, message: "Invalid tourist ID" }, { status: 400 })
    }

    // Helper function to check if a column exists in a table
    const columnExists = async (tableName: string, columnName: string): Promise<boolean> => {
      const { data, error } = await supabase
        .from("information_schema.columns")
        .select("*")
        .eq("table_name", tableName)
        .eq("column_name", columnName)
      return data && data.length > 0
    }

    // Check if the bookings table has the required columns
    const hasAttractionId = await columnExists("bookings", "attraction_id")
    const hasRestaurantId = await columnExists("bookings", "restaurant_id")
    const hasActivityId = await columnExists("bookings", "activity_id")

    // Construct the booking data object
    const bookingData: {
      guide_id: string
      tourist_id: string
      location: string
      date: string
      hours: number
      total_price: number
      commission: number
      net_amount: number
      attraction_id?: string | null
      restaurant_id?: string | null
      activity_id?: string | null
    } = {
      guide_id,
      tourist_id,
      location,
      date,
      hours,
      total_price,
      commission,
      net_amount,
    }

    // Conditionally add the columns if they exist
    if (hasAttractionId) {
      bookingData.attraction_id = attraction_id || null
    }
    if (hasRestaurantId) {
      bookingData.restaurant_id = restaurant_id || null
    }
    if (hasActivityId) {
      bookingData.activity_id = activity_id || null
    }

    const { error } = await supabase.from("bookings").insert([bookingData])

    if (error) {
      console.error("Error creating booking:", error)
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Booking created successfully" })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ success: false, message: "Failed to create booking" }, { status: 500 })
  }
}
