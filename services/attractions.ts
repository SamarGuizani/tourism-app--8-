import { createClientInstance } from "@/lib/supabase-client"

export async function fetchAttractions() {
  const supabase = createClientInstance()

  const { data, error } = await supabase.from("attractions").select("*").order("name")

  if (error) {
    throw new Error(`Failed to fetch attractions: ${error.message}`)
  }

  return data || []
}

export async function fetchAttractionById(id: string) {
  const supabase = createClientInstance()

  const { data, error } = await supabase.from("attractions").select("*").eq("id", id)

  if (error) {
    throw new Error(`Failed to fetch attraction: ${error.message}`)
  }

  return data && data.length > 0 ? data[0] : null
}

export async function fetchAttractionsByCity(cityId: string) {
  const supabase = createClientInstance()

  const { data, error } = await supabase.from("attractions").select("*").eq("city_id", cityId)

  if (error) {
    throw new Error(`Failed to fetch attractions by city: ${error.message}`)
  }

  return data || []
}
