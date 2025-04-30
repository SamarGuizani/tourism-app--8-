"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function DebugDatabasePage() {
  const [sql, setSql] = useState("SELECT * FROM cities LIMIT 10;")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  async function handleExecuteSQL() {
    try {
      setLoading(true)
      const response = await fetch("/api/direct-sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
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
          <CardTitle>Database Debugger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="sql" className="block text-sm font-medium mb-2">
                SQL Query
              </label>
              <Textarea
                id="sql"
                value={sql}
                onChange={(e) => setSql(e.target.value)}
                rows={5}
                className="w-full font-mono"
              />
            </div>

            <Button onClick={handleExecuteSQL} disabled={loading}>
              {loading ? "Executing..." : "Execute SQL"}
            </Button>

            {result && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Result:</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
