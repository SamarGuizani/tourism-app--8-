import { Suspense } from "react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable } from "@/components/data-table"
import { ArrowLeft, Download, Map } from "lucide-react"

interface TablePageProps {
  params: {
    name: string
  }
}

export default async function TablePage({ params }: TablePageProps) {
  const { name } = params
  const decodedName = decodeURIComponent(name)

  const supabase = createServerComponentClient({ cookies })

  // Check if table exists
  const { data: tableExists, error: tableError } = await supabase
    .from("information_schema.tables")
    .select("table_name")
    .eq("table_schema", "public")
    .eq("table_name", decodedName)
    .single()

  if (tableError || !tableExists) {
    notFound()
  }

  // Get table columns
  const { data: columns, error: columnsError } = await supabase
    .from("information_schema.columns")
    .select("column_name, data_type")
    .eq("table_schema", "public")
    .eq("table_name", decodedName)

  if (columnsError) {
    console.error("Error fetching columns:", columnsError)
  }

  // Get table data (first 100 rows)
  const { data: rows, error: rowsError } = await supabase.from(decodedName).select("*").limit(100)

  if (rowsError) {
    console.error("Error fetching rows:", rowsError)
  }

  const getCategoryFromTableName = (tableName: string) => {
    if (tableName.startsWith("restaurants_")) return "restaurants"
    if (tableName.startsWith("activities_")) return "activities"
    return "other"
  }

  const getCityName = (tableName: string) => {
    const parts = tableName.split("_")
    if (parts.length > 1) {
      return parts[1].charAt(0).toUpperCase() + parts[1].slice(1)
    }
    return tableName
  }

  const category = getCategoryFromTableName(decodedName)
  const cityName = getCityName(decodedName)

  const hasMapData = columns?.some(
    (col) =>
      col.column_name === "coordinates" ||
      col.column_name === "google_map_link" ||
      (col.column_name === "latitude" && columns.some((c) => c.column_name === "longitude")),
  )

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{cityName}</h1>
          <span className="text-sm bg-gray-100 px-2 py-1 rounded">{category}</span>
        </div>

        <div className="flex space-x-2">
          {hasMapData && (
            <Link href={`/map/${decodedName}`}>
              <Button variant="outline">
                <Map className="mr-2 h-4 w-4" />
                View on Map
              </Button>
            </Link>
          )}

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Suspense fallback={<DataTableSkeleton />}>
            <DataTable columns={columns || []} data={rows || []} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

function DataTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex space-x-4 pb-4">
        <Skeleton className="h-10 w-[150px]" />
        <Skeleton className="h-10 w-[150px]" />
        <Skeleton className="h-10 w-[150px]" />
      </div>

      <Skeleton className="h-[400px] w-full" />
    </div>
  )
}
