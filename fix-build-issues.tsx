"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

interface FixItem {
  id: string
  title: string
  description: string
  checked: boolean
}

export default function FixBuildIssues() {
  const [fixes, setFixes] = useState<FixItem[]>([
    {
      id: "server-components",
      title: "Fix Server Component Imports",
      description: "Check all client components ('use client') to ensure they don't import server components",
      checked: false,
    },
    {
      id: "dependencies",
      title: "Check Dependencies",
      description: "Verify all npm packages are correctly listed in package.json",
      checked: false,
    },
    {
      id: "imports",
      title: "Verify Imports",
      description: "Ensure all imports point to existing files with correct exports",
      checked: false,
    },
    {
      id: "env-vars",
      title: "Environment Variables",
      description: "Check that all environment variables are defined and properly accessed",
      checked: false,
    },
    {
      id: "webpack-config",
      title: "Next.js Config",
      description: "Review next.config.js for proper webpack configuration",
      checked: false,
    },
  ])

  const toggleFix = (id: string) => {
    setFixes(fixes.map((fix) => (fix.id === id ? { ...fix, checked: !fix.checked } : fix)))
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Build Error Checklist</CardTitle>
          <CardDescription>Work through these common issues to fix your webpack build errors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fixes.map((fix) => (
              <div key={fix.id} className="flex items-start space-x-2">
                <Checkbox id={fix.id} checked={fix.checked} onCheckedChange={() => toggleFix(fix.id)} />
                <div className="grid gap-1.5">
                  <label
                    htmlFor={fix.id}
                    className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {fix.title}
                  </label>
                  <p className="text-sm text-muted-foreground">{fix.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={!fixes.every((fix) => fix.checked)}>
            Mark All Issues as Fixed
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
