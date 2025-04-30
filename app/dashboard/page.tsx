import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { GuideDashboard } from "@/components/dashboard/guide-dashboard"
import { TouristDashboard } from "@/components/dashboard/tourist-dashboard"
import { LocalDashboard } from "@/components/dashboard/local-dashboard"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get user profile with role information
  const { data: user } = await supabase.from("users").select("*").eq("id", session.user.id).single()

  if (!user) {
    // User authenticated but no profile found
    redirect("/profile/setup")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        {user.is_admin && <AdminDashboard user={user} />}
        {user.is_guide && <GuideDashboard user={user} />}
        {user.is_tourist && <TouristDashboard user={user} />}
        {user.is_local && <LocalDashboard user={user} />}

        {/* If no specific role is set, show default dashboard */}
        {!user.is_admin && !user.is_guide && !user.is_tourist && !user.is_local && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome to Tunisia Tourism</h2>
            <p className="mb-4">Your account doesn't have a specific role yet.</p>
            <a href="/profile/edit" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Complete Your Profile
            </a>
          </div>
        )}
      </main>
    </div>
  )
}
