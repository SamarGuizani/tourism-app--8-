import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Add new columns to bookings table
    await supabase.rpc("execute_sql", {
      sql_query: `
        DO $
        BEGIN
          -- Add attraction_id column if it doesn't exist
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'bookings' AND column_name = 'attraction_id'
          ) THEN
            ALTER TABLE bookings ADD COLUMN attraction_id UUID;
          END IF;

          -- Add restaurant_id column if it doesn't exist
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'bookings' AND column_name = 'restaurant_id'
          ) THEN
            ALTER TABLE bookings ADD COLUMN restaurant_id UUID;
          END IF;

          -- Add activity_id column if it doesn't exist
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'bookings' AND column_name = 'activity_id'
          ) THEN
            ALTER TABLE bookings ADD COLUMN activity_id UUID;
          END IF;
        END $;
      `,
    })

    return NextResponse.json({ message: "Bookings schema updated successfully" })
  } catch (error) {
    console.error("Error updating bookings schema:", error)
    return NextResponse.json({ error: "Failed to update bookings schema" }, { status: 500 })
  }
}
