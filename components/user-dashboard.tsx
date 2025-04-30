"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

import LocalDashboard from "@/components/local-dashboard"
import GuideDashboard from "@/components/guide-dashboard"

interface UserDashboardProps {
  user: any
  userData: any
}

export default function UserDashboard({ user, userData }: UserDashboardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    contributions: 0,
    bookings: 0,
    favorites: 0,
  })

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch user contributions count
      const fetchContributionsCount = async () => {
        const tables = ["city", "attractions", "restaurants", "activities"]
        let totalCount = 0

        for (const table of tables) {
          try {
            const { count, error } = await supabase
              .from(table)
              .select("*", { count: "exact", head: true })
              .eq("added_by", user.id)

            if (!error && count !== null) {
              totalCount += count
            }
          } catch (err) {
            console.error(`Error counting ${table}:`, err)
          }
        }

        return totalCount
      }

      // Fetch user bookings count
      const fetchBookingsCount = async () => {
        const { count, error } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })
          .eq("tourist_id", user.id)

        if (error) throw error
        return count || 0
      }

      // Fetch user favorites count
      const fetchFavoritesCount = async () => {
        const { count, error } = await supabase
          .from("favorites")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)

        if (error) throw error
        return count || 0
      }

      // Execute all fetches in parallel
      const [contributionsCount, bookingsCount, favoritesCount] = await Promise.all([
        fetchContributionsCount(),
        fetchBookingsCount(),
        fetchFavoritesCount(),
      ])

      // Update stats
      setStats({
        contributions: contributionsCount,
        bookings: bookingsCount,
        favorites: favoritesCount,
      })
    } catch (err: any) {
      console.error("Error fetching user data:", err)
      setError(err.message || "Failed to load your dashboard data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>
            You need to be logged in to view your dashboard.
            <div className="mt-4">
              <Link href="/login?next=/dashboard">
                <Button>Sign In</Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>

      {userData?.is_local && <LocalDashboard />}
      {userData?.is_guide && <GuideDashboard />}

      {!userData?.is_local && !userData?.is_guide && (
        <Card>
          <CardContent className="py-6">
            <p className="mb-4">You are currently a tourist. Explore the site and book a guide!</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <h3 className="text-2xl font-bold">{stats.bookings}</h3>
                  <p className="text-sm text-gray-500">Bookings</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <h3 className="text-2xl font-bold">{stats.favorites}</h3>
                  <p className="text-sm text-gray-500">Favorites</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <h3 className="text-2xl font-bold">{stats.contributions}</h3>
                  <p className="text-sm text-gray-500">Contributions</p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6">
              <Link href="/book-guide">
                <Button>Find a Guide</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
