import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { slug: string[] } }) {
  const slugParts = params.slug
  const fullSlug = slugParts.join("/")

  try {
    // Check if the city exists
    const { data: cityData, error: cityError } = await supabase
      .from("city")
      .select("*")
      .eq("slug", slugParts[0])
      .single()

    // Try to get table information
    const { data: tableInfo, error: tableError } = await supabase
      .from("pg_tables")
      .select("tablename")
      .eq("schemaname", "public")
      .ilike("tablename", `%${slugParts[0]}%`)

    return NextResponse.json({
      route: {
        fullSlug,
        slugParts,
      },
      city: {
        data: cityData,
        error: cityError ? cityError.message : null,
      },
      tables: {
        data: tableInfo,
        error: tableError ? tableError.message : null,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
