import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TestRunnerLandingPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Test Runner</h1>
      <p className="text-gray-600 mb-8">Run and view the results of your application tests</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Interactive Test Runner</CardTitle>
            <CardDescription>Run tests directly in the browser and see the results in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-gray-600">
              The interactive test runner allows you to run individual tests or test suites and view the results
              directly in your browser. This is useful for quick testing during development.
            </p>
            <Link href="/test-runner">
              <Button className="w-full">Launch Test Runner</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Documentation</CardTitle>
            <CardDescription>View documentation for all tests in the application</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-gray-600">
              The test documentation provides detailed information about all tests in the application, including test
              descriptions, expected behavior, and test coverage.
            </p>
            <Link href="/tests">
              <Button variant="outline" className="w-full">
                View Test Documentation
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Test Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Component Tests", description: "Tests for React components", count: 2 },
            { name: "Service Tests", description: "Tests for data services", count: 4 },
            { name: "Integration Tests", description: "Tests for component integration", count: 1 },
            { name: "Authentication Tests", description: "Tests for auth functionality", count: 1 },
            { name: "Utility Tests", description: "Tests for utility functions", count: 2 },
            { name: "End-to-End Tests", description: "Full application flow tests", count: 0 },
          ].map((category, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="font-medium">{category.count}</span> tests available
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Running Tests from Command Line</h2>
        <p className="text-sm text-gray-600 mb-2">
          For CI/CD pipelines or more comprehensive test runs, use the command line:
        </p>
        <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-sm mb-4">npm test</div>
        <p className="text-sm text-gray-600">To run specific tests or test suites:</p>
        <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-sm">npm test -- -t "auth"</div>
      </div>
    </div>
  )
}
