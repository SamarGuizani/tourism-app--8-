import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { AttractionsList } from "./attractions-list"

export const dynamic = "force-dynamic"

export default async function AttractionsPage() {
  const supabase = createServerComponentClient({ cookies })

  // Create the function if it doesn't exist
  await supabase.rpc("create_get_all_attractions_function", {})

  // Fetch attractions from all tables
  const { data: attractions, error } = await supabase.rpc("get_all_attractions")

  if (error) {
    console.error("Error fetching attractions:", error)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Attractions</h1>
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">Error loading attractions: {error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Attractions</h1>
      <AttractionsList attractions={attractions || []} />
    </div>
  )
}
