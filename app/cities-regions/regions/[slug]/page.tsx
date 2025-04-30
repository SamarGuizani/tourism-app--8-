import { notFound } from "next/navigation"
import { ClientImage as Image } from "@/components/client-image"
import Link from "next/link"
import { regions } from "@/lib/region-data"
import { getCityBySlug } from "@/lib/data"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"

interface RegionPageProps {
  params: {
    slug: string
  }
}

export default function RegionPage({ params }: RegionPageProps) {
  const { slug } = params

  // Find the region
  const region = regions.find((r) => r.slug === slug)

  if (!region) {
    notFound()
  }

  // Get cities in this region
  const cities = region.cities.map((citySlug) => getCityBySlug(citySlug))

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="relative h-[40vh] rounded-xl overflow-hidden mb-12">
          <Image src={region.image || "/placeholder.svg"} alt={region.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="p-8 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{region.name}</h1>
              <p className="text-lg md:text-xl max-w-2xl">{region.description}</p>
            </div>
          </div>
        </div>

        {/* Cities in Region */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Cities in {region.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <Link key={city.slug} href={`/cities-regions/${city.slug}`} className="group">
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={city.image || "/placeholder.svg"}
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
                    <CardDescription>{city.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3">{city.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/cities" className="w-full">
                      <Button variant="outline" className="w-full">
                        Explore Cities
                      </Button>
                    </Link>
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

export async function generateStaticParams() {
  return regions.map((region) => ({
    slug: region.slug,
  }))
}
