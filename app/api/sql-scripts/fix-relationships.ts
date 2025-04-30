import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // SQL to create the function that fixes relationships
    const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION fix_database_relationships()
    RETURNS void AS $$
    BEGIN
      -- Add city_slug column to restaurants if it doesn't exist
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'restaurants' AND column_name = 'city_slug'
      ) THEN
        ALTER TABLE restaurants ADD COLUMN city_slug TEXT;
      END IF;
      
      -- Add city_name column to restaurants if it doesn't exist
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'restaurants' AND column_name = 'city_name'
      ) THEN
        ALTER TABLE restaurants ADD COLUMN city_name TEXT;
      END IF;
      
      -- Add city_slug column to activities if it doesn't exist
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'activities' AND column_name = 'city_slug'
      ) THEN
        ALTER TABLE activities ADD COLUMN city_slug TEXT;
      END IF;
      
      -- Add city_name column to activities if it doesn't exist
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'activities' AND column_name = 'city_name'
      ) THEN
        ALTER TABLE activities ADD COLUMN city_name TEXT;
      END IF;
      
      -- Add type column to activities if it doesn't exist
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'activities' AND column_name = 'type'
      ) THEN
        ALTER TABLE activities ADD COLUMN type TEXT;
      END IF;
      
      -- Update restaurants with default city information if missing
      UPDATE restaurants
      SET 
        city_slug = COALESCE(city_slug, 'tunis-city'),
        city_name = COALESCE(city_name, 'Tunis')
      WHERE 
        city_slug IS NULL OR city_name IS NULL;
        
      -- Update activities with default city information if missing
      UPDATE activities
      SET 
        city_slug = COALESCE(city_slug, 'tunis-city'),
        city_name = COALESCE(city_name, 'Tunis'),
        type = COALESCE(type, 
          CASE 
            WHEN name ILIKE '%tour%' THEN 'Tour'
            WHEN name ILIKE '%hike%' OR name ILIKE '%trek%' THEN 'Outdoor'
            WHEN name ILIKE '%museum%' OR name ILIKE '%cultural%' THEN 'Cultural'
            ELSE 'Sightseeing'
          END
        )
      WHERE 
        city_slug IS NULL OR city_name IS NULL OR type IS NULL;
    END;
    $$ LANGUAGE plpgsql;
    `

    // Execute the SQL to create the function
    const { error: createFunctionError } = await supabase.rpc("fix_database_relationships")

    if (createFunctionError) {
      // If the function doesn't exist yet, create it
      const { error: sqlError } = await supabase.query(createFunctionSQL)

      if (sqlError) {
        console.error("Error creating function:", sqlError)
        return NextResponse.json({ error: sqlError.message }, { status: 500 })
      }

      // Now call the function
      const { error: callError } = await supabase.rpc("fix_database_relationships")

      if (callError) {
        console.error("Error calling function:", callError)
        return NextResponse.json({ error: callError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, message: "Database relationships fixed successfully" })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
