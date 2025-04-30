import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

export async function fetchCities() {
  const supabase = createClientComponentClient<Database>()

  const { data, error } = await supabase.from("city").select("*")

  if (error) {
    throw new Error(`Failed to fetch cities: ${error.message}`)
  }

  return data
}

export async function getCityBySlug(slug: string) {
  const supabase = createClientComponentClient<Database>()

  const { data, error } = await supabase.from("city").select("*").eq("slug", slug).limit(1).maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch city: ${error.message}`)
  }

  return data
}

export async function searchCities(query: string) {
  const supabase = createClientComponentClient<Database>()

  const { data, error } = await supabase.from("city").select("id, name, slug").ilike("name", `%${query}%`).limit(5)

  if (error) {
    throw new Error(`Failed to search cities: ${error.message}`)
  }

  return data
}
