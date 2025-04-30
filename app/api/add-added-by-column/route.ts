import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Add added_by column to cities table
    await supabase.rpc("execute_sql", {
      sql_query: `
        DO $
        BEGIN
          -- Add added_by column if it doesn't exist
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'cities' AND column_name = 'added_by'
          ) THEN
            ALTER TABLE cities ADD COLUMN added_by UUID;
          END IF;
        END $;
      `,
    })

    return NextResponse.json({ message: "Added 'added_by' column to cities table successfully" })
  } catch (error) {
    console.error("Error adding 'added_by' column:", error)
    return NextResponse.json({ error: "Failed to add 'added_by' column" }, { status: 500 })
  }
}
