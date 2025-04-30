import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function CitiesRegionsPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch regions
  const { data: regions, error: regionsError } = await supabase.from("regions").select("*")

  if (regionsError) {
    console.error("Error fetching regions:", regionsError)
  }

  // Hardcoded cities for now
  const cities = [
    { id: "chebba-city", name: "Chebba", region: "Mahdia", image: "/happy-dog-park.png" },
    { id: "mahdia-city", name: "Mahdia", region: "Mahdia", image: "/Mahdia-Coastal-View.png" },
    {
      id: "haouaria",
      name: "El Haouaria",
      region: "Cap Bon",
      image: "https://res.cloudinary.com/ddldb6bga/image/upload/v1744282348/hawaria_paradise_bfwlwz.jpg",
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Cities & Regions</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Regions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions?.map((region) => (
            <Link key={region.id} href={`/cities-regions/region/${region.id}`}>
              <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src={`/abstract-geometric-shapes.png?height=400&width=600&query=${encodeURIComponent(region.name)}`}
                    alt={region.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{region.name}</h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">{region.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">Cities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <Link key={city.id} href={`/cities-regions/${city.id}`}>
              <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  <img src={city.image || "/placeholder.svg"} alt={city.name} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{city.name}</h3>
                  <p className="text-gray-600">Region: {city.region}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
