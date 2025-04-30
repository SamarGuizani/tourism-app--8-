import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { linkRestaurantsSQL } from "../sql-scripts/link-restaurants"

export async function GET() {
  try {
    // Execute the SQL script
    const { error } = await supabase.rpc("exec_sql", {
      sql_query: linkRestaurantsSQL,
    })

    if (error) {
      console.error("Error executing SQL script:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    // Test the new function
    const { data: restaurants, error: fetchError } = await supabase.rpc("get_all_restaurants")

    if (fetchError) {
      console.error("Error fetching restaurants:", fetchError)
      return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Restaurants linked successfully",
      count: restaurants?.length || 0,
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ success: false, error: "An unexpected error occurred" }, { status: 500 })
  }
}
