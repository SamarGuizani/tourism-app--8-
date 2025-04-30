import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import Image from "next/image"

export default async function GovernoratesPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch all governorates
  const { data: governorates, error } = await supabase.from("governorates").select("*").order("name")

  if (error) {
    console.error("Error fetching governorates:", error)
    return <div>Error loading governorates</div>
  }

  // Group governorates by region
  const regionMap: Record<string, typeof governorates> = {}
  governorates.forEach((gov) => {
    if (!regionMap[gov.region]) {
      regionMap[gov.region] = []
    }
    regionMap[gov.region].push(gov)
  })

  const regions = Object.keys(regionMap).sort()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Governorates of Tunisia</h1>

      {regions.map((region) => (
        <div key={region} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">{region} Region</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regionMap[region].map((governorate) => (
              <Link href={`/governorates/${governorate.id}`} key={governorate.id} className="group">
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48 w-full">
                    <Image
                      src={governorate.image_url || "/placeholder-governorate.jpg"}
                      alt={governorate.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{governorate.name}</h3>
                    <p className="text-gray-600 line-clamp-2">{governorate.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
