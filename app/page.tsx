import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Compass, Waves, TreePalmIcon as PalmTree } from "lucide-react"
// Import the CitySearch component
import { CitySearch } from "@/components/city-search"
import { ClientImage } from "@/components/client-image"

export default function HomePage() {
  const destinations = [
    {
      name: "Sidi Bou Said",
      description: "Blue and white village by the sea",
      image: "/destinations/sidi-bou-said-view.jpeg",
      icon: <PalmTree className="h-4 w-4" />,
      link: "/cities-regions/sidi-bou-said",
    },
    {
      name: "Hammamet",
      description: "Beautiful beaches and Mediterranean charm",
      image: "/destinations/hammamet-white-buildings.jpeg",
      icon: <MapPin className="h-4 w-4" />,
      link: "/cities-regions/hammamet",
    },
    {
      name: "Djerba",
      description: "Island paradise with pristine waters",
      image: "/destinations/djerba-aerial-view.jpeg",
      icon: <Waves className="h-4 w-4" />,
      link: "/cities-regions/djerba",
    },
    {
      name: "El Haouaria",
      description: "Crystal clear waters and coastal beauty",
      image: "/destinations/haouaria-clear-waters.jpeg",
      icon: <Compass className="h-4 w-4" />,
      link: "/cities-regions/haouaria",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="relative w-full h-[500px]">
        <ClientImage src="/carthage-coastline.png" alt="Tunisia" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center text-center">
          <div className="max-w-3xl px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Discover Tunisia</h1>
            <p className="text-xl text-white/90 mb-8">
              Explore ancient ruins, beautiful beaches, and delicious cuisine in this Mediterranean gem
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/regions">
                <Button size="lg" className="bg-white text-black hover:bg-white/90">
                  Explore Regions
                </Button>
              </Link>
              <Link href="/map-view">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  View Map
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-12 px-4">
        <CitySearch />
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination) => (
              <Link key={destination.name} href={destination.link}>
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                  <div className="relative w-full h-[200px]">
                    <ClientImage
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <span className="mr-2">{destination.icon}</span>
                      {destination.name}
                    </CardTitle>
                    <CardDescription>{destination.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">© 2023 Tunisia Tourism Guide. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
