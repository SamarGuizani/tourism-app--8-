import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "SQL query is required" }, { status: 400 })
    }

    // Basic security check to prevent destructive queries
    const lowerQuery = query.toLowerCase()
    if (
      lowerQuery.includes("drop table") ||
      lowerQuery.includes("truncate table") ||
      (lowerQuery.includes("delete from") && !lowerQuery.includes("where"))
    ) {
      return NextResponse.json(
        {
          error:
            "Potentially destructive query detected. Please add appropriate WHERE clauses or use a different query.",
        },
        { status: 400 },
      )
    }

    const supabase = createClient()

    // Execute the provided SQL
    const { data, error } = await supabase.rpc("exec_sql", { sql_query: query })

    if (error) {
      console.error("SQL execution error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Failed to execute SQL", details: error.message }, { status: 500 })
  }
}
