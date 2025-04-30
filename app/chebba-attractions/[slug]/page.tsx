import { notFound } from "next/navigation"
import ChebbaAttractionDetailPage from "@/components/chebba-attraction-detail-page"
import { getChebbaAttractionBySlug, getChebbaAttractions } from "@/lib/chebba-data"

export default async function ChebbaAttractionPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  // Get attraction data from our utility function
  const attraction = await getChebbaAttractionBySlug(slug)

  if (!attraction) {
    return notFound()
  }

  return <ChebbaAttractionDetailPage attractionId={attraction.id} />
}

// Generate static paths for all Chebba attractions
export async function generateStaticParams() {
  const attractions = await getChebbaAttractions()

  return attractions.map((attraction) => ({
    slug: attraction.slug,
  }))
}
