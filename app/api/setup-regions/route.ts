import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Create regions table if it doesn't exist
    await supabase.query(`
      CREATE TABLE IF NOT EXISTS regions (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        country TEXT DEFAULT 'Tunisia',
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)

    // Check if we already have data in the regions table
    const { data: existingRegions } = await supabase.from("regions").select("id").limit(1)

    if (existingRegions && existingRegions.length > 0) {
      return NextResponse.json({ message: "Regions table already has data" })
    }

    // Insert the regions data
    const regions = [
      {
        name: "North Tunisia",
        slug: "north-tunisia",
        description: "Explore the lush green landscapes and beautiful coastlines of Northern Tunisia",
        country: "Tunisia",
        image_url: "/regions/north-tunisia.jpg",
      },
      {
        name: "Central Tunisia",
        slug: "central-tunisia",
        description: "Discover the historical sites, desert oases, and unique architecture of Central Tunisia",
        country: "Tunisia",
        image_url: "/regions/central-tunisia.jpg",
      },
      {
        name: "South Tunisia",
        slug: "south-tunisia",
        description:
          "Experience the Sahara Desert, traditional Berber villages, and stunning landscapes of Southern Tunisia",
        country: "Tunisia",
        image_url: "/regions/south-tunisia.jpg",
      },
    ]

    const { error: regionsError } = await supabase.from("regions").insert(regions)

    if (regionsError) {
      throw regionsError
    }

    // Update cities table to ensure it has region references
    await supabase.query(`
      ALTER TABLE IF EXISTS cities 
      ADD COLUMN IF NOT EXISTS region TEXT
    `)

    // Update cities with their regions based on the data in lib/region-data.ts
    // North Tunisia cities
    await supabase
      .from("cities")
      .update({ region: "North Tunisia" })
      .in("slug", [
        "tunis-city",
        "medina-of-tunis",
        "carthage",
        "sidi-bou-said",
        "bizerte-city",
        "tabarka",
        "dougga",
        "bulla-regia",
        "hammamet",
        "kelibia",
        "nabeul-city",
        "testour",
        "beja-city",
        "uthina",
        "ben-arous-city",
        "la-marsa",
        "ain-draham",
        "rafraf",
        "haouaria",
      ])

    // Central Tunisia cities
    await supabase
      .from("cities")
      .update({ region: "Central Tunisia" })
      .in("slug", [
        "kairouan-city",
        "sousse-city",
        "monastir-city",
        "el-jem",
        "sfax-city",
        "chebba",
        "mahdia-city",
        "sbeitla",
        "kerkennah",
        "salakta",
        "oued-zitoun",
        "port-el-kantaoui",
      ])

    // South Tunisia cities
    await supabase
      .from("cities")
      .update({ region: "South Tunisia" })
      .in("slug", [
        "djerba",
        "houmt-souk",
        "midoun",
        "aghir",
        "tozeur-city",
        "tamerza",
        "douz",
        "matmata",
        "tataouine-city",
        "ksar-ghilane",
        "gabes-city",
        "medenine-city",
        "zarzis",
        "chebika",
        "ksar-ouled-soltane",
      ])

    return NextResponse.json({ message: "Regions setup completed successfully" })
  } catch (error) {
    console.error("Regions setup error:", error)
    return NextResponse.json({ error: "Failed to set up regions" }, { status: 500 })
  }
}
