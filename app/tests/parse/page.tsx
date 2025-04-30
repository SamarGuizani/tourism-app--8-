"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { Label } from "@/components/ui/label"

export default function ParseTest() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [parseStatus, setParseStatus] = useState<"unknown" | "connected" | "error">("unknown")
  const [newObject, setNewObject] = useState({
    name: "",
    description: "",
    type: "test",
  })
  const [objects, setObjects] = useState<any[]>([])

  useEffect(() => {
    checkParseConnection()
    fetchObjects()
  }, [])

  const checkParseConnection = async () => {
    setLoading(true)
    setError(null)

    try {
      // Check if Parse is available
      if (!process.env.NEXT_PUBLIC_PARSE_APPLICATION_ID || !process.env.NEXT_PUBLIC_PARSE_JAVASCRIPT_KEY) {
        throw new Error("Parse environment variables are not configured")
      }

      // Try to initialize Parse
      const Parse = require("parse")
      Parse.initialize(process.env.NEXT_PUBLIC_PARSE_APPLICATION_ID, process.env.NEXT_PUBLIC_PARSE_JAVASCRIPT_KEY)
      Parse.serverURL = process.env.PARSE_SERVER_URL || "https://parseapi.back4app.com"

      // Try a simple query to verify connection
      const TestObject = Parse.Object.extend("TestObject")
      const query = new Parse.Query(TestObject)
      await query.find()

      setParseStatus("connected")
      setSuccess("Successfully connected to Parse server")
    } catch (err: any) {
      console.error("Parse connection error:", err)
      setParseStatus("error")
      setError(`Failed to connect to Parse: ${err.message || "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchObjects = async () => {
    if (parseStatus !== "connected") return

    setLoading(true)
    setError(null)

    try {
      const Parse = require("parse")
      const TestObject = Parse.Object.extend("TestObject")
      const query = new Parse.Query(TestObject)
      query.descending("createdAt")
      query.limit(10)

      const results = await query.find()
      setObjects(
        results.map((obj: any) => ({
          id: obj.id,
          name: obj.get("name"),
          description: obj.get("description"),
          type: obj.get("type"),
          createdAt: obj.get("createdAt"),
        })),
      )
    } catch (err: any) {
      console.error("Error fetching Parse objects:", err)
      setError(`Failed to fetch objects: ${err.message || "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAddObject = async () => {
    if (parseStatus !== "connected") {
      setError("Not connected to Parse server")
      return
    }

    if (!newObject.name) {
      setError("Name is required")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const Parse = require("parse")
      const TestObject = Parse.Object.extend("TestObject")
      const testObject = new TestObject()

      testObject.set("name", newObject.name)
      testObject.set("description", newObject.description)
      testObject.set("type", newObject.type)

      await testObject.save()

      setSuccess("Object added successfully")
      setNewObject({
        name: "",
        description: "",
        type: "test",
      })
      fetchObjects()
    } catch (err: any) {
      console.error("Error adding Parse object:", err)
      setError(`Failed to add object: ${err.message || "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Parse Server Test</h1>
      <p className="text-gray-600 mb-8">
        This page tests the connection to Parse Server and allows you to create and retrieve objects.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Parse Connection Status</CardTitle>
              <CardDescription>Check if the application can connect to the Parse server.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    parseStatus === "connected"
                      ? "bg-green-500"
                      : parseStatus === "error"
                        ? "bg-red-500"
                        : "bg-gray-300"
                  }`}
                ></div>
                <span className="font-medium">
                  {parseStatus === "connected"
                    ? "Connected"
                    : parseStatus === "error"
                      ? "Connection Error"
                      : "Unknown Status"}
                </span>
              </div>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={checkParseConnection} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Check Connection"
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Add Test Object</CardTitle>
              <CardDescription>Create a new object in the Parse database to test write operations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newObject.name}
                  onChange={(e) => setNewObject({ ...newObject, name: e.target.value })}
                  placeholder="Enter object name"
                  disabled={parseStatus !== "connected"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newObject.description}
                  onChange={(e) => setNewObject({ ...newObject, description: e.target.value })}
                  placeholder="Enter object description"
                  rows={3}
                  disabled={parseStatus !== "connected"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  value={newObject.type}
                  onChange={(e) => setNewObject({ ...newObject, type: e.target.value })}
                  placeholder="Enter object type"
                  disabled={parseStatus !== "connected"}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddObject} disabled={loading || parseStatus !== "connected"} className="w-full">
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Object"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Test Objects</CardTitle>
              <CardDescription>Objects retrieved from the Parse database to test read operations.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">Loading objects...</p>
                </div>
              ) : objects.length === 0 ? (
                <div className="text-center py-8 border rounded-lg bg-gray-50">
                  <p className="text-gray-500">No objects found in the database.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {objects.map((obj) => (
                    <div key={obj.id} className="border rounded-lg p-4">
                      <div className="font-medium">{obj.name}</div>
                      {obj.description && <p className="text-gray-600 text-sm mt-1">{obj.description}</p>}
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                        <span>{obj.type}</span>
                        <span>
                          {new Date(obj.createdAt).toLocaleDateString()} {new Date(obj.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={fetchObjects}
                disabled={loading || parseStatus !== "connected"}
                variant="outline"
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  "Refresh Objects"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
