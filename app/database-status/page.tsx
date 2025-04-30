"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function DatabaseStatusPage() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchDatabaseStatus()
  }, [])

  const fetchDatabaseStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/database/status")

      if (!response.ok) {
        throw new Error(`Failed to fetch database status: ${response.statusText}`)
      }

      const data = await response.json()
      setStatus(data)
    } catch (err) {
      console.error("Error fetching database status:", err)
      setError("Failed to load database status. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load database status",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Database Status</h1>
        <div className="text-center py-12">Loading database status...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Database Status</h1>
        <div className="text-center py-12 text-red-500">{error}</div>
        <Button onClick={fetchDatabaseStatus} className="mx-auto block">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Database Status</h1>
        <Button onClick={fetchDatabaseStatus}>Refresh</Button>
      </div>

      <Tabs defaultValue="main-tables">
        <TabsList className="mb-6">
          <TabsTrigger value="main-tables">Main Tables</TabsTrigger>
          <TabsTrigger value="city-tables">City Tables</TabsTrigger>
        </TabsList>

        <TabsContent value="main-tables">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {status &&
              status.mainTables &&
              Object.entries(status.mainTables).map(([tableName, tableInfo]: [string, any]) => (
                <Card key={tableName} className={tableInfo.exists ? "border-green-500" : "border-red-500"}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{tableName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tableInfo.exists ? (
                      <div>
                        <p className="text-green-600 font-medium">Table exists</p>
                        <p className="text-sm text-gray-600">Records: {tableInfo.count}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-red-600 font-medium">Table does not exist</p>
                        {tableInfo.error && <p className="text-sm text-gray-600">Error: {tableInfo.error}</p>}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="city-tables">
          {status && status.cityTables && Object.keys(status.cityTables).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(status.cityTables).map(([citySlug, tables]: [string, any]) => (
                <Card key={citySlug} className="overflow-hidden">
                  <CardHeader className="bg-gray-50">
                    <CardTitle>{citySlug}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(tables).map(([tableType, tableInfo]: [string, any]) => (
                        <div
                          key={`${citySlug}_${tableType}`}
                          className={`p-4 rounded-lg border ${tableInfo.exists ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}
                        >
                          <h3 className="font-medium mb-2">{tableType}</h3>
                          {tableInfo.exists ? (
                            <p className="text-sm text-green-600">Exists - {tableInfo.count} records</p>
                          ) : (
                            <p className="text-sm text-gray-500">Does not exist</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p>No city-specific tables found.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
