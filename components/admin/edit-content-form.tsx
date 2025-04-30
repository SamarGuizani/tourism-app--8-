"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface City {
  id: string
  name: string
  slug: string
  region: string
}

interface EditContentFormProps {
  contentType: "restaurants" | "activities" | "attractions"
  item: any
  cities: City[]
}

export default function EditContentForm({ contentType, item, cities }: EditContentFormProps) {
  const [formData, setFormData] = useState({
    name: item.name || "",
    description: item.description || "",
    city_slug: item.city_slug || "",
    location: item.location || "",
    address: item.address || "",
    google_map_link: item.google_map_link || "",
    image_url: item.image_url || "",
    type: item.type || "",
  })
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

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

      const updatedItem = {
        ...formData,
        city_name: selectedCity?.name || "",
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from(contentType).update(updatedItem).eq("id", item.id)

      if (error) throw error

      toast({
        title: "Success",
        description: `${contentType.slice(0, -1)} updated successfully.`,
      })

      // Redirect back to admin page
      router.push("/admin")
      router.refresh()
    } catch (error) {
      console.error(`Error updating ${contentType.slice(0, -1)}:`, error)
      toast({
        title: "Error",
        description: `Failed to update ${contentType.slice(0, -1)}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
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

          <div className="flex space-x-4">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/admin")}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
