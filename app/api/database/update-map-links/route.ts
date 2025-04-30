import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = createClient()

    // Get all tables that might need Google Map links
    const { data: tables, error: tablesError } = await supabase.rpc("get_all_tables")

    if (tablesError) {
      console.error("Error fetching tables:", tablesError)
      return NextResponse.json({ error: tablesError.message }, { status: 500 })
    }

    const relevantTables = tables
      .map((table: any) => table.table_name)
      .filter(
        (tableName: string) =>
          tableName.includes("activities") || tableName.includes("attractions") || tableName.includes("restaurants"),
      )

    // Update Google Map links for each table
    for (const tableName of relevantTables) {
      try {
        const { error } = await supabase.rpc("update_google_map_links", { table_name: tableName })

        if (error) {
          console.error(`Error updating Google Map links for ${tableName}:`, error)
        }
      } catch (tableError) {
        console.error(`Exception updating Google Map links for ${tableName}:`, tableError)
      }
    }

    return NextResponse.json({
      message: `Google Map links updated for ${relevantTables.length} tables`,
      tables: relevantTables,
    })
  } catch (error) {
    console.error("Error in /api/database/update-map-links:", error)
    return NextResponse.json({ error: "Failed to update Google Map links" }, { status: 500 })
  }
}
