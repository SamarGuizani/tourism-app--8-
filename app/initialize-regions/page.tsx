"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function InitializeRegionsPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const initializeRegions = async () => {
    setLoading(true)
    setResult(null)

    try {
      // Check if regions table exists
      const { data: tableExists, error: tableError } = await supabase.rpc("table_exists", { table_name: "regions" })

      if (tableError) {
        throw new Error(`Error checking if table exists: ${tableError.message}`)
      }

      // Create regions table if it doesn't exist
      if (!tableExists) {
        const { error: createError } = await supabase.rpc("exec_sql", {
          sql_query: `
            CREATE TABLE regions (
              id SERIAL PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              slug VARCHAR(255) UNIQUE NOT NULL,
              description TEXT,
              image_link VARCHAR(255),
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
          `,
        })

        if (createError) {
          throw new Error(`Error creating regions table: ${createError.message}`)
        }
      }

      // Insert sample regions data
      const { error: insertError } = await supabase.rpc("exec_sql", {
        sql_query: `
          INSERT INTO regions (id, name, slug, description, image_link)
          VALUES 
            (1, 'North Tunisia', 'north-tunisia', 'Explore the lush green landscapes and beautiful coastlines of Northern Tunisia', '/regions/north-tunisia.jpg'),
            (2, 'Central Tunisia', 'central-tunisia', 'Discover the historical sites, desert oases, and unique architecture of Central Tunisia', '/regions/central-tunisia.jpg'),
            (3, 'South Tunisia', 'south-tunisia', 'Experience the Sahara Desert, traditional Berber villages, and stunning landscapes of Southern Tunisia', '/regions/south-tunisia.jpg')
          ON CONFLICT (slug) DO NOTHING;
        `,
      })

      if (insertError) {
        throw new Error(`Error inserting regions data: ${insertError.message}`)
      }

      setResult("Regions data initialized successfully!")
    } catch (error) {
      console.error("Error initializing regions:", error)
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Initialize Regions Data</CardTitle>
          <CardDescription>Create and populate the regions table with sample data</CardDescription>
        </CardHeader>
        <CardContent>
          {result && (
            <div
              className={`p-4 mb-4 rounded-md ${result.startsWith("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
            >
              {result}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={initializeRegions} disabled={loading} className="w-full">
            {loading ? "Initializing..." : "Initialize Regions Data"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
