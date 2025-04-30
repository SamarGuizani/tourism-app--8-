import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!

export async function POST(request: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Create the exec_sql function if it doesn't exist
    const createFunctionSql = `
      CREATE OR REPLACE FUNCTION exec_sql(sql text) RETURNS void AS $$
      BEGIN
        EXECUTE sql;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `

    // Execute the function creation - properly handle the response
    const createFunctionResult = await supabase.rpc("exec_sql", { sql: createFunctionSql })

    // If there's an error but it's not because the function already exists, log it
    if (createFunctionResult.error) {
      console.log("Note: Could not create exec_sql function:", createFunctionResult.error.message)
      // We'll continue anyway, as the function might already exist
    }

    const { sql } = await request.json()

    if (!sql) {
      return NextResponse.json({ error: "SQL query is required" }, { status: 400 })
    }

    // Execute the provided SQL
    const { data, error } = await supabase.rpc("exec_sql", { sql })

    if (error) {
      console.error("SQL execution error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "SQL executed successfully" })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to execute SQL" },
      { status: 500 },
    )
  }
}
