import Link from "next/link"
import { Calendar, Users, MessageSquare, Map, Star } from "lucide-react"

type User = {
  id: string
  name: string | null
  email: string
}

export function GuideDashboard({ user }: { user: User }) {
  const guideModules = [
    {
      title: "My Tours",
      description: "Manage your upcoming and past tours",
      icon: Calendar,
      link: "/dashboard/tours",
    },
    {
      title: "My Clients",
      description: "View and manage your client list",
      icon: Users,
      link: "/dashboard/clients",
    },
    {
      title: "Messages",
      description: "Chat with tourists and manage inquiries",
      icon: MessageSquare,
      link: "/dashboard/messages",
    },
    {
      title: "My Locations",
      description: "Manage your specialized locations and regions",
      icon: Map,
      link: "/dashboard/locations",
    },
    {
      title: "Reviews",
      description: "View your reviews and ratings",
      icon: Star,
      link: "/dashboard/reviews",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Guide Dashboard</h2>
        <p className="text-gray-600 mb-4">
          Welcome to your guide dashboard. Manage your tours, clients, and profile from here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {guideModules.map((module) => (
          <Link
            key={module.title}
            href={module.link}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="flex items-center gap-3 mb-3">
              <module.icon className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-medium">{module.title}</h3>
            </div>
            <p className="text-gray-600 text-sm flex-grow">{module.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
