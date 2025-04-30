import { getAllCities } from "@/lib/data"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export default async function CitiesPage() {
  const cities = await getAllCities()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Explore Tunisian Cities</h1>
      <p className="text-lg mb-8">
        Discover the diverse cities of Tunisia, from coastal gems to desert oases, ancient ruins to vibrant medinas.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities.map((city) => (
          <Card key={city.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image
                src={city.hero_image_link || "/sahara-oasis.png"}
                alt={city.name}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/sahara-oasis.png"
                }}
              />
            </div>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">{city.name}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {city.about_city || `Explore the beautiful area of ${city.name}.`}
              </p>
              <Link
                href={`/cities/${city.slug}`}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Explore {city.name}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
