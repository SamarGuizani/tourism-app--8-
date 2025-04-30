import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import EditContentForm from "@/components/admin/edit-content-form"

interface EditPageProps {
  params: {
    contentType: string
    id: string
  }
}

export default async function EditPage({ params }: EditPageProps) {
  const { contentType, id } = params

  // Validate content type
  if (!["restaurants", "activities", "attractions"].includes(contentType)) {
    redirect("/admin")
  }

  const supabase = createServerComponentClient({ cookies })

  // Check authentication
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  // Fetch the item to edit
  const { data: item, error } = await supabase.from(contentType).select("*").eq("id", id).single()

  if (error || !item) {
    redirect("/admin")
  }

  // Fetch all cities for the city selector
  const { data: cities } = await supabase.from("cities").select("id, name, slug, region").order("name")

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">
        Edit {contentType.slice(0, -1)}: {item.name}
      </h1>

      <EditContentForm
        contentType={contentType as "restaurants" | "activities" | "attractions"}
        item={item}
        cities={cities || []}
      />
    </div>
  )
}
