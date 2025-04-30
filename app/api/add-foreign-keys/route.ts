import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = createClient()

    // First, check if the city_slug column exists in the restaurants and activities tables
    const checkRestaurantsColumnSql = `
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'restaurants' 
        AND column_name = 'city_slug'
      );
    `

    const checkActivitiesColumnSql = `
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'activities' 
        AND column_name = 'city_slug'
      );
    `

    const { data: restaurantsColumnExists, error: restaurantsColumnError } = await supabase.rpc("exec_sql", {
      sql_query: checkRestaurantsColumnSql,
    })

    const { data: activitiesColumnExists, error: activitiesColumnError } = await supabase.rpc("exec_sql", {
      sql_query: checkActivitiesColumnSql,
    })

    if (restaurantsColumnError || activitiesColumnError) {
      return NextResponse.json({ error: "Error checking column existence" }, { status: 500 })
    }

    // Add foreign key constraints if the columns exist
    const results = {
      restaurants_fk: false,
      activities_fk: false,
    }

    if (restaurantsColumnExists && restaurantsColumnExists[0] && restaurantsColumnExists[0].exists) {
      // Add foreign key to restaurants table
      const addRestaurantsFkSql = `
        ALTER TABLE restaurants
        ADD CONSTRAINT fk_restaurants_city
        FOREIGN KEY (city_slug)
        REFERENCES cities(slug)
        ON DELETE SET NULL;
      `

      const { error: restaurantsFkError } = await supabase.rpc("exec_sql", {
        sql_query: addRestaurantsFkSql,
      })

      results.restaurants_fk = !restaurantsFkError

      if (restaurantsFkError) {
        console.error("Error adding foreign key to restaurants table:", restaurantsFkError)
      }
    }

    if (activitiesColumnExists && activitiesColumnExists[0] && activitiesColumnExists[0].exists) {
      // Add foreign key to activities table
      const addActivitiesFkSql = `
        ALTER TABLE activities
        ADD CONSTRAINT fk_activities_city
        FOREIGN KEY (city_slug)
        REFERENCES cities(slug)
        ON DELETE SET NULL;
      `

      const { error: activitiesFkError } = await supabase.rpc("exec_sql", {
        sql_query: addActivitiesFkSql,
      })

      results.activities_fk = !activitiesFkError

      if (activitiesFkError) {
        console.error("Error adding foreign key to activities table:", activitiesFkError)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Foreign key relationships updated",
      results,
    })
  } catch (error) {
    console.error("Error in add-foreign-keys:", error)
    return NextResponse.json({ error: "Failed to add foreign keys" }, { status: 500 })
  }
}
