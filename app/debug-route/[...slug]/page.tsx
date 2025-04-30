"use client"

import { useEffect, useState } from "react"

interface DebugRoutePageProps {
  params: {
    slug: string[]
  }
}

export default function DebugRoutePage({ params }: DebugRoutePageProps) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const slugString = params.slug.join("/")

  useEffect(() => {
    async function fetchDebugData() {
      try {
        setLoading(true)
        const response = await fetch(`/api/debug-route/${slugString}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchDebugData()
  }, [slugString])

  if (loading) {
    return <div className="container mx-auto p-4">Loading debug information...</div>
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-600">Error: {error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Debug Route: {slugString}</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Route Information</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(data.route, null, 2)}</pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">City Information</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(data.city, null, 2)}</pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Related Tables</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(data.tables, null, 2)}</pre>
      </div>
    </div>
  )
}
