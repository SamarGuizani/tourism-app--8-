import Link from "next/link"
import { UserCircle } from "lucide-react"

type User = {
  id: string
  name: string | null
  email: string
  is_admin: boolean | null
  is_guide: boolean | null
  is_tourist: boolean | null
  is_local: boolean | null
}

export function DashboardHeader({ user }: { user: User }) {
  // Determine user role for display
  const userRole = user.is_admin
    ? "Admin"
    : user.is_guide
      ? "Guide"
      : user.is_tourist
        ? "Tourist"
        : user.is_local
          ? "Local"
          : "User"

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{userRole} Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name || user.email}</p>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/dashboard/notifications" className="text-gray-600 hover:text-gray-900">
            Notifications
          </Link>
          <Link href="/profile" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <UserCircle className="h-5 w-5" />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
