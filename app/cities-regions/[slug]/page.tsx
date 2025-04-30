import type { Metadata } from "next"
import { notFound } from "next/navigation"
import CityTemplateEnhanced from "@/components/city-template"
import { loadAllCityData, createSafeImageUrl } from "@/lib/data"

interface CityPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const city = await loadAllCityData(params.slug)

  if (!city) {
    return {
      title: "City Not Found",
      description: "The requested city could not be found.",
    }
  }

  return {
    title: city.title || `${city.name} - Explore Tunisia`,
    description: city.description || `Discover the beauty and culture of ${city.name}, Tunisia.`,
  }
}

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = params

  // Load all city data
  const city = await loadAllCityData(slug)

  if (!city) {
    notFound()
  }

  // Ensure all required properties exist with fallbacks
  return (
    <CityTemplateEnhanced
      name={city.name}
      title={city.title || `${city.name} - Explore Tunisia`}
      description={city.description || `Explore the beautiful area of ${city.name}.`}
      heroImage={createSafeImageUrl(city.heroImage, city.name)}
      images={(city.images || [])
        .filter((img) => img && img.trim() !== "")
        .map((img) => createSafeImageUrl(img, city.name))}
      gettingThere={city.gettingThere || "Information about getting to this destination will be available soon."}
      entranceFee={city.entranceFee}
      bestTimeToVisit={city.bestTimeToVisit || "This destination can be visited year-round."}
      region={city.region}
      attractions={city.attractions || []}
      restaurants={city.restaurants || []}
      activities={city.activities || []}
      coordinates={city.coordinates || { latitude: 36.8, longitude: 10.18 }}
    />
  )
}
