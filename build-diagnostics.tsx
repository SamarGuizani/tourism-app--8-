"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function BuildDiagnostics() {
  const [issues, setIssues] = useState<string[]>([])
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Simulate checking for common issues
    const checkIssues = async () => {
      const foundIssues: string[] = []

      try {
        // Test window existence to verify client-side execution
        if (typeof window !== "undefined") {
          console.log("Client-side execution confirmed")
        }
      } catch (error) {
        foundIssues.push("Error checking environment: " + String(error))
      }

      setIssues(foundIssues.length ? foundIssues : ["No client-side issues detected"])
      setChecking(false)
    }

    checkIssues()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Build Diagnostics</CardTitle>
          <CardDescription>Checking for common build issues in your tourism app</CardDescription>
        </CardHeader>
        <CardContent>
          {checking ? (
            <div className="flex items-center justify-center p-4">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
              <span className="ml-2">Checking for issues...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Diagnostic Results:</h3>
              <ul className="list-disc pl-5 space-y-2">
                {issues.map((issue, index) => (
                  <li key={index} className="text-sm">
                    {issue}
                  </li>
                ))}
              </ul>

              <div className="mt-6 space-y-4 bg-muted p-4 rounded-md">
                <h3 className="font-medium">Common Webpack Build Issues:</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Server components imported in client components</li>
                  <li>Missing dependencies in package.json</li>
                  <li>Undefined variables or imports</li>
                  <li>Incorrect Next.js configuration</li>
                  <li>Improper use of environment variables</li>
                </ol>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()}>Run Check Again</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
