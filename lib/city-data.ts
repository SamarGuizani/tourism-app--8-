import { supabase } from "@/lib/supabase"
import { formatCitySlugForDb } from "@/lib/region-data"

// Types for city data
export interface Attraction {
  id: string
  name: string
  description: string
  address?: string
  image_url?: string
  details?: string
  city_slug?: string
  region?: string
}

export interface Restaurant {
  id: string
  name: string
  description: string
  address?: string
  image_url?: string
  cuisine?: string
  price_range?: string
  city_slug?: string
  region?: string
}

export interface Activity {
  id: string
  name: string
  description: string
  address?: string
  image_url?: string
  duration?: string
  difficulty?: string
  type?: string
  city_slug?: string
  region?: string
}

// Function to fetch attractions for a city
export async function fetchCityAttractions(citySlug: string): Promise<Attraction[]> {
  try {
    const formattedSlug = formatCitySlugForDb(citySlug)

    // Try city-specific table first
    const { data: specificData, error: specificError } = await supabase.from(`attractions_${formattedSlug}`).select("*")

    if (!specificError && specificData && specificData.length > 0) {
      // Add city_slug to each item if not present
      return specificData.map((item) => ({
        ...item,
        city_slug: item.city_slug || citySlug,
      }))
    }

    // Fall back to general table
    const { data: generalData, error: generalError } = await supabase
      .from("attractions")
      .select("*")
      .eq("city_slug", citySlug)

    if (generalError) {
      console.error(`Error fetching attractions for ${citySlug}:`, generalError)
      return []
    }

    return generalData || []
  } catch (error) {
    console.error(`Error in fetchCityAttractions for ${citySlug}:`, error)
    return []
  }
}

// Function to fetch restaurants for a city
export async function fetchCityRestaurants(citySlug: string): Promise<Restaurant[]> {
  try {
    const formattedSlug = formatCitySlugForDb(citySlug)

    // Try city-specific table first
    const { data: specificData, error: specificError } = await supabase.from(`restaurants_${formattedSlug}`).select("*")

    if (!specificError && specificData && specificData.length > 0) {
      // Add city_slug to each item if not present
      return specificData.map((item) => ({
        ...item,
        city_slug: item.city_slug || citySlug,
      }))
    }

    // Fall back to general table
    const { data: generalData, error: generalError } = await supabase
      .from("restaurants")
      .select("*")
      .eq("city_slug", citySlug)

    if (generalError) {
      console.error(`Error fetching restaurants for ${citySlug}:`, generalError)
      return []
    }

    return generalData || []
  } catch (error) {
    console.error(`Error in fetchCityRestaurants for ${citySlug}:`, error)
    return []
  }
}

// Function to fetch activities for a city
export async function fetchCityActivities(citySlug: string): Promise<Activity[]> {
  try {
    const formattedSlug = formatCitySlugForDb(citySlug)

    // Try city-specific table first
    const { data: specificData, error: specificError } = await supabase.from(`activities_${formattedSlug}`).select("*")

    if (!specificError && specificData && specificData.length > 0) {
      // Add city_slug to each item if not present
      return specificData.map((item) => ({
        ...item,
        city_slug: item.city_slug || citySlug,
      }))
    }

    // Fall back to general table
    const { data: generalData, error: generalError } = await supabase
      .from("activities")
      .select("*")
      .eq("city_slug", citySlug)

    if (generalError) {
      console.error(`Error fetching activities for ${citySlug}:`, generalError)
      return []
    }

    return generalData || []
  } catch (error) {
    console.error(`Error in fetchCityActivities for ${citySlug}:`, error)
    return []
  }
}

// Function to fetch all data for a city
export async function fetchAllCityData(citySlug: string) {
  const [attractions, restaurants, activities] = await Promise.all([
    fetchCityAttractions(citySlug),
    fetchCityRestaurants(citySlug),
    fetchCityActivities(citySlug),
  ])

  return {
    attractions,
    restaurants,
    activities,
  }
}

// Function to add a new restaurant to both city-specific and global tables
export async function addRestaurant(restaurant: Omit<Restaurant, "id">) {
  try {
    // First, add to the global restaurants table
    const { data: globalData, error: globalError } = await supabase.from("restaurants").insert(restaurant).select()

    if (globalError) {
      console.error("Error adding restaurant to global table:", globalError)
      throw globalError
    }

    // If city_slug is provided, also add to city-specific table
    if (restaurant.city_slug) {
      const formattedSlug = formatCitySlugForDb(restaurant.city_slug)

      // Check if city-specific table exists
      const { data: tableExists } = await supabase.rpc("table_exists", {
        table_name: `restaurants_${formattedSlug}`,
      })

      // If table exists, add the restaurant to it
      if (tableExists) {
        const { error: specificError } = await supabase.from(`restaurants_${formattedSlug}`).insert(restaurant)

        if (specificError) {
          console.error(`Error adding restaurant to ${restaurant.city_slug} table:`, specificError)
        }
      }
    }

    return globalData?.[0] || null
  } catch (error) {
    console.error("Error in addRestaurant:", error)
    throw error
  }
}

// Similarly update the addActivity function:

export async function addActivity(activity: Omit<Activity, "id">) {
  try {
    // First, add to the global activities table
    const { data: globalData, error: globalError } = await supabase.from("activities").insert(activity).select()

    if (globalError) {
      console.error("Error adding activity to global table:", globalError)
      throw globalError
    }

    // If city_slug is provided, also add to city-specific table
    if (activity.city_slug) {
      const formattedSlug = formatCitySlugForDb(activity.city_slug)

      // Check if city-specific table exists
      const { data: tableExists } = await supabase.rpc("table_exists", {
        table_name: `activities_${formattedSlug}`,
      })

      // If table exists, add the activity to it
      if (tableExists) {
        const { error: specificError } = await supabase.from(`activities_${formattedSlug}`).insert(activity)

        if (specificError) {
          console.error(`Error adding activity to ${activity.city_slug} table:`, specificError)
        }
      }
    }

    return globalData?.[0] || null
  } catch (error) {
    console.error("Error in addActivity:", error)
    throw error
  }
}

// And update the addAttraction function:

export async function addAttraction(attraction: Omit<Attraction, "id">) {
  try {
    // First, add to the global attractions table
    const { data: globalData, error: globalError } = await supabase.from("attractions").insert(attraction).select()

    if (globalError) {
      console.error("Error adding attraction to global table:", globalError)
      throw globalError
    }

    // If city_slug is provided, also add to city-specific table
    if (attraction.city_slug) {
      const formattedSlug = formatCitySlugForDb(attraction.city_slug)

      // Check if city-specific table exists
      const { data: tableExists } = await supabase.rpc("table_exists", {
        table_name: `attractions_${formattedSlug}`,
      })

      // If table exists, add the attraction to it
      if (tableExists) {
        const { error: specificError } = await supabase.from(`attractions_${formattedSlug}`).insert(attraction)

        if (specificError) {
          console.error(`Error adding attraction to ${attraction.city_slug} table:`, specificError)
        }
      }
    }

    return globalData?.[0] || null
  } catch (error) {
    console.error("Error in addAttraction:", error)
    throw error
  }
}

// Update the checkCityTablesExist function to use table_exists:

export async function checkCityTablesExist(citySlug: string) {
  try {
    const formattedSlug = formatCitySlugForDb(citySlug)

    // Check if attractions table exists
    const { data: attractionsExists } = await supabase.rpc("table_exists", {
      table_name: `attractions_${formattedSlug}`,
    })

    // Check if restaurants table exists
    const { data: restaurantsExists } = await supabase.rpc("table_exists", {
      table_name: `restaurants_${formattedSlug}`,
    })

    // Check if activities table exists
    const { data: activitiesExists } = await supabase.rpc("table_exists", {
      table_name: `activities_${formattedSlug}`,
    })

    // If any of the tables don't exist, return false
    if (!attractionsExists || !restaurantsExists || !activitiesExists) {
      return false
    }

    return true
  } catch (error) {
    console.error(`Error checking tables for ${citySlug}:`, error)
    return false
  }
}
