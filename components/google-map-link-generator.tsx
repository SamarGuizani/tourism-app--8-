"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle, AlertCircle } from "lucide-react"

interface GoogleMapLinkGeneratorProps {
  tables: {
    name: string
    hasGoogleMapLink: boolean
  }[]
}

export function GoogleMapLinkGenerator({ tables }: GoogleMapLinkGeneratorProps) {
  const [selectedTables, setSelectedTables] = useState<string[]>([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<
    {
      tableName: string
      success: boolean
      message: string
      updatedCount: number
    }[]
  >([])

  const supabase = createClientComponentClient()

  const handleSelectTable = (tableName: string, checked: boolean) => {
    if (checked) {
      setSelectedTables([...selectedTables, tableName])
    } else {
      setSelectedTables(selectedTables.filter((t) => t !== tableName))
    }
  }

  const handleSelectAll = () => {
    if (selectedTables.length === tables.length) {
      setSelectedTables([])
    } else {
      setSelectedTables(tables.map((t) => t.name))
    }
  }

  const processTable = async (tableName: string) => {
    try {
      // Check if google_map_link column exists
      const { data: columns } = await supabase
        .from("information_schema.columns")
        .select("column_name")
        .eq("table_schema", "public")
        .eq("table_name", tableName)
        .eq("column_name", "google_map_link")

      // Add column if it doesn't exist
      if (!columns || columns.length === 0) {
        await supabase.rpc("add_column_if_not_exists", {
          table_name: tableName,
          column_name: "google_map_link",
          column_type: "TEXT",
        })
      }

      // Get rows without Google Map links
      const { data: rows, error } = await supabase
        .from(tableName)
        .select("id, name, city, region")
        .or("google_map_link.is.null,google_map_link.eq.")

      if (error) {
        return {
          tableName,
          success: false,
          message: error.message,
          updatedCount: 0,
        }
      }

      let updatedCount = 0

      // Generate and update Google Map links
      for (const row of rows || []) {
        let searchQuery = row.name

        if (row.city) {
          searchQuery += ` ${row.city}`
        }

        if (row.region) {
          searchQuery += ` ${row.region}`
        }

        searchQuery += " Tunisia"

        const googleMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`

        const { error: updateError } = await supabase
          .from(tableName)
          .update({ google_map_link: googleMapLink })
          .eq("id", row.id)

        if (!updateError) {
          updatedCount++
        }
      }

      return {
        tableName,
        success: true,
        message: `Updated ${updatedCount} rows`,
        updatedCount,
      }
    } catch (error) {
      return {
        tableName,
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
        updatedCount: 0,
      }
    }
  }

  const handleProcess = async () => {
    if (selectedTables.length === 0) {
      toast({
        title: "No tables selected",
        description: "Please select at least one table to process",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)
    setProgress(0)
    setResults([])

    const newResults = []

    for (let i = 0; i < selectedTables.length; i++) {
      const tableName = selectedTables[i]
      const result = await processTable(tableName)
      newResults.push(result)
      setResults([...newResults])
      setProgress(Math.round(((i + 1) / selectedTables.length) * 100))
    }

    setProcessing(false)

    toast({
      title: "Processing complete",
      description: `Processed ${selectedTables.length} tables`,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Tables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedTables.length === tables.length}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium">
                Select All
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tables.map((table) => (
              <div key={table.name} className="flex items-center space-x-2">
                <Checkbox
                  id={table.name}
                  checked={selectedTables.includes(table.name)}
                  onCheckedChange={(checked) => handleSelectTable(table.name, !!checked)}
                />
                <label htmlFor={table.name} className="text-sm font-medium">
                  {table.name}
                  {table.hasGoogleMapLink && <span className="ml-2 text-xs text-green-500">(Has google_map_link)</span>}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleProcess} disabled={processing || selectedTables.length === 0}>
            {processing ? "Processing..." : "Process Selected Tables"}
          </Button>
        </CardFooter>
      </Card>

      {processing && (
        <Card>
          <CardHeader>
            <CardTitle>Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-2" />
            <p className="text-sm text-center">{progress}% complete</p>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 rounded-md bg-gray-50">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">{result.tableName}</p>
                    <p className="text-sm text-muted-foreground">{result.message}</p>
                    {result.success && <p className="text-sm text-green-600">Updated {result.updatedCount} rows</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
