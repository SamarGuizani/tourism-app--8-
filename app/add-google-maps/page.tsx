import { Suspense } from "react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { GoogleMapLinkGenerator } from "@/components/google-map-link-generator"
import { ArrowLeft } from "lucide-react"

export default async function AddGoogleMapsPage() {
  const supabase = createServerComponentClient({ cookies })

  // Get all tables
  const { data: tables, error } = await supabase
    .from("information_schema.tables")
    .select("table_name")
    .eq("table_schema", "public")
    .not("table_name", "ilike", "auth_%")
    .not("table_name", "ilike", "pg_%")

  if (error) {
    console.error("Error fetching tables:", error)
  }

  // Filter tables to only include those that might need Google Map links
  const relevantTables = []

  for (const table of tables || []) {
    const { data: columns } = await supabase
      .from("information_schema.columns")
      .select("column_name")
      .eq("table_schema", "public")
      .eq("table_name", table.table_name)

    const hasNameColumn = columns?.some((col) => col.column_name === "name")
    const hasGoogleMapLink = columns?.some((col) => col.column_name === "google_map_link")

    if (hasNameColumn) {
      relevantTables.push({
        name: table.table_name,
        hasGoogleMapLink,
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Link href="/dashboard">
          <Button variant="outline" size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Add Google Maps Links</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Google Maps Link Generator</CardTitle>
          <CardDescription>Generate Google Maps links for locations in your database</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This utility helps you add Google Maps links to your data. It will:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Check if a table has a google_map_link column</li>
            <li>Add the column if it doesn't exist</li>
            <li>Generate Google Maps links based on location names</li>
            <li>Update the database with the generated links</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Note: For best results, make sure your location names are accurate and include the city or region.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <GoogleMapLinkGenerator tables={relevantTables} />
        </Suspense>
      </div>
    </div>
  )
}
