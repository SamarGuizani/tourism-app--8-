import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Log the issues being reported
    console.log("Build fix request received:", body)

    return NextResponse.json({
      status: "success",
      message: "Build issues reported successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error("Error in build-fix API route:", err)
    return NextResponse.json(
      {
        status: "error",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
