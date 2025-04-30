import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a new Supabase client directly in the route handler
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log("Fetching regions")
    const { data, error } = await supabase.from("regions").select("*").order("name")

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`Found ${data?.length || 0} regions`)
    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch regions" },
      { status: 500 },
    )
  }
}
