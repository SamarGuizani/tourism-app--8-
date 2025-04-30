import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Create the function to get all attractions
    await supabase.rpc("create_get_all_attractions_function", {})

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating database functions:", error)
    return NextResponse.json({ error: "Failed to create database functions" }, { status: 500 })
  }
}
