"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { createClientInstance } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { StarIcon, PhoneIcon, MailIcon, User2Icon, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface GuideBookingFormProps {
  guide: {
    id: string
    user_id: string
    bio: string
    languages: string[]
    locations: string[]
    tourist_price: number
    local_price: number
    rating: number
    phone_number?: string
    age?: number
    contact_email?: string
    photo_url?: string
    name?: string
    email?: string
    expertise?: string
    hourly_rate?: number
  }
  citySlug?: string
  attractionId?: string
  restaurantId?: string
  activityId?: string
}

export default function GuideBookingForm({
  guide,
  citySlug,
  attractionId,
  restaurantId,
  activityId,
}: GuideBookingFormProps) {
  const { user } = useAuth()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [hours, setHours] = useState(2)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string>(citySlug || "")
  const [availableLocations, setAvailableLocations] = useState<string[]>([])
  const [isCheckingSchema, setIsCheckingSchema] = useState(false)
  const [schemaError, setSchemaError] = useState<string | null>(null)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    hours: "",
    notes: "",
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.time) newErrors.time = "Time is required"
    if (!formData.hours) newErrors.hours = "Hours is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const supabase = createClientInstance()

      const { data, error } = await supabase
        .from("bookings")
        .insert({
          guide_id: guide.id,
          date: formData.date,
          time: formData.time,
          hours: Number.parseInt(formData.hours),
          notes: formData.notes,
          status: "pending",
          total_price: calculateTotalPrice(),
        })
        .select()

      if (error) throw error

      router.push(`/booking-confirmation?id=${data[0].id}`)
    } catch (error) {
      console.error("Booking error:", error)
      setErrors({ form: "Failed to create booking. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateTotalPrice = () => {
    const hours = Number.parseInt(formData.hours) || 0
    return hours * (guide.hourly_rate || 0)
  }

  // Ensure guide locations are properly loaded
  useEffect(() => {
    // Make sure guide.locations is an array
    if (guide && guide.locations) {
      if (Array.isArray(guide.locations)) {
        setAvailableLocations(guide.locations)
      } else if (typeof guide.locations === "string") {
        // If it's a string (possibly from JSON), try to parse it
        try {
          const locationsArray = JSON.parse(guide.locations)
          if (Array.isArray(locationsArray)) {
            setAvailableLocations(locationsArray)
          } else {
            setAvailableLocations([])
          }
        } catch (e) {
          // If parsing fails, treat it as a single location
          setAvailableLocations([guide.locations])
        }
      }
    } else {
      setAvailableLocations([])
    }

    // Set default selected location if provided and valid
    if (citySlug && availableLocations.includes(citySlug)) {
      setSelectedLocation(citySlug)
    } else if (availableLocations.length > 0) {
      setSelectedLocation(availableLocations[0])
    }
  }, [guide, citySlug, guide.locations])

  const hourlyRate = user?.is_local ? guide.local_price : guide.tourist_price
  const totalPrice = hourlyRate * hours
  const commission = totalPrice * 0.2 // 20% commission
  const netAmount = totalPrice - commission // Calculate net amount (total price minus commission)

  const handleBook = async () => {
    if (!user || !date) {
      setBookingError("Please sign in and select a date")
      return
    }

    if (!selectedLocation) {
      setBookingError("Please select a location for your tour")
      return
    }

    setIsBooking(true)
    setBookingError(null)

    try {
      const res = await fetch("/api/create-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guide_id: guide.id,
          tourist_id: user.id,
          location: selectedLocation,
          date: date.toISOString(),
          hours: Math.floor(Number(hours)),
          total_price: Math.floor(totalPrice),
          commission: Math.floor(commission),
          net_amount: Math.floor(netAmount),
          attraction_id: attractionId || null,
          restaurant_id: restaurantId || null,
          activity_id: activityId || null,
        }),
      })

      const data = await res.json()

      if (data.error) {
        setBookingError(data.error)
      } else {
        if (data.success === false && data.message) {
          setBookingError(data.message)
        } else {
          setBookingComplete(true)
        }
      }
    } catch (error) {
      console.error("Booking error:", error)
      setBookingError(`Failed to complete booking: ${error.message}`)
    } finally {
      setIsBooking(false)
    }
  }

  if (bookingComplete) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-green-600">Booking Confirmed!</CardTitle>
          <CardDescription className="text-center">Your booking with {guide.name} has been confirmed.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-4">
            <p className="font-medium">Date: {date ? format(date, "PPP") : ""}</p>
            <p className="font-medium">Duration: {hours} hours</p>
            <p className="font-medium">Location: {selectedLocation.replace(/-/g, " ")}</p>
            <p className="font-medium">Total: {Math.floor(totalPrice)} DT</p>
          </div>
          <p className="text-sm text-gray-500 mb-4">You will receive a confirmation email with all the details.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/dashboard">
            <Button>View My Bookings</Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {schemaError && (
        <div className="col-span-1 md:col-span-2">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Schema Error</AlertTitle>
            <AlertDescription>
              {schemaError}{" "}
              <Link href="/fix-utilities" className="underline font-medium">
                Click here to update the schema
              </Link>
              .
            </AlertDescription>
          </Alert>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Guide Profile</CardTitle>
          <CardDescription>Learn more about your guide</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={
                  guide.photo_url ||
                  `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(guide.name || "Guide")}`
                }
                alt={guide.name || "Guide"}
              />
              <AvatarFallback>{guide.name?.charAt(0) || "G"}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{guide.name || "Unknown Guide"}</h3>
              <div className="flex items-center">
                <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm ml-1">{guide.rating.toFixed(1)}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {guide.languages &&
                  Array.isArray(guide.languages) &&
                  guide.languages.map((lang: string) => (
                    <Badge key={lang} variant="secondary" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">About</h4>
            <p className="text-sm text-gray-600">{guide.bio}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Age</h4>
              <p className="text-sm flex items-center gap-1">
                <User2Icon className="h-3.5 w-3.5 text-gray-500" />
                {guide.age || "Not specified"}
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Contact</h4>
              <p className="text-sm flex items-center gap-1">
                <PhoneIcon className="h-3.5 w-3.5 text-gray-500" />
                {guide.phone_number || "Not available"}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-medium">Email</h4>
            <p className="text-sm flex items-center gap-1">
              <MailIcon className="h-3.5 w-3.5 text-gray-500" />
              {guide.contact_email || guide.email || "Not available"}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Locations</h4>
            <div className="flex flex-wrap gap-1">
              {availableLocations.length > 0 ? (
                availableLocations.map((location: string) => (
                  <Badge key={location} variant="outline" className="text-xs">
                    {location.replace(/-/g, " ")}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500">No locations available</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="border rounded-md p-3 text-center">
              <p className="text-sm text-gray-500">Tourist Price</p>
              <p className="font-semibold">{guide.tourist_price} DT/hour</p>
            </div>
            <div className="border rounded-md p-3 text-center">
              <p className="text-sm text-gray-500">Local Price</p>
              <p className="font-semibold">{guide.local_price} DT/hour</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Book {guide.name}</CardTitle>
          <CardDescription>
            Expertise: {guide.expertise} | Languages: {guide.languages.join(", ")} | ${guide.hourly_rate}/hour
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} />
              {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} />
              {errors.time && <p className="text-sm text-red-500">{errors.time}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Hours</Label>
              <Input id="hours" name="hours" type="number" min="1" value={formData.hours} onChange={handleChange} />
              {errors.hours && <p className="text-sm text-red-500">{errors.hours}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Special Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Any special requests for the guide?"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}
          </CardContent>

          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Booking"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
