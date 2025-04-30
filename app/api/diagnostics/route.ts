import { NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Create server client
    const supabase = createServerComponentClient({ cookies })

    // Test database connection
    const { data, error } = await supabase.from("regions").select("id").limit(1)

    // Check environment variables
    const envVars = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "defined" : "undefined",
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "defined" : "undefined",
    }

    return NextResponse.json({
      status: "success",
      diagnostics: {
        envVars,
        supabaseConnection: error ? "failed" : "success",
        supabaseData: data ? "received" : "empty",
        error: error ? error.message : null,
        nodeEnv: process.env.NODE_ENV || "undefined",
      },
    })
  } catch (err) {
    console.error("Diagnostics API route error:", err)
    return NextResponse.json(
      {
        status: "error",
        message: err instanceof Error ? err.message : "Unknown error",
        stack: process.env.NODE_ENV !== "production" && err instanceof Error ? err.stack : undefined,
      },
      { status: 500 },
    )
  }
}
