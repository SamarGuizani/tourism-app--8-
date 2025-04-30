import Link from "next/link"
import { Calendar, Map, Heart, MessageSquare, Star } from "lucide-react"

type User = {
  id: string
  name: string | null
  email: string
}

export function TouristDashboard({ user }: { user: User }) {
  const touristModules = [
    {
      title: "My Bookings",
      description: "View and manage your tour bookings",
      icon: Calendar,
      link: "/dashboard/bookings",
    },
    {
      title: "Explore Tunisia",
      description: "Discover regions, cities, and attractions",
      icon: Map,
      link: "/explore",
    },
    {
      title: "Saved Places",
      description: "View your saved attractions and places",
      icon: Heart,
      link: "/dashboard/saved",
    },
    {
      title: "Messages",
      description: "Chat with guides and locals",
      icon: MessageSquare,
      link: "/dashboard/messages",
    },
    {
      title: "My Reviews",
      description: "Manage your reviews and ratings",
      icon: Star,
      link: "/dashboard/reviews",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Tourist Dashboard</h2>
        <p className="text-gray-600 mb-4">
          Welcome to your tourist dashboard. Plan your perfect Tunisia trip from here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {touristModules.map((module) => (
          <Link
            key={module.title}
            href={module.link}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="flex items-center gap-3 mb-3">
              <module.icon className="h-6 w-6 text-purple-600" />
              <h3 className="text-lg font-medium">{module.title}</h3>
            </div>
            <p className="text-gray-600 text-sm flex-grow">{module.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
