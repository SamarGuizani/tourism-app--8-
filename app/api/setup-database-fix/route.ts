import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Fix restaurants table - add cuisine_type if it doesn't exist
    await supabase.rpc("execute_sql", {
      sql_query: `
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'restaurants' AND column_name = 'cuisine_type'
          ) THEN
            ALTER TABLE restaurants ADD COLUMN cuisine_type TEXT;
            
            -- Update existing records with default values
            UPDATE restaurants SET cuisine_type = 
              CASE 
                WHEN name ILIKE '%seafood%' THEN 'seafood'
                WHEN name ILIKE '%traditional%' THEN 'traditional'
                ELSE 'mediterranean'
              END;
          END IF;
        END $$;
      `,
    })

    // Create guides table if it doesn't exist
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS guides (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL,
          bio TEXT NOT NULL,
          languages TEXT[] NOT NULL,
          locations TEXT[] NOT NULL,
          tourist_price INTEGER NOT NULL DEFAULT 30,
          local_price INTEGER NOT NULL DEFAULT 10,
          rating FLOAT NOT NULL DEFAULT 5.0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    // Create city_reviews table if it doesn't exist
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS city_reviews (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL,
          city_slug TEXT NOT NULL,
          rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
          comment TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    // Create media_galleries table if it doesn't exist
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS media_galleries (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          city_slug TEXT NOT NULL,
          media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
          url TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    // Create city_guides table if it doesn't exist
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS city_guides (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          guide_id UUID NOT NULL,
          city_slug TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    return NextResponse.json({ message: "Database fix completed successfully" })
  } catch (error) {
    console.error("Database fix error:", error)
    return NextResponse.json({ error: "Failed to fix database" }, { status: 500 })
  }
}
