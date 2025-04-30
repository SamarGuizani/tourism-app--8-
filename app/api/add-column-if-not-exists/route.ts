import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { table_name, column_name, column_type } = await request.json()

    if (!table_name || !column_name || !column_type) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const supabase = createServerComponentClient({ cookies })

    // Check if column exists
    const { data: columnExists, error: checkError } = await supabase
      .from("information_schema.columns")
      .select("column_name")
      .eq("table_schema", "public")
      .eq("table_name", table_name)
      .eq("column_name", column_name)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      return NextResponse.json({ error: checkError.message }, { status: 500 })
    }

    // If column doesn't exist, add it
    if (!columnExists) {
      const { error: addError } = await supabase.rpc("add_column_if_not_exists", {
        table_name,
        column_name,
        column_type,
      })

      if (addError) {
        return NextResponse.json({ error: addError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
