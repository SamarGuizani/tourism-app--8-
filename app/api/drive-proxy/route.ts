import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const fileId = searchParams.get("fileId")

  if (!fileId) {
    return NextResponse.json({ error: "File ID is required" }, { status: 400 })
  }

  try {
    const driveUrl = `https://drive.google.com/uc?export=view&id=${fileId}`
    const response = await fetch(driveUrl)

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch image from Google Drive" }, { status: 500 })
    }

    const contentType = response.headers.get("content-type") || "image/jpeg"
    const buffer = await response.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch (error) {
    console.error("Error fetching from Google Drive:", error)
    return NextResponse.json({ error: "Failed to proxy image" }, { status: 500 })
  }
}
