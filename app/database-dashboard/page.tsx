"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Database, Map, RefreshCw } from "lucide-react"

interface TableInfo {
  table_schema: string
  table_name: string
  columns: {
    column_name: string
    data_type: string
  }[]
}

interface QueryResult {
  columns?: string[]
  rows?: any[]
  error?: string
}

export default function DatabaseDashboard() {
  const [tables, setTables] = useState<string[]>([])
  const [selectedTable, setSelectedTable] = useState<string>("")
  const [tableSchema, setTableSchema] = useState<TableInfo | null>(null)
  const [sqlQuery, setSqlQuery] = useState<string>("")
  const [queryResult, setQueryResult] = useState<QueryResult>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [mapLinkUpdating, setMapLinkUpdating] = useState<boolean>(false)
  const [tableData, setTableData] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<string>("tables")

  useEffect(() => {
    fetchTables()
  }, [])

  useEffect(() => {
    if (selectedTable) {
      fetchTableSchema(selectedTable)
      fetchTableData(selectedTable)
    }
  }, [selectedTable])

  const fetchTables = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/database/tables")
      const data = await response.json()
      setTables(data.tables)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching tables:", error)
      setLoading(false)
    }
  }

  const fetchTableSchema = async (tableName: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/database/schema?table=${tableName}`)
      const data = await response.json()
      setTableSchema(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching table schema:", error)
      setLoading(false)
    }
  }

  const fetchTableData = async (tableName: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/database/data?table=${tableName}&limit=10`)
      const data = await response.json()
      setTableData(data.rows || [])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching table data:", error)
      setLoading(false)
    }
  }

  const executeQuery = async () => {
    if (!sqlQuery.trim()) return

    try {
      setLoading(true)
      const response = await fetch("/api/database/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: sqlQuery }),
      })
      const data = await response.json()

      if (data.error) {
        setQueryResult({ error: data.error })
      } else {
        setQueryResult({
          columns: data.columns,
          rows: data.rows,
        })
      }
      setLoading(false)
    } catch (error) {
      console.error("Error executing query:", error)
      setQueryResult({ error: "Failed to execute query" })
      setLoading(false)
    }
  }

  const updateGoogleMapLinks = async () => {
    try {
      setMapLinkUpdating(true)
      const response = await fetch("/api/database/update-map-links", {
        method: "POST",
      })
      const data = await response.json()
      alert(data.message || "Google Map links updated successfully")
      setMapLinkUpdating(false)

      // Refresh table data if we're viewing a table
      if (selectedTable) {
        fetchTableData(selectedTable)
      }
    } catch (error) {
      console.error("Error updating Google Map links:", error)
      alert("Failed to update Google Map links")
      setMapLinkUpdating(false)
    }
  }

  const getTableCategories = () => {
    const categories = {
      activities: tables.filter((t) => t.includes("activities")),
      attractions: tables.filter((t) => t.includes("attractions")),
      restaurants: tables.filter((t) => t.includes("restaurants")),
      other: tables.filter(
        (t) => !t.includes("activities") && !t.includes("attractions") && !t.includes("restaurants"),
      ),
    }
    return categories
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Tunisia Guide Database Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="query">SQL Query</TabsTrigger>
          <TabsTrigger value="map-links">Google Map Links</TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
              <CardDescription>Select a table to view its schema and data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {Object.entries(getTableCategories()).map(([category, categoryTables]) => (
                  <Card key={category} className="overflow-hidden">
                    <CardHeader className="bg-slate-50 py-3">
                      <CardTitle className="text-lg capitalize">{category}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 max-h-60 overflow-y-auto">
                      <div className="divide-y">
                        {categoryTables.map((table) => (
                          <Button
                            key={table}
                            variant="ghost"
                            className={`w-full justify-start rounded-none px-4 py-2 text-left ${selectedTable === table ? "bg-slate-100" : ""}`}
                            onClick={() => setSelectedTable(table)}
                          >
                            {table}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedTable && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Table Schema: {selectedTable}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Column Name</TableHead>
                              <TableHead>Data Type</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {tableSchema?.columns.map((column) => (
                              <TableRow key={column.column_name}>
                                <TableCell>{column.column_name}</TableCell>
                                <TableCell>{column.data_type}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Table Data: {selectedTable}</CardTitle>
                      <CardDescription>Showing first 10 rows</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                      ) : tableData.length > 0 ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                {Object.keys(tableData[0]).map((key) => (
                                  <TableHead key={key}>{key}</TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {tableData.map((row, index) => (
                                <TableRow key={index}>
                                  {Object.values(row).map((value: any, i) => (
                                    <TableCell key={i}>
                                      {typeof value === "object" ? JSON.stringify(value) : String(value || "")}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <p>No data available</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="query" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Execute SQL Query</CardTitle>
              <CardDescription>Run custom SQL queries against the database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Enter your SQL query here..."
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  className="min-h-32 font-mono"
                />
                <Button onClick={executeQuery} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    "Execute Query"
                  )}
                </Button>
              </div>

              {queryResult.error ? (
                <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
                  <p className="font-medium">Error:</p>
                  <p>{queryResult.error}</p>
                </div>
              ) : queryResult.columns && queryResult.rows ? (
                <div className="mt-6 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {queryResult.columns.map((column) => (
                          <TableHead key={column}>{column}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {queryResult.rows.map((row, index) => (
                        <TableRow key={index}>
                          {Object.values(row).map((value: any, i) => (
                            <TableCell key={i}>
                              {typeof value === "object" ? JSON.stringify(value) : String(value || "")}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map-links" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Google Map Links</CardTitle>
              <CardDescription>Manage Google Map links for activities, attractions, and restaurants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Button onClick={updateGoogleMapLinks} disabled={mapLinkUpdating} className="flex items-center">
                    {mapLinkUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Update All Google Map Links
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-gray-500">
                    This will regenerate Google Map links for all activities, attractions, and restaurants.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="bg-blue-50">
                      <CardTitle className="flex items-center">
                        <Database className="mr-2 h-5 w-5" />
                        Activities
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-sm">
                        {tables.filter((t) => t.includes("activities")).length} tables with Google Map links
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="bg-green-50">
                      <CardTitle className="flex items-center">
                        <Map className="mr-2 h-5 w-5" />
                        Attractions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-sm">
                        {tables.filter((t) => t.includes("attractions")).length} tables with Google Map links
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="bg-amber-50">
                      <CardTitle className="flex items-center">
                        <Database className="mr-2 h-5 w-5" />
                        Restaurants
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-sm">
                        {tables.filter((t) => t.includes("restaurants")).length} tables with Google Map links
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">View Map Links by Table</h3>
                  <div className="flex space-x-4">
                    <Select value={selectedTable} onValueChange={setSelectedTable}>
                      <SelectTrigger className="w-[300px]">
                        <SelectValue placeholder="Select a table" />
                      </SelectTrigger>
                      <SelectContent>
                        {tables
                          .filter(
                            (t) => t.includes("activities") || t.includes("attractions") || t.includes("restaurants"),
                          )
                          .map((table) => (
                            <SelectItem key={table} value={table}>
                              {table}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    <Button variant="outline" onClick={() => fetchTableData(selectedTable)} disabled={!selectedTable}>
                      View Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
