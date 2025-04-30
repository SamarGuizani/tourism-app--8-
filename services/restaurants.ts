import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

export async function fetchRestaurants() {
  const supabase = createClientComponentClient<Database>()

  const { data, error } = await supabase.from("restaurants").select("*")

  if (error) {
    throw new Error(`Failed to fetch restaurants: ${error.message}`)
  }

  return data
}

export async function fetchRestaurantById(id: string) {
  const supabase = createClientComponentClient<Database>()

  const { data, error } = await supabase.from("restaurants").select("*").eq("id", id)

  if (error) {
    throw new Error(`Failed to fetch restaurant: ${error.message}`)
  }

  return data.length > 0 ? data[0] : null
}

export async function fetchRestaurantsByCity(cityId: string) {
  const supabase = createClientComponentClient<Database>()

  const { data, error } = await supabase.from("restaurants").select("*").eq("city_id", cityId)

  if (error) {
    throw new Error(`Failed to fetch restaurants by city: ${error.message}`)
  }

  return data
}
