import type { Metadata } from "next"
import { ClientImage as Image } from "@/components/client-image"
import Link from "next/link"
import { getRegionBySlug, getCitiesByRegion } from "@/lib/region-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import RegionGuidesSection from "@/components/region-guides-section"

export const metadata: Metadata = {
  title: "North Tunisia | Discover Tunisia",
  description: "Explore the lush green landscapes and beautiful coastlines of Northern Tunisia",
}

export default function NorthTunisiaPage() {
  const region = getRegionBySlug("north-tunisia")
  const cities = getCitiesByRegion("north-tunisia")

  if (!region) {
    return <div>Region not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative h-[40vh] w-full mb-8 rounded-xl overflow-hidden">
        <Image src={region.image || "/placeholder.svg"} alt={region.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/30 flex items-end">
          <div className="p-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{region.name}</h1>
            <p className="text-lg max-w-2xl">{region.description}</p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">About North Tunisia</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-700 mb-4">
              North Tunisia is characterized by its Mediterranean climate, lush green landscapes, and beautiful
              coastlines. This region is home to the capital city Tunis, as well as numerous historical sites, including
              ancient Carthage and the blue and white village of Sidi Bou Said.
            </p>
            <p className="text-gray-700 mb-4">
              The region features diverse landscapes from coastal areas with pristine beaches to mountainous terrain
              covered in cork oak forests. North Tunisia is rich in history, with influences from Phoenician, Roman,
              Arab, Ottoman, and French civilizations visible in its architecture and cultural heritage.
            </p>
            <p className="text-gray-700">
              Visitors to North Tunisia can explore vibrant cities, relax on beautiful beaches, discover ancient ruins,
              and experience the unique blend of Mediterranean and North African cultures that define this region.
            </p>
          </div>
          <div className="relative h-[300px] rounded-xl overflow-hidden">
            <Image src="/tunisian-vista.png" alt="North Tunisia landscape" fill className="object-cover" />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Cities in North Tunisia</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cities.map((city) => (
            <Card key={city.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src={city.image || `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(city.name)}`}
                  alt={city.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2">{city.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{city.description}</p>
                <Link href={`/cities/${city.slug}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Explore <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Top Attractions in North Tunisia</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="overflow-hidden">
            <div className="relative h-48">
              <Image src="/attractions/carthage-ruins.jpg" alt="Carthage Ruins" fill className="object-cover" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">Carthage Ruins</h3>
              <p className="text-gray-600 text-sm">
                Explore the ancient ruins of Carthage, once a powerful Phoenician and Roman city.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="relative h-48">
              <Image src="/attractions/medina-tunis.jpg" alt="Medina of Tunis" fill className="object-cover" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">Medina of Tunis</h3>
              <p className="text-gray-600 text-sm">
                Wander through the UNESCO-listed old town with its maze of narrow streets and traditional souks.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="relative h-48">
              <Image src="/dougga-ancient-city.png" alt="Dougga Archaeological Site" fill className="object-cover" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">Dougga Archaeological Site</h3>
              <p className="text-gray-600 text-sm">
                Visit one of the best-preserved Roman sites in North Africa with impressive temples and theaters.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Local Guides in North Tunisia</h2>
        <RegionGuidesSection regionName="North Tunisia" />
      </div>
    </div>
  )
}
