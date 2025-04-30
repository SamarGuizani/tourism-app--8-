"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"

interface City {
  id: string
  name: string
  slug: string
  region: string
}

interface AddContentFormProps {
  cities: City[]
  userId: string
}

export default function AddContentForm({ cities, userId }: AddContentFormProps) {
  const [contentType, setContentType] = useState<"restaurants" | "activities" | "attractions">("restaurants")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    city_slug: "",
    location: "",
    address: "",
    google_map_link: "",
    image_url: "",
    type: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Find the selected city to get its name
      const selectedCity = cities.find((city) => city.slug === formData.city_slug)

      const newItem = {
        id: uuidv4(),
        ...formData,
        city_name: selectedCity?.name || "",
        added_by: userId,
        created_at: new Date().toISOString(),
      }

      const { error } = await supabase.from(contentType).insert(newItem)

      if (error) throw error

      toast({
        title: "Success",
        description: `${contentType.slice(0, -1)} added successfully.`,
      })

      // Reset form
      setFormData({
        name: "",
        description: "",
        city_slug: "",
        location: "",
        address: "",
        google_map_link: "",
        image_url: "",
        type: "",
      })
    } catch (error) {
      console.error(`Error adding ${contentType.slice(0, -1)}:`, error)
      toast({
        title: "Error",
        description: `Failed to add ${contentType.slice(0, -1)}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Content</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={contentType} onValueChange={(value) => setContentType(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="restaurants">Restaurant</TabsTrigger>
            <TabsTrigger value="activities">Activity</TabsTrigger>
            <TabsTrigger value="attractions">Attraction</TabsTrigger>
          </TabsList>

          <TabsContent value={contentType} className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea name="description" value={formData.description} onChange={handleChange} required rows={4} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <Select
                  value={formData.city_slug}
                  onValueChange={(value) => handleSelectChange("city_slug", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
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

              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input name="location" value={formData.location} onChange={handleChange} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <Input name="address" value={formData.address} onChange={handleChange} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Google Map Link</label>
                <Input
                  name="google_map_link"
                  value={formData.google_map_link}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <Input
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {contentType === "activities" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="relaxation">Relaxation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Adding..." : `Add ${contentType.slice(0, -1)}`}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
