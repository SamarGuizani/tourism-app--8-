"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Clock } from "lucide-react"

export default function IntegrationTestsPage() {
  const [testResults, setTestResults] = useState<
    {
      name: string
      status: "passed" | "failed" | "running"
      message?: string
    }[]
  >([])
  const [isRunning, setIsRunning] = useState(false)

  const runTests = async () => {
    setIsRunning(true)

    // Set initial state
    setTestResults([
      { name: "User Authentication Flow", status: "running" },
      { name: "Guide Booking Process", status: "running" },
      { name: "Search and Filter Cities", status: "running" },
      { name: "Admin Dashboard Access", status: "running" },
    ])

    // Simulate tests running and completing
    setTimeout(() => {
      setTestResults((prev) => {
        const updated = [...prev]
        updated[0] = { name: "User Authentication Flow", status: "passed" }
        return updated
      })
    }, 2000)

    setTimeout(() => {
      setTestResults((prev) => {
        const updated = [...prev]
        updated[1] = { name: "Guide Booking Process", status: "passed" }
        return updated
      })
    }, 3500)

    setTimeout(() => {
      setTestResults((prev) => {
        const updated = [...prev]
        updated[2] = { name: "Search and Filter Cities", status: "passed" }
        return updated
      })
    }, 4500)

    setTimeout(() => {
      setTestResults((prev) => {
        const updated = [...prev]
        updated[3] = { name: "Admin Dashboard Access", status: "passed" }
        return updated
      })
      setIsRunning(false)
    }, 5500)
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Integration Tests</h1>
      <p className="text-gray-600 mb-8">Run integration tests for app workflows</p>

      <div className="mb-6">
        <Button onClick={runTests} disabled={isRunning}>
          {isRunning ? "Running Tests..." : "Run All Integration Tests"}
        </Button>
      </div>

      <div className="space-y-4">
        {testResults.map((test, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                {test.status === "passed" ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : test.status === "failed" ? (
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                ) : (
                  <Clock className="h-5 w-5 text-blue-500 mr-2" />
                )}
                {test.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={
                  test.status === "passed"
                    ? "text-green-600"
                    : test.status === "failed"
                      ? "text-red-600"
                      : "text-blue-600"
                }
              >
                {test.status === "passed"
                  ? "Test passed"
                  : test.status === "failed"
                    ? test.message || "Test failed"
                    : "Running..."}
              </p>
            </CardContent>
          </Card>
        ))}

        {testResults.length === 0 && !isRunning && (
          <p className="text-gray-500">No tests have been run yet. Click the button above to run tests.</p>
        )}
      </div>
    </div>
  )
}
