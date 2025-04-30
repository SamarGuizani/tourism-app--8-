"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Play, AlertTriangle, RefreshCw } from "lucide-react"

// Mock test runner functions
const runTest = async (testPath: string) => {
  // In a real implementation, this would use a test runner API
  // For now, we'll simulate test results
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Simulate different test outcomes for demonstration
  if (testPath.includes("auth")) {
    return {
      success: true,
      passed: 4,
      failed: 0,
      total: 4,
      results: [
        { name: "renders the sign in form correctly", status: "passed" },
        { name: "calls signInWithPassword when form is submitted with valid data", status: "passed" },
        { name: "displays error message when sign in fails", status: "passed" },
        { name: "renders the sign up form correctly", status: "passed" },
      ],
    }
  } else if (testPath.includes("cities")) {
    return {
      success: true,
      passed: 3,
      failed: 1,
      total: 4,
      results: [
        { name: "fetches all cities successfully", status: "passed" },
        { name: "handles errors when fetching cities fails", status: "passed" },
        { name: "fetches a city by slug successfully", status: "passed" },
        {
          name: "returns null when city is not found",
          status: "failed",
          error: "Expected null but received undefined",
        },
      ],
    }
  } else {
    // Default success case for other tests
    return {
      success: true,
      passed: 2,
      failed: 0,
      total: 2,
      results: [
        { name: "Test case 1", status: "passed" },
        { name: "Test case 2", status: "passed" },
      ],
    }
  }
}

export default function TestRunnerPage() {
  const [activeTab, setActiveTab] = useState("component")
  const [testResults, setTestResults] = useState<Record<string, any>>({})
  const [isRunning, setIsRunning] = useState<Record<string, boolean>>({})

  const tests = {
    component: [
      { id: "search-bar", name: "Search Bar", path: "__tests__/components/search-bar.test.tsx" },
      { id: "city-search", name: "City Search", path: "__tests__/components/city-search.test.tsx" },
    ],
    service: [
      { id: "cities", name: "Cities Service", path: "__tests__/services/cities.test.ts" },
      { id: "activities", name: "Activities Service", path: "__tests__/services/activities.test.ts" },
      { id: "restaurants", name: "Restaurants Service", path: "__tests__/services/restaurants.test.ts" },
      { id: "places", name: "Places Service", path: "__tests__/services/places.test.ts" },
    ],
    integration: [{ id: "supabase-sync", name: "Supabase Sync", path: "__tests__/integration/supabase-sync.test.tsx" }],
    auth: [{ id: "auth", name: "Authentication", path: "__tests__/auth/auth.test.tsx" }],
    utils: [
      { id: "blob-url", name: "Blob URL Utilities", path: "__tests__/utils/blob-url.test.ts" },
      { id: "parse", name: "Parse Server", path: "__tests__/parse/parse.test.tsx" },
    ],
  }

  const handleRunTest = async (testId: string, testPath: string) => {
    setIsRunning((prev) => ({ ...prev, [testId]: true }))
    try {
      const result = await runTest(testPath)
      setTestResults((prev) => ({ ...prev, [testId]: result }))
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        [testId]: {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }))
    } finally {
      setIsRunning((prev) => ({ ...prev, [testId]: false }))
    }
  }

  const handleRunAllTests = async () => {
    const currentTests = tests[activeTab as keyof typeof tests]

    for (const test of currentTests) {
      await handleRunTest(test.id, test.path)
    }
  }

  const getTestStatusIcon = (testId: string) => {
    if (isRunning[testId]) {
      return <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
    }

    const result = testResults[testId]
    if (!result) return null

    if (result.success && result.failed === 0) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    } else if (result.success && result.failed > 0) {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    } else {
      return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Test Runner</h1>
        <Button onClick={handleRunAllTests} disabled={Object.values(isRunning).some(Boolean)}>
          Run All {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Tests
        </Button>
      </div>

      <Tabs defaultValue="component" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="component">Components</TabsTrigger>
          <TabsTrigger value="service">Services</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="auth">Auth</TabsTrigger>
          <TabsTrigger value="utils">Utils</TabsTrigger>
        </TabsList>

        {Object.entries(tests).map(([category, categoryTests]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {categoryTests.map((test) => (
              <Card key={test.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{test.name}</CardTitle>
                    {getTestStatusIcon(test.id)}
                  </div>
                  <CardDescription className="text-xs font-mono">{test.path}</CardDescription>
                </CardHeader>
                <CardContent>
                  {testResults[test.id] && (
                    <div className="space-y-2">
                      {testResults[test.id].success ? (
                        <div className="text-sm">
                          <div className="font-medium mb-2">
                            {testResults[test.id].passed} / {testResults[test.id].total} tests passed
                          </div>
                          <ul className="space-y-1">
                            {testResults[test.id].results?.map((result: any, index: number) => (
                              <li key={index} className="flex items-center gap-2">
                                {result.status === "passed" ? (
                                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                )}
                                <span className={result.status === "failed" ? "text-red-500" : ""}>{result.name}</span>
                                {result.error && <span className="text-xs text-red-500 ml-2">({result.error})</span>}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <Alert variant="destructive">
                          <AlertTitle>Test Failed</AlertTitle>
                          <AlertDescription>{testResults[test.id].error || "Unknown error occurred"}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleRunTest(test.id, test.path)}
                    disabled={isRunning[test.id]}
                    variant="outline"
                    className="w-full"
                  >
                    {isRunning[test.id] ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Run Test
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">About the Test Runner</h2>
        <p className="text-sm text-gray-600 mb-4">
          This is a visual interface for running the tests in your application. In a production environment, you would
          typically run tests using Jest from the command line or in your CI/CD pipeline.
        </p>
        <div className="text-sm text-gray-600">
          <p className="font-medium">Note:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>This is a simulated test runner for demonstration purposes</li>
            <li>
              For actual test execution, use <code>npm test</code> or <code>jest</code> from the command line
            </li>
            <li>Test results shown here are mocked and do not reflect actual test execution</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
