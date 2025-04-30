import Link from "next/link"
import { Home, MessageSquare, Map, Star, Users } from "lucide-react"

type User = {
  id: string
  name: string | null
  email: string
}

export function LocalDashboard({ user }: { user: User }) {
  const localModules = [
    {
      title: "My Recommendations",
      description: "Manage your local recommendations",
      icon: Home,
      link: "/dashboard/recommendations",
    },
    {
      title: "Messages",
      description: "Chat with tourists and answer questions",
      icon: MessageSquare,
      link: "/dashboard/messages",
    },
    {
      title: "My Region",
      description: "Update information about your region",
      icon: Map,
      link: "/dashboard/region",
    },
    {
      title: "Reviews",
      description: "View reviews of your recommendations",
      icon: Star,
      link: "/dashboard/reviews",
    },
    {
      title: "Connect with Tourists",
      description: "Find tourists visiting your area",
      icon: Users,
      link: "/dashboard/connect",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Local Dashboard</h2>
        <p className="text-gray-600 mb-4">
          Welcome to your local dashboard. Share your knowledge and help tourists discover the real Tunisia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {localModules.map((module) => (
          <Link
            key={module.title}
            href={module.link}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="flex items-center gap-3 mb-3">
              <module.icon className="h-6 w-6 text-orange-600" />
              <h3 className="text-lg font-medium">{module.title}</h3>
            </div>
            <p className="text-gray-600 text-sm flex-grow">{module.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
