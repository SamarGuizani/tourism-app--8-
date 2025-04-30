import { supabase } from "./supabase-client"

// Helper function to handle errors consistently
async function handleSupabaseQuery(query: any, errorMessage: string) {
  try {
    const { data, error } = await query

    if (error) {
      console.error(`${errorMessage}:`, error)
      return []
    }

    return data || []
  } catch (err) {
    console.error(`${errorMessage}:`, err)
    return []
  }
}

// Activities
export async function getAllActivities() {
  return handleSupabaseQuery(supabase.from("activities").select("*").order("name"), "Error fetching activities")
}

export async function getActivitiesByCity(citySlug: string) {
  return handleSupabaseQuery(
    supabase.from("activities").select("*").eq("city_slug", citySlug).order("name"),
    `Error fetching activities for ${citySlug}`,
  )
}

export async function getActivityById(id: string) {
  try {
    const { data, error } = await supabase.from("activities").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching activity ${id}:`, error)
      return null
    }

    return data
  } catch (err) {
    console.error(`Error fetching activity ${id}:`, err)
    return null
  }
}

// Restaurants
export async function getAllRestaurants() {
  return handleSupabaseQuery(supabase.from("restaurants").select("*").order("name"), "Error fetching restaurants")
}

export async function getRestaurantsByCity(citySlug: string) {
  return handleSupabaseQuery(
    supabase.from("restaurants").select("*").eq("city_slug", citySlug).order("name"),
    `Error fetching restaurants for ${citySlug}`,
  )
}

export async function getRestaurantById(id: string) {
  try {
    const { data, error } = await supabase.from("restaurants").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching restaurant ${id}:`, error)
      return null
    }

    return data
  } catch (err) {
    console.error(`Error fetching restaurant ${id}:`, err)
    return null
  }
}

// Cities
export async function getAllCities() {
  return handleSupabaseQuery(supabase.from("cities").select("*").order("name"), "Error fetching cities")
}

export async function getCityBySlug(slug: string) {
  try {
    // Try to get from cities table first
    const { data, error } = await supabase.from("cities").select("*").eq("slug", slug).limit(1).maybeSingle()

    if (error || !data) {
      console.warn(`Error or no data fetching city ${slug} from cities table:`, error)

      // Fallback to city table
      const result = await supabase.from("city").select("*").eq("slug", slug).limit(1).maybeSingle()

      if (result.error) {
        console.error(`Error fetching city ${slug} from city table:`, result.error)
        return null
      }

      return result.data
    }

    return data
  } catch (err) {
    console.error(`Error fetching city ${slug}:`, err)
    return null
  }
}

// Regions
export async function getAllRegions() {
  return handleSupabaseQuery(supabase.from("regions").select("*").order("name"), "Error fetching regions")
}

export async function getRegionById(id: string) {
  try {
    const { data, error } = await supabase.from("regions").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching region ${id}:`, error)
      return null
    }

    return data
  } catch (err) {
    console.error(`Error fetching region ${id}:`, err)
    return null
  }
}
