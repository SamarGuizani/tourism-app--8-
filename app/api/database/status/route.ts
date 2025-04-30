import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get table counts
    const tables = [
      "cities",
      "regions",
      "governorates",
      "activities",
      "restaurants",
      "attractions",
      "guides",
      "bookings",
    ]

    const counts = {}

    for (const table of tables) {
      try {
        const { data, error, count } = await supabase.from(table).select("*", { count: "exact", head: true })

        if (error) {
          counts[table] = { exists: false, error: error.message }
        } else {
          counts[table] = { exists: true, count }
        }
      } catch (err) {
        counts[table] = { exists: false, error: "Table does not exist" }
      }
    }

    // Get city-specific tables
    const { data: cities } = await supabase.from("cities").select("slug")
    const cityTables = {}

    if (cities) {
      for (const city of cities) {
        const citySlug = city.slug
        const tableTypes = ["activities", "restaurants", "attractions"]

        cityTables[citySlug] = {}

        for (const type of tableTypes) {
          const tableName = `${citySlug}_${type}`
          try {
            const { data: tableExists } = await supabase.rpc("table_exists", { table_name: tableName })

            if (tableExists) {
              const { count } = await supabase.from(tableName).select("*", { count: "exact", head: true })
              cityTables[citySlug][type] = { exists: true, count }
            } else {
              cityTables[citySlug][type] = { exists: false }
            }
          } catch (err) {
            cityTables[citySlug][type] = { exists: false, error: "Error checking table" }
          }
        }
      }
    }

    return NextResponse.json({
      status: "success",
      mainTables: counts,
      cityTables,
    })
  } catch (error) {
    console.error("Error in database status route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
