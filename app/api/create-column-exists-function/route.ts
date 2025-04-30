import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createColumnExistsFunction } from "../sql-scripts/create-column-exists-function"

export async function GET() {
  try {
    // Create the function
    const { error } = await supabase.rpc("execute_sql", { sql_query: createColumnExistsFunction })

    if (error) {
      console.error("Error creating column_exists function:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Column exists function created successfully" })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
