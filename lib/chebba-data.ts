import { createClient } from "./supabase-client"

export async function getChebbaAttractions() {
  const supabase = createClient()

  const { data, error } = await supabase.from("attractions").select("*").eq("region", "Chebba").order("name")

  if (error) {
    console.error("Error fetching Chebba attractions:", error)
    throw new Error("Failed to fetch Chebba attractions")
  }

  return data || []
}

export async function getChebbaAttractionBySlug(slug: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("attractions")
    .select("*")
    .eq("region", "Chebba")
    .eq("slug", slug)
    .single()

  if (error) {
    console.error("Error fetching Chebba attraction by slug:", error)
    return null
  }

  return data
}

export async function insertChebbaAttractions(attractions: any[]) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("attractions")
    .insert(
      attractions.map((attraction) => ({
        ...attraction,
        region: "Chebba",
      })),
    )
    .select()

  if (error) {
    console.error("Error inserting Chebba attractions:", error)
    throw new Error("Failed to insert Chebba attractions")
  }

  return data
}
