import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"
import { createTableStructureFunction } from "../sql-scripts/create-table-structure-function.sql"

export async function GET(request: Request) {
  try {
    const supabase = createClient()

    // Execute the SQL to create the function
    const { error } = await supabase.rpc("exec_sql", { sql_query: createTableStructureFunction })

    if (error) {
      console.error("Error creating table_structure function:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Table structure function created successfully" })
  } catch (error) {
    console.error("Error in create-table-structure-function:", error)
    return NextResponse.json({ error: "Failed to create table structure function" }, { status: 500 })
  }
}
