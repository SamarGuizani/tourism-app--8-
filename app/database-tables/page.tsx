"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

export default function DatabaseTablesPage() {
  const [tables, setTables] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchTables() {
      try {
        // Query to get all tables in the public schema
        const { data, error } = await supabase.from("pg_tables").select("*").eq("schemaname", "public")

        if (error) {
          throw error
        }

        setTables(data || [])
      } catch (err) {
        console.error("Error fetching tables:", err)
        setError("Failed to fetch database tables. Make sure you have the necessary permissions.")
      } finally {
        setLoading(false)
      }
    }

    fetchTables()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Database Tables</CardTitle>
          <CardDescription>
            List of all tables in your database. This helps you understand the data structure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md text-red-800">
              <p>{error}</p>
              <p className="text-sm mt-2">
                Note: You may need to grant SELECT privileges on pg_catalog.pg_tables to your database user.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No tables found in the database.
                    </TableCell>
                  </TableRow>
                ) : (
                  tables.map((table) => (
                    <TableRow key={table.tablename}>
                      <TableCell className="font-medium">{table.tablename}</TableCell>
                      <TableCell>{table.tableowner}</TableCell>
                      <TableCell>
                        {table.tablename.startsWith("_") ? (
                          <Badge variant="outline">System</Badge>
                        ) : (
                          <Badge>User</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
