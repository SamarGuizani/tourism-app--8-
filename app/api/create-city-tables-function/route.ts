import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createCityTablesFunction } from "../sql-scripts/create-city-tables-function"

export async function GET() {
  try {
    // Create the function
    const { error } = await supabase.rpc("execute_sql", { sql_query: createCityTablesFunction })

    if (error) {
      console.error("Error creating function:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "City tables function created successfully" })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
