"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase-client"

export default function AddPlaceTest() {
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [testResults, setTestResults] = useState({})
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [debugInfo, setDebugInfo] = useState(null)

  const [formData, setFormData] = useState({
    name: "Test Place " + new Date().toISOString().slice(0, 10),
    description: "This is a test place created for testing purposes.",
    city_id: "",
    type: "attraction",
    image_url: "https://placehold.co/600x400?text=Test+Place",
    location: "Test Location",
    google_map_link: "https://maps.google.com/?q=36.8065,10.1815",
  })

  useEffect(() => {
    fetchCities()
  }, [])

  function addTestResult(test, success, message) {
    setTestResults((prev) => ({
      ...prev,
      [test]: { success, message, timestamp: new Date().toISOString() },
    }))
  }

  async function fetchCities() {
    try {
      addTestResult("fetch_cities_attempt", true, "Attempting to fetch cities")

      // Try cities table first
      let { data, error } = await supabase.from("cities").select("id, name").order("name")

      if (error || (data && data.length === 0)) {
        // Fallback to city table
        const result = await supabase.from("city").select("id, name").order("name")
        data = result.data
        error = result.error
      }

      if (error) throw error

      setCities(data || [])

      if (data && data.length > 0) {
        setFormData((prev) => ({ ...prev, city_id: data[0].id.toString() }))
        addTestResult("fetch_cities", true, `Successfully fetched ${data.length} cities`)
      } else {
        addTestResult("fetch_cities", false, "No cities found in the database")
      }
    } catch (err) {
      console.error("Error fetching cities:", err)
      setError("Failed to fetch cities: " + err.message)
      addTestResult("fetch_cities", false, `Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleSelectChange(name, value) {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  async function uploadImage() {
    if (!imageFile) return formData.image_url // Return existing URL if no file

    try {
      addTestResult("upload_image_attempt", true, `Attempting to upload image: ${imageFile.name}`)

      // Create form data for upload
      const formData = new FormData()
      formData.append("file", imageFile)

      // Upload to Vercel Blob
      const response = await fetch("/api/upload-blob", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Upload failed with status: ${response.status}. ${errorData.details || ""}`)
      }

      const { url } = await response.json()

      addTestResult("upload_image", true, `Successfully uploaded image: ${url}`)
      return url
    } catch (err) {
      console.error("Error uploading image:", err)
      addTestResult("upload_image", false, `Error: ${err.message}`)
      // Return the default image URL instead of failing
      return formData.image_url
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)
    setDebugInfo(null)

    try {
      addTestResult("add_place_attempt", true, `Attempting to add place: ${formData.name}`)

      // Try to upload image, but fall back to the URL if it fails
      let imageUrl = formData.image_url
      if (imageFile) {
        try {
          imageUrl = await uploadImage()
        } catch (uploadError) {
          console.error("Image upload failed, using default URL:", uploadError)
          addTestResult(
            "image_upload_fallback",
            false,
            `Using default image URL due to upload error: ${uploadError.message}`,
          )
        }
      }

      // Prepare data with image URL
      const placeData = {
        ...formData,
        image_url: imageUrl,
      }

      // Collect debug info
      setDebugInfo({
        formData: placeData,
        timestamp: new Date().toISOString(),
      })

      // Try to insert into places table
      let insertResult
      try {
        insertResult = await supabase.from("places").insert([placeData]).select()
      } catch (insertError) {
        console.error("Error inserting into places table:", insertError)

        // Try to insert into attractions table as fallback
        try {
          const { city_id, ...rest } = placeData
          const attractionData = {
            ...rest,
            city_slug:
              cities
                .find((city) => city.id.toString() === city_id)
                ?.name.toLowerCase()
                .replace(/\s+/g, "-") || "unknown",
          }

          insertResult = await supabase.from("attractions").insert([attractionData]).select()
        } catch (attractionError) {
          throw new Error(`Failed to insert into places and attractions tables: ${attractionError.message}`)
        }
      }

      if (insertResult.error) {
        throw insertResult.error
      }

      setSuccess(true)
      addTestResult("add_place", true, `Successfully added place with ID: ${insertResult.data[0].id}`)

      // Reset form
      setFormData({
        name: "Test Place " + new Date().toISOString().slice(0, 10),
        description: "This is a test place created for testing purposes.",
        city_id: formData.city_id,
        type: "attraction",
        image_url: "https://placehold.co/600x400?text=Test+Place",
        location: "Test Location",
        google_map_link: "https://maps.google.com/?q=36.8065,10.1815",
      })
      setImageFile(null)
      setImagePreview(null)

      console.log("Place added successfully:", insertResult.data)
    } catch (err) {
      console.error("Error adding place:", err)
      setError(err.message)
      addTestResult("add_place", false, `Error: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Add Place Test Suite</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Test Adding a Place</CardTitle>
              <CardDescription>Test the functionality to add a new place to the database</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city_id">City</Label>
                    <Select
                      value={formData.city_id}
                      onValueChange={(value) => handleSelectChange("city_id", value)}
                      disabled={loading || cities.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.id.toString()}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {cities.length === 0 && !loading && (
                      <p className="text-red-500 text-sm mt-1">No cities available. Please add cities first.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="attraction">Attraction</SelectItem>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="activity">Activity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={formData.location} onChange={handleChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="google_map_link">Google Map Link</Label>
                  <Input
                    id="google_map_link"
                    name="google_map_link"
                    value={formData.google_map_link}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="flex-1"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Upload an image or use the default URL</p>
                    </div>

                    <div>
                      <Label htmlFor="image_url">Or Image URL</Label>
                      <Input
                        id="image_url"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  {imagePreview && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">Image Preview:</p>
                      <div className="border rounded-md overflow-hidden w-40 h-40">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={submitting || loading || cities.length === 0}>
                  {submitting ? "Adding Place..." : "Add Place"}
                </Button>
              </form>

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
                  <AlertDescription>Place added successfully!</AlertDescription>
                </Alert>
              )}

              {debugInfo && (
                <div className="mt-4 p-4 border rounded-md bg-gray-50">
                  <h3 className="font-medium mb-2">Debug Information</h3>
                  <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
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
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Database Check</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={fetchCities} variant="outline" className="w-full" disabled={loading}>
                {loading ? "Checking..." : "Check Database Connection"}
              </Button>

              {cities.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium text-sm">Available Cities:</p>
                  <ul className="mt-2 space-y-1">
                    {cities.slice(0, 5).map((city) => (
                      <li key={city.id} className="text-sm">
                        {city.name}
                      </li>
                    ))}
                    {cities.length > 5 && <li className="text-sm text-gray-500">...and {cities.length - 5} more</li>}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
