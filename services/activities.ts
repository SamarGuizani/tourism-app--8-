import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

export async function fetchActivities() {
  const supabase = createClientComponentClient<Database>()

  const { data, error } = await supabase.from("activities").select("*")

  if (error) {
    throw new Error(`Failed to fetch activities: ${error.message}`)
  }

  return data
}

export async function fetchActivityById(id: string) {
  const supabase = createClientComponentClient<Database>()

  const { data, error } = await supabase.from("activities").select("*").eq("id", id)

  if (error) {
    throw new Error(`Failed to fetch activity: ${error.message}`)
  }

  return data.length > 0 ? data[0] : null
}

export async function fetchActivitiesByCity(cityId: string) {
  const supabase = createClientComponentClient<Database>()

  const { data, error } = await supabase.from("activities").select("*").eq("city_id", cityId)

  if (error) {
    throw new Error(`Failed to fetch activities by city: ${error.message}`)
  }

  return data
}
