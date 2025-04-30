"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function GuideDashboard() {
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setIsLoading(true)
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData?.user) return

      // Fetch guide profile
      const { data: guideData, error: guideError } = await supabase
        .from("guides")
        .select("id")
        .eq("user_id", userData.user.id)
        .single()

      if (guideError) {
        console.error("Error fetching guide data:", guideError)
        return
      }

      if (!guideData) return

      // Fetch bookings for this guide
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select(`
          *,
          users:tourist_id(name, email)
        `)
        .eq("guide_id", guideData.id)
        .order("date", { ascending: false })

      if (bookingsError) {
        console.error("Error fetching bookings:", bookingsError)
        return
      }

      setBookings(bookingsData || [])
    } catch (error) {
      console.error("Error in fetchBookings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Guide Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Your Bookings</h3>
            {isLoading ? (
              <p>Loading your bookings...</p>
            ) : bookings.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <h4 className="font-medium">Booking with {booking.users?.name || "Tourist"}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.date).toLocaleDateString()} at {booking.time}
                      </p>
                      <p className="text-sm mt-2">Duration: {booking.duration} hours</p>
                      <p className="text-sm">
                        Status: <span className="font-medium capitalize">{booking.status}</span>
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p>You don't have any bookings yet.</p>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/profile/edit">
              <Button>Update Guide Profile</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
