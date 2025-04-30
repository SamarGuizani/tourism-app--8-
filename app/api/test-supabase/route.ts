import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"

export async function GET() {
  try {
    // Test the Supabase connection by fetching the server version
    const { data, error } = await supabase.rpc("version")

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to connect to Supabase",
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Successfully connected to Supabase",
      version: data,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while testing the Supabase connection",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
