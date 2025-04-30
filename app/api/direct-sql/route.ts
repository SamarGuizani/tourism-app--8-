import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a new Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!

export async function POST(request: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { sql } = await request.json()

    if (!sql) {
      return NextResponse.json({ error: "SQL query is required" }, { status: 400 })
    }

    console.log("Executing SQL:", sql)

    // First, try to create a function to execute SQL if it doesn't exist
    try {
      // Create a temporary function to execute SQL
      await supabase.rpc("create_exec_sql_function")
    } catch (error) {
      console.log("Function may already exist or couldn't be created:", error)
      // Continue anyway, as the function might already exist
    }

    // Now try to execute the SQL using the function
    const { data, error } = await supabase.rpc("exec_sql", { sql_query: sql })

    if (error) {
      console.error("Error executing SQL:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to execute SQL" },
      { status: 500 },
    )
  }
}
