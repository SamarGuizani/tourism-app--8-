import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import Image from "next/image"
import GovernoratesByRegion from "@/components/governorates-by-region"

export default async function RegionDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })
  const regionId = params.id

  // Fetch region details - try both numeric and string IDs
  let { data: region, error: regionError } = await supabase
    .from("regions")
    .select("*")
    .eq("id", regionId)
    .single()
    .maybeSingle()

  // If not found by ID, try by slug
  if (!region) {
    const { data: regionBySlug, error } = await supabase
      .from("regions")
      .select("*")
      .eq("slug", regionId)
      .single()
      .maybeSingle()

    if (regionBySlug) {
      region = regionBySlug
    }
  }

  if (!region) {
    console.error("Region not found:", regionId)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Region Not Found</h1>
        <p>The region you are looking for does not exist or has an invalid ID.</p>
        <div className="mt-4">
          <Link href="/regions" className="text-blue-600 hover:underline">
            Back to Regions
          </Link>
        </div>
      </div>
    )
  }

  // Fetch cities in this region
  const { data: cities, error: citiesError } = await supabase.from("city").select("*").eq("region_id", region.id)

  if (citiesError) {
    console.error("Error fetching cities:", citiesError)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
        <Image
          src={region.image_link || "/placeholder.svg?height=600&width=1200&query=scenic landscape"}
          alt={region.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">{region.name}</h1>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">About {region.name}</h2>
        <p className="text-gray-700">{region.description}</p>
      </div>

      {/* Display governorates in this region */}
      <GovernoratesByRegion regionId={region.id} />

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">Cities in {region.name}</h2>

        {!cities || cities.length === 0 ? (
          <p className="text-gray-500">No cities found in this region.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <Link href={`/cities/${city.slug}`} key={city.id} className="group">
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48 w-full">
                    <Image
                      src={city.header_image_link || "/placeholder.svg?height=400&width=600&query=city of " + city.name}
                      alt={city.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{city.name}</h3>
                    <p className="text-gray-600 line-clamp-2">
                      {city.description || `Explore the beautiful city of ${city.name}`}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
