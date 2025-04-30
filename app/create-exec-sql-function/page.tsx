"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateExecSqlFunctionPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)

  async function handleCreateFunction() {
    try {
      setLoading(true)
      setResult(null)

      // First, let's create the function directly with SQL
      const createDirectly = await fetch("/api/direct-sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sql: `
            CREATE OR REPLACE FUNCTION exec_sql(sql text) RETURNS void AS $$
            BEGIN
              EXECUTE sql;
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;
          `,
        }),
      }).catch((err) => {
        console.error("Error creating function directly:", err)
        return null
      })

      if (createDirectly) {
        const directResult = await createDirectly.json().catch(() => null)
        console.log("Direct creation result:", directResult)
      }

      // Now try to use the function
      const response = await fetch("/api/exec-sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sql: "SELECT 1 as test",
        }),
      })

      const data = await response.json()
      setResult(
        data.error
          ? { success: false, error: data.error }
          : { success: true, message: "Function created and tested successfully!" },
      )
    } catch (error) {
      console.error("Client error:", error)
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Create SQL Execution Function</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This will create a PostgreSQL function that allows us to execute SQL statements. This is useful for database
            maintenance and debugging.
          </p>

          <Button onClick={handleCreateFunction} disabled={loading}>
            {loading ? "Creating..." : "Create Function"}
          </Button>

          {result && (
            <div className={`mt-4 p-4 rounded ${result.success ? "bg-green-50" : "bg-red-50"}`}>
              {result.success ? (
                <p className="text-green-600">{result.message}</p>
              ) : (
                <p className="text-red-600">Error: {result.error}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
