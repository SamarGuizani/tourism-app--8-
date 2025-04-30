"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CheckCircle, AlertCircle, CalendarIcon } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format } from "date-fns"

export default function BookingTest() {
  const [guides, setGuides] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [testResults, setTestResults] = useState({})
  const [user, setUser] = useState(null)

  const [formData, setFormData] = useState({
    guide_id: "",
    location: "",
    date: new Date(),
    hours: 2,
    total_price: 0,
    commission: 0,
    net_amount: 0,
  })

  const supabase = createClientComponentClient()

  useEffect(() => {
    checkSession()
    fetchData()
  }, [])

  useEffect(() => {
    if (formData.guide_id && guides.length > 0) {
      const selectedGuide = guides.find((g) => g.id === formData.guide_id)
      if (selectedGuide) {
        const hourlyRate = user?.is_local ? selectedGuide.local_price : selectedGuide.tourist_price
        const totalPrice = hourlyRate * formData.hours
        const commission = totalPrice * 0.2 // 20% commission
        const netAmount = totalPrice - commission

        setFormData((prev) => ({
          ...prev,
          total_price: totalPrice,
          commission: commission,
          net_amount: netAmount,
        }))
      }
    }
  }, [formData.guide_id, formData.hours, guides, user])

  function addTestResult(test, success, message) {
    setTestResults((prev) => ({
      ...prev,
      [test]: { success, message, timestamp: new Date().toISOString() },
    }))
  }

  async function checkSession() {
    try {
      addTestResult("check_session", true, "Checking user session")

      const { data, error } = await supabase.auth.getSession()
      if (error) throw error

      if (data.session) {
        setUser(data.session.user)

        // Get user profile to check if local
        try {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("is_local, is_tourist")
            .eq("id", data.session.user.id)
            .single()

          if (!profileError && profile) {
            setUser((prev) => ({
              ...prev,
              is_local: profile.is_local,
              is_tourist: profile.is_tourist,
            }))
          }
        } catch (profileError) {
          console.error("Error fetching profile:", profileError)
          // Continue anyway, just without the is_local/is_tourist flags
        }

        addTestResult("user_session", true, `User logged in: ${data.session.user.email}`)
      } else {
        addTestResult("user_session", false, "No user logged in")
      }
    } catch (err) {
      console.error("Session check error:", err)
      addTestResult("user_session", false, `Error: ${err.message}`)
    }
  }

  async function fetchData() {
    try {
      setLoading(true)

      // Fetch guides
      addTestResult("fetch_guides_attempt", true, "Attempting to fetch guides")

      try {
        // First try with the join
        const { data: guidesData, error: guidesError } = await supabase
          .from("guides")
          .select("*, profiles(name, email)")
          .order("id")

        if (guidesError) throw guidesError

        const formattedGuides = guidesData.map((guide) => ({
          ...guide,
          name: guide.profiles?.name || "Unknown Guide",
          email: guide.profiles?.email,
        }))

        setGuides(formattedGuides)
        addTestResult("fetch_guides", true, `Successfully fetched ${formattedGuides.length} guides`)
      } catch (guidesJoinError) {
        console.error("Error fetching guides with join:", guidesJoinError)
        addTestResult("fetch_guides_join", false, `Error with join: ${guidesJoinError.message}`)

        // Fallback to fetching guides without the join
        try {
          const { data: guidesData, error: guidesError } = await supabase.from("guides").select("*").order("id")

          if (guidesError) throw guidesError

          const formattedGuides = guidesData.map((guide) => ({
            ...guide,
            name: guide.user_id || "Unknown Guide",
            email: "",
          }))

          setGuides(formattedGuides)
          addTestResult("fetch_guides_fallback", true, `Fetched ${formattedGuides.length} guides without profile data`)
        } catch (fallbackError) {
          console.error("Error in guides fallback:", fallbackError)
          addTestResult("fetch_guides_fallback", false, `Error: ${fallbackError.message}`)
          setGuides([])
        }
      }

      // Fetch cities
      addTestResult("fetch_cities_attempt", true, "Attempting to fetch cities")
      try {
        const { data: citiesData, error: citiesError } = await supabase
          .from("city")
          .select("id, name, slug")
          .order("name")

        if (citiesError) throw citiesError

        setCities(citiesData || [])

        if (citiesData && citiesData.length > 0) {
          setFormData((prev) => ({ ...prev, location: citiesData[0].slug }))
          addTestResult("fetch_cities", true, `Successfully fetched ${citiesData.length} cities`)
        } else {
          addTestResult("fetch_cities", false, "No cities found in the database")
        }
      } catch (citiesError) {
        console.error("Error fetching cities:", citiesError)
        addTestResult("fetch_cities", false, `Error: ${citiesError.message}`)
        setCities([])
      }
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to fetch data: " + err.message)
      addTestResult("fetch_data", false, `Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  function handleSelectChange(name, value) {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleHoursChange(e) {
    const hours = Number.parseInt(e.target.value) || 1
    setFormData((prev) => ({ ...prev, hours: Math.max(1, Math.min(8, hours)) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!user) {
      setError("You must be logged in to book a guide")
      return
    }

    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      addTestResult("booking_attempt", true, `Attempting to create booking with guide ID: ${formData.guide_id}`)

      const bookingData = {
        guide_id: formData.guide_id,
        tourist_id: user.id,
        location: formData.location,
        date: formData.date.toISOString(),
        hours: formData.hours,
        total_price: Math.floor(formData.total_price),
        commission: Math.floor(formData.commission),
        net_amount: Math.floor(formData.net_amount),
      }

      // Create booking
      const { data, error } = await supabase.from("bookings").insert([bookingData]).select()

      if (error) throw error

      setSuccess(true)
      addTestResult("booking_created", true, `Successfully created booking with ID: ${data[0].id}`)
    } catch (err) {
      console.error("Error creating booking:", err)
      setError(err.message)
      addTestResult("booking_created", false, `Error: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Booking Test Suite</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Test Guide Booking</CardTitle>
              <CardDescription>Test the functionality to book a guide</CardDescription>
            </CardHeader>
            <CardContent>
              {!user ? (
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Authentication Required</AlertTitle>
                  <AlertDescription>
                    <p>You need to be logged in to test the booking functionality.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => (window.location.href = "/tests/auth")}
                    >
                      Go to Auth Test
                    </Button>
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="guide_id">Select Guide</Label>
                    <Select
                      value={formData.guide_id}
                      onValueChange={(value) => handleSelectChange("guide_id", value)}
                      disabled={loading || guides.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a guide" />
                      </SelectTrigger>
                      <SelectContent>
                        {guides.map((guide) => (
                          <SelectItem key={guide.id} value={guide.id}>
                            {guide.name} - {guide.tourist_price} DT/hour
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {guides.length === 0 && !loading && (
                      <p className="text-red-500 text-sm mt-1">No guides available. Please add guides first.</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select
                      value={formData.location}
                      onValueChange={(value) => handleSelectChange("location", value)}
                      disabled={loading || cities.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.slug}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => setFormData((prev) => ({ ...prev, date }))}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hours">Number of Hours</Label>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData((prev) => ({ ...prev, hours: Math.max(1, prev.hours - 1) }))}
                        disabled={formData.hours <= 1}
                      >
                        -
                      </Button>
                      <Input
                        id="hours"
                        type="number"
                        min="1"
                        max="8"
                        value={formData.hours}
                        onChange={handleHoursChange}
                        className="mx-2 text-center"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData((prev) => ({ ...prev, hours: Math.min(8, prev.hours + 1) }))}
                        disabled={formData.hours >= 8}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span>Rate per hour:</span>
                      <span>
                        {formData.guide_id && guides.length > 0
                          ? `${
                              user?.is_local
                                ? guides.find((g) => g.id === formData.guide_id)?.local_price
                                : guides.find((g) => g.id === formData.guide_id)?.tourist_price
                            } DT`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Hours:</span>
                      <span>{formData.hours}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Subtotal:</span>
                      <span>{Math.floor(formData.total_price)} DT</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Platform fee (20%):</span>
                      <span>{Math.floor(formData.commission)} DT</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Guide receives:</span>
                      <span>{Math.floor(formData.net_amount)} DT</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={submitting || loading || !user || !formData.guide_id || guides.length === 0}
                  >
                    {submitting ? "Creating Booking..." : "Create Test Booking"}
                  </Button>
                </form>
              )}

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>Booking created successfully!</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(testResults).map(([test, result]) => (
                  <div key={test} className="flex items-start space-x-2 text-sm">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">{test.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</p>
                      <p className="text-gray-600">{result.message}</p>
                      <p className="text-gray-400 text-xs">{new Date(result.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}

                {Object.keys(testResults).length === 0 && (
                  <p className="text-gray-500 text-center py-2">No tests run yet</p>
                )}
              </div>

              <Button onClick={fetchData} variant="outline" className="w-full mt-4" disabled={loading}>
                {loading ? "Refreshing..." : "Refresh Data"}
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Current User</CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="space-y-2">
                  <p>
                    <strong>ID:</strong> {user.id}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>User Type:</strong> {user.is_local ? "Local" : user.is_tourist ? "Tourist" : "Unknown"}
                  </p>

                  <Button onClick={checkSession} variant="outline" size="sm" className="mt-2">
                    Refresh User
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No user is currently signed in</p>
                  <Button
                    onClick={() => (window.location.href = "/tests/auth")}
                    className="mt-2"
                    variant="outline"
                    size="sm"
                  >
                    Go to Auth Test
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
