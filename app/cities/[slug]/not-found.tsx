import Link from "next/link"

export default function CityNotFound() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-4xl font-bold mb-4">City Not Found</h1>
      <p className="text-lg mb-6">Sorry, we couldn't find the city you're looking for.</p>
      <Link href="/cities" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        View All Cities
      </Link>
    </div>
  )
}
