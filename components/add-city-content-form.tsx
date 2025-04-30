"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { ImageIcon } from "lucide-react"

interface AddCityContentFormProps {
  citySlug?: string
  cityName?: string
  cityRegion?: string
}

export default function AddCityContentForm({
  citySlug = "tunis",
  cityName = "Tunis",
  cityRegion = "North Tunisia",
}: AddCityContentFormProps = {}) {
  const { user } = useAuth()
  const router = useRouter()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    if (!user) {
      setError("You must be logged in to add content.")
      return
    }

    if (!name || !description || !image) {
      setError("Please fill in all required fields.")
      return
    }

    try {
      // Upload image to Vercel Blob
      const formData = new FormData()
      formData.append("file", image)

      const uploadResponse = await fetch("/api/upload-blob", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image")
      }

      const uploadData = await uploadResponse.json()
      const imageUrl = uploadData.url

      // Insert data into Supabase
      const { error: insertError } = await supabase.from("media_galleries").insert({
        title: name,
        description: description,
        url: imageUrl,
        type: "image",
        city_slug: citySlug,
        added_by: user.id,
      })

      if (insertError) throw insertError

      setSuccess("Content added successfully!")
      toast({
        title: "Success",
        description: "Content added successfully!",
      })
      router.refresh()
    } catch (err) {
      console.error("Error adding content:", err)
      setError(`Failed to add content: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add Content to {cityName}</CardTitle>
        <CardDescription>Add new images and descriptions to the media gallery</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Title</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Image title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Image description"
              className="min-h-32"
              required
            />
          </div>

          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setImage(file)
                }
              }}
              required
            />
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">{success}</div>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                Adding Content...
                <ImageIcon className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Add Content"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
