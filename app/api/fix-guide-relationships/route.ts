import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // 1. Create a function to ensure the city_guides table exists
    const createCityGuidesTableSQL = `
      CREATE TABLE IF NOT EXISTS city_guides (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        city_slug TEXT NOT NULL,
        guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(city_slug, guide_id)
      );
    `

    // 2. Create a function to populate the city_guides table from guides.locations
    const populateCityGuidesSQL = `
      CREATE OR REPLACE FUNCTION populate_city_guides() RETURNS void AS $$
      DECLARE
        guide_record RECORD;
        location TEXT;
      BEGIN
        -- Clear existing entries to avoid duplicates
        DELETE FROM city_guides;
        
        -- Loop through each guide
        FOR guide_record IN SELECT id, locations FROM guides LOOP
          -- Loop through each location in the guide's locations array
          FOREACH location IN ARRAY guide_record.locations LOOP
            -- Insert a record into city_guides
            INSERT INTO city_guides (city_slug, guide_id)
            VALUES (location, guide_record.id)
            ON CONFLICT (city_slug, guide_id) DO NOTHING;
          END LOOP;
        END LOOP;
      END;
      $$ LANGUAGE plpgsql;
    `

    // 3. Create a trigger to keep city_guides in sync with guides.locations
    const createTriggerSQL = `
      CREATE OR REPLACE FUNCTION update_city_guides() RETURNS TRIGGER AS $$
      DECLARE
        location TEXT;
      BEGIN
        -- If locations array was updated
        IF OLD.locations IS DISTINCT FROM NEW.locations THEN
          -- Remove old associations
          DELETE FROM city_guides WHERE guide_id = NEW.id;
          
          -- Add new associations
          FOREACH location IN ARRAY NEW.locations LOOP
            INSERT INTO city_guides (city_slug, guide_id)
            VALUES (location, NEW.id)
            ON CONFLICT (city_slug, guide_id) DO NOTHING;
          END LOOP;
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS guides_locations_trigger ON guides;
      
      CREATE TRIGGER guides_locations_trigger
      AFTER UPDATE ON guides
      FOR EACH ROW
      EXECUTE FUNCTION update_city_guides();
    `

    // Execute the SQL statements
    await supabase.rpc("exec_sql", { sql: createCityGuidesTableSQL })
    await supabase.rpc("exec_sql", { sql: populateCityGuidesSQL })
    await supabase.rpc("exec_sql", { sql: createTriggerSQL })

    // Run the populate function
    await supabase.rpc("exec_sql", { sql: "SELECT populate_city_guides();" })

    return NextResponse.json({ success: true, message: "Guide relationships fixed successfully" })
  } catch (error) {
    console.error("Error fixing guide relationships:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
