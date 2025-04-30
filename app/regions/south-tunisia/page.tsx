import { createServerSupabaseClient } from "@/lib/supabase"
import Link from "next/link"
import { ClientImage as Image } from "@/components/client-image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import { getCitiesByRegion } from "@/lib/region-data"

export default async function SouthTunisiaPage() {
  const supabase = createServerSupabaseClient()

  // Get cities for South Tunisia
  const cities = getCitiesByRegion("south-tunisia")

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="relative h-[40vh] rounded-xl overflow-hidden mb-12">
          <Image src="/regions/south-tunisia.jpg" alt="South Tunisia" fill className="object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="p-8 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">South Tunisia</h1>
              <p className="text-lg md:text-xl max-w-2xl">
                Experience the Sahara Desert, traditional Berber villages, and stunning landscapes of Southern Tunisia
              </p>
            </div>
          </div>
        </div>

        {/* Cities in Region */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Cities in South Tunisia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <Link key={city.slug} href={`/cities/${city.slug}`} className="group">
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={city.image || `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(city.name)}`}
                      alt={city.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      {city.name}
                    </CardTitle>
                    <CardDescription>{city.category || "City"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3">{city.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Explore {city.name}
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
