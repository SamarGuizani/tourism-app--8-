import Link from "next/link"
import { Users, Map, Building2, Calendar, Settings } from "lucide-react"

type User = {
  id: string
  name: string | null
  email: string
}

export function AdminDashboard({ user }: { user: User }) {
  const adminModules = [
    {
      title: "User Management",
      description: "Manage users, guides, and permissions",
      icon: Users,
      link: "/dashboard/users",
    },
    {
      title: "Regions & Cities",
      description: "Manage regions, cities, and locations",
      icon: Map,
      link: "/dashboard/regions",
    },
    {
      title: "Attractions",
      description: "Manage attractions, restaurants, and hotels",
      icon: Building2,
      link: "/dashboard/attractions",
    },
    {
      title: "Bookings",
      description: "View and manage all bookings",
      icon: Calendar,
      link: "/dashboard/bookings",
    },
    {
      title: "System Settings",
      description: "Configure system settings and preferences",
      icon: Settings,
      link: "/dashboard/settings",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
        <p className="text-gray-600 mb-4">
          Welcome to the admin dashboard. Here you can manage all aspects of the Tunisia Tourism platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminModules.map((module) => (
          <Link
            key={module.title}
            href={module.link}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="flex items-center gap-3 mb-3">
              <module.icon className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-medium">{module.title}</h3>
            </div>
            <p className="text-gray-600 text-sm flex-grow">{module.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
