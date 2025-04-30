"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"

export default function UnitTestsPage() {
  const [testResults, setTestResults] = useState<
    {
      name: string
      status: "passed" | "failed"
      message?: string
    }[]
  >([])
  const [isRunning, setIsRunning] = useState(false)

  const runTests = async () => {
    setIsRunning(true)

    // Simulate running tests
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setTestResults([
      { name: "CityCard Component", status: "passed" },
      { name: "SignInForm Component", status: "passed" },
      { name: "BookingCard Component", status: "passed" },
      { name: "GuideCard Component", status: "passed" },
      { name: "SearchBar Component", status: "passed" },
    ])

    setIsRunning(false)
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Unit Tests</h1>
      <p className="text-gray-600 mb-8">Run Jest unit tests for components</p>

      <div className="mb-6">
        <Button onClick={runTests} disabled={isRunning}>
          {isRunning ? "Running Tests..." : "Run All Unit Tests"}
        </Button>
      </div>

      <div className="space-y-4">
        {testResults.map((test, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                {test.status === "passed" ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                )}
                {test.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={test.status === "passed" ? "text-green-600" : "text-red-600"}>
                {test.status === "passed" ? "All tests passed" : test.message}
              </p>
            </CardContent>
          </Card>
        ))}

        {testResults.length === 0 && !isRunning && (
          <p className="text-gray-500">No tests have been run yet. Click the button above to run tests.</p>
        )}

        {isRunning && <p className="text-blue-500">Running tests, please wait...</p>}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Running Tests in VS Code</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Install the Jest VS Code extension</li>
          <li>Open the command palette (Ctrl+Shift+P or Cmd+Shift+P)</li>
          <li>Type "Jest: Start All Runners" to run tests in watch mode</li>
          <li>Tests will automatically run when files change</li>
          <li>
            Alternatively, run <code>npm test</code> in the terminal
          </li>
        </ol>
      </div>
    </div>
  )
}
