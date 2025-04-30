import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const table = searchParams.get("table")

    if (!table) {
      return NextResponse.json({ error: "Table parameter is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Query to get the schema of the specified table
    const { data, error } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type")
      .eq("table_schema", "public")
      .eq("table_name", table)

    if (error) {
      console.error("Error fetching table schema:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      table_schema: "public",
      table_name: table,
      columns: data,
    })
  } catch (error) {
    console.error("Error in /api/database/schema:", error)
    return NextResponse.json({ error: "Failed to fetch table schema", details: error.message }, { status: 500 })
  }
}
