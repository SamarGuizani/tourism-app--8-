import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import Image from "next/image"

export default async function GovernorateDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  // Fetch governorate details
  const { data: governorate, error: governorateError } = await supabase
    .from("governorates")
    .select("*")
    .eq("id", params.id)
    .single()

  if (governorateError) {
    console.error("Error fetching governorate:", governorateError)
    return <div>Error loading governorate</div>
  }

  // Fetch cities in this governorate
  const { data: cities, error: citiesError } = await supabase.from("city").select("*").eq("governorate_id", params.id)

  if (citiesError) {
    console.error("Error fetching cities:", citiesError)
    return <div>Error loading cities</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
        <Image
          src={governorate.image || "/placeholder-governorate.jpg"}
          alt={governorate.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">{governorate.name}</h1>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">About {governorate.name}</h2>
        <p className="text-gray-700">{governorate.description}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">Cities in {governorate.name}</h2>

        {cities.length === 0 ? (
          <p className="text-gray-500">No cities found in this governorate.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <Link href={`/regions/cities/${city.slug}`} key={city.id} className="group">
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48 w-full">
                    <Image
                      src={city.header_image_link || "/placeholder-city.jpg"}
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
