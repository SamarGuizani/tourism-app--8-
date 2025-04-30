import { loadAllCityData } from "@/lib/data"
import CityTemplate from "@/components/city-template"
import { notFound } from "next/navigation"

interface CityPageProps {
  params: {
    slug: string
  }
}

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = params

  try {
    const cityData = await loadAllCityData(slug)

    if (!cityData) {
      console.error(`City data not found for slug: ${slug}`)
      notFound()
    }

    return (
      <div className="min-h-screen bg-white">
        <CityTemplate
          city={cityData}
          attractions={cityData.attractions || []}
          restaurants={cityData.restaurants || []}
          activities={cityData.activities || []}
        />
      </div>
    )
  } catch (error) {
    console.error(`Error loading city page for ${slug}:`, error)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600">Error Loading City</h1>
        <p>There was an error loading the city information. Please try again later.</p>
        <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
          {error instanceof Error ? error.message : "Unknown error"}
        </pre>
      </div>
    )
  }
}
