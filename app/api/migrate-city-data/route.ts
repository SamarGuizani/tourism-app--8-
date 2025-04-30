import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = createClient()

    // Get a valid user ID for the added_by field
    const { data: userData, error: userError } = await supabase.from("users").select("id").limit(1)

    if (userError || !userData || userData.length === 0) {
      return NextResponse.json({ error: "No valid user found for added_by field" }, { status: 500 })
    }

    const userId = userData[0].id

    // Add missing columns to activities table if they don't exist
    await supabase.rpc("exec_sql", {
      sql_query: `
        ALTER TABLE activities 
        ADD COLUMN IF NOT EXISTS duration TEXT,
        ADD COLUMN IF NOT EXISTS difficulty TEXT,
        ADD COLUMN IF NOT EXISTS region TEXT;
      `,
    })

    // Get all city tables
    const { data: cityData, error: cityError } = await supabase.from("cities").select("slug, name, region")

    if (cityError) {
      return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 })
    }

    const results = {
      restaurants: { success: 0, errors: [] },
      activities: { success: 0, errors: [] },
    }

    // Process each city
    for (const city of cityData || []) {
      // Check if city-specific activities table exists
      const activityTableName = `activities_${city.slug}`
      const { data: activityTableExists } = await supabase.rpc("table_exists", { table_name: activityTableName })

      if (activityTableExists) {
        // Get the structure of the city-specific activities table
        const { data: activityColumns } = await supabase.rpc("get_table_structure", { table_name: activityTableName })

        // Build dynamic SQL to copy data based on available columns
        let activitySql = `
          INSERT INTO activities (
            id, name, description, location, added_by, city_slug, city_name, region, image_url
        `

        // Add optional columns if they exist in the source table
        if (activityColumns.some((col: any) => col.column_name === "google_map_link")) {
          activitySql += `, google_map_link`
        }
        if (activityColumns.some((col: any) => col.column_name === "duration")) {
          activitySql += `, duration`
        }
        if (activityColumns.some((col: any) => col.column_name === "difficulty")) {
          activitySql += `, difficulty`
        }
        if (activityColumns.some((col: any) => col.column_name === "type")) {
          activitySql += `, type`
        }

        activitySql += `) 
          SELECT 
            a.id, a.name, a.description, 
            COALESCE(a.city, '${city.name}') as location, 
            '${userId}'::uuid as added_by,
            '${city.slug}', '${city.name}', '${city.region}', a.image_url
        `

        // Add optional columns if they exist in the source table
        if (activityColumns.some((col: any) => col.column_name === "google_map_link")) {
          activitySql += `, a.google_map_link`
        }
        if (activityColumns.some((col: any) => col.column_name === "duration")) {
          activitySql += `, a.duration`
        }
        if (activityColumns.some((col: any) => col.column_name === "difficulty")) {
          activitySql += `, a.difficulty`
        }
        if (activityColumns.some((col: any) => col.column_name === "type")) {
          activitySql += `, a.type`
        }

        activitySql += `
          FROM 
            ${activityTableName} a
          ON CONFLICT (id) DO NOTHING;
        `

        // Execute the SQL
        const { error: activityError } = await supabase.rpc("exec_sql", { sql_query: activitySql })

        if (activityError) {
          results.activities.errors.push({ city: city.slug, error: activityError.message })
        } else {
          results.activities.success++
        }
      }

      // Check if city-specific restaurants table exists
      const restaurantTableName = `restaurants_${city.slug}`
      const { data: restaurantTableExists } = await supabase.rpc("table_exists", { table_name: restaurantTableName })

      if (restaurantTableExists) {
        // Get the structure of the city-specific restaurants table
        const { data: restaurantColumns } = await supabase.rpc("get_table_structure", {
          table_name: restaurantTableName,
        })

        // Build dynamic SQL to copy data based on available columns
        let restaurantSql = `
          INSERT INTO restaurants (
            id, name, description, location, added_by, city_slug, city_name, region, image_url
        `

        // Add optional columns if they exist in the source table
        if (restaurantColumns.some((col: any) => col.column_name === "google_map_link")) {
          restaurantSql += `, google_map_link`
        }
        if (restaurantColumns.some((col: any) => col.column_name === "cuisine")) {
          restaurantSql += `, cuisine`
        }
        if (restaurantColumns.some((col: any) => col.column_name === "price_range")) {
          restaurantSql += `, price_range`
        }

        restaurantSql += `) 
          SELECT 
            r.id, r.name, r.description, 
            COALESCE(r.city, '${city.name}') as location, 
            '${userId}'::uuid as added_by,
            '${city.slug}', '${city.name}', '${city.region}', r.image_url
        `

        // Add optional columns if they exist in the source table
        if (restaurantColumns.some((col: any) => col.column_name === "google_map_link")) {
          restaurantSql += `, r.google_map_link`
        }
        if (restaurantColumns.some((col: any) => col.column_name === "cuisine")) {
          restaurantSql += `, r.cuisine`
        }
        if (restaurantColumns.some((col: any) => col.column_name === "price_range")) {
          restaurantSql += `, r.price_range`
        }

        restaurantSql += `
          FROM 
            ${restaurantTableName} r
          ON CONFLICT (id) DO NOTHING;
        `

        // Execute the SQL
        const { error: restaurantError } = await supabase.rpc("exec_sql", { sql_query: restaurantSql })

        if (restaurantError) {
          results.restaurants.errors.push({ city: city.slug, error: restaurantError.message })
        } else {
          results.restaurants.success++
        }
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("Error in migrate-city-data:", error)
    return NextResponse.json({ error: "Failed to migrate city data" }, { status: 500 })
  }
}
