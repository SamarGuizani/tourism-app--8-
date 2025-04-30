import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Add new columns to guides table
    await supabase.rpc("execute_sql", {
      sql_query: `
       DO $$
       BEGIN
         -- Add phone_number column if it doesn't exist
         IF NOT EXISTS (
           SELECT 1 FROM information_schema.columns 
           WHERE table_name = 'guides' AND column_name = 'phone_number'
         ) THEN
           ALTER TABLE guides ADD COLUMN phone_number TEXT;
         END IF;

         -- Add age column if it doesn't exist
         IF NOT EXISTS (
           SELECT 1 FROM information_schema.columns 
           WHERE table_name = 'guides' AND column_name = 'age'
         ) THEN
           ALTER TABLE guides ADD COLUMN age INTEGER;
         END IF;

         -- Add contact_email column if it doesn't exist
         IF NOT EXISTS (
           SELECT 1 FROM information_schema.columns 
           WHERE table_name = 'guides' AND column_name = 'contact_email'
         ) THEN
           ALTER TABLE guides ADD COLUMN contact_email TEXT;
         END IF;

         -- Add photo_url column if it doesn't exist
         IF NOT EXISTS (
           SELECT 1 FROM information_schema.columns 
           WHERE table_name = 'guides' AND column_name = 'photo_url'
         ) THEN
           ALTER TABLE guides ADD COLUMN photo_url TEXT;
         END IF;
       END $$;
     `,
    })

    return NextResponse.json({ message: "Guide schema updated successfully" })
  } catch (error) {
    console.error("Error updating guide schema:", error)
    return NextResponse.json({ error: "Failed to update guide schema" }, { status: 500 })
  }
}
