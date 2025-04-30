import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

export type Place = {
  id?: string
  name: string
  description: string
  location?: string
  image_url?: string
  city_id?: string
  created_at?: string
}

export async function fetchPlaces() {
  const supabase = createClientComponentClient<Database>()

  const { data, error } = await supabase.from("places").select("*")

  if (error) {
    throw new Error(`Failed to fetch places: ${error.message}`)
  }

  return data
}

export async function fetchPlaceById(id: string) {
  const supabase = createClientComponentClient<Database>()

  const { data, error } = await supabase.from("places").select("*").eq("id", id)

  if (error) {
    throw new Error(`Failed to fetch place: ${error.message}`)
  }

  return data.length > 0 ? data[0] : null
}

export async function addPlace(place: Omit<Place, "id">) {
  const supabase = createClientComponentClient<Database>()

  const { data, error } = await supabase.from("places").insert(place)

  if (error) {
    throw new Error(`Failed to add place: ${error.message}`)
  }

  return data[0]
}

export async function updatePlace(id: string, place: Partial<Place>) {
  const supabase = createClientComponentClient<Database>()

  const { data, error } = await supabase.from("places").update(place).eq("id", id)

  if (error) {
    throw new Error(`Failed to update place: ${error.message}`)
  }

  return data[0]
}

export async function deletePlaceById(id: string) {
  const supabase = createClientComponentClient<Database>()

  const { error } = await supabase.from("places").delete().match({ id })

  if (error) {
    throw new Error(`Failed to delete place: ${error.message}`)
  }
}
