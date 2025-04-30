import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

type CityCardProps = {
  city: {
    id: string
    name: string
    region: string
    description: string
    imageUrl: string
    slug?: string
  }
}

export default function CityCard({ city }: CityCardProps) {
  const href = city.slug ? `/cities/${city.slug}` : `/cities/${city.id}`

  return (
    <Link href={href} className="block">
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <div className="relative h-48 w-full">
          <Image
            src={city.imageUrl || "/placeholder.svg?height=200&width=400&query=city"}
            alt={city.name}
            fill={true}
            className="object-cover"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold">{city.name}</h3>
          <p className="text-sm text-gray-500">{city.region}</p>
          <p className="mt-2 line-clamp-2 text-sm">{city.description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
