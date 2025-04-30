import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const table = searchParams.get("table")
    const limit = searchParams.get("limit") || "10"

    if (!table) {
      return NextResponse.json({ error: "Table parameter is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Query to get data from the specified table
    const { data, error } = await supabase.from(table).select("*").limit(Number.parseInt(limit))

    if (error) {
      console.error("Error fetching table data:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ rows: data })
  } catch (error) {
    console.error("Error in /api/database/data:", error)
    return NextResponse.json({ error: "Failed to fetch table data", details: error.message }, { status: 500 })
  }
}
