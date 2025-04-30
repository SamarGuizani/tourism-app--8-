import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Query to get all tables in the public schema
    const { data, error } = await supabase.from("pg_tables").select("tablename").eq("schemaname", "public")

    if (error) {
      console.error("Error fetching tables:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Extract table names from the result
    const tables = data.map((table: any) => table.tablename)

    return NextResponse.json({ tables })
  } catch (error) {
    console.error("Error in /api/database/tables:", error)
    return NextResponse.json({ error: "Failed to fetch tables", details: error.message }, { status: 500 })
  }
}
