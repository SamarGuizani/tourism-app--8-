"use client"

import { CardContent } from "@/components/ui/card"

import { CardDescription } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import type React from "react"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"

export default function ImageUploadForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      return data.url
    },
    onSuccess: async (imageUrl) => {
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to upload images.",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.from("media_galleries").insert({
        title: title,
        description: description,
        url: imageUrl,
        type: "image",
        city_slug: "chebba", // Default city slug
        added_by: user.id,
      })

      if (error) {
        toast({
          title: "Error",
          description: "Failed to save image details to database.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Image uploaded successfully!",
        })
      }
      setTitle("")
      setDescription("")
      setImage(null)
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload image.",
        variant: "destructive",
      })
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!image) {
      toast({
        title: "Error",
        description: "Please select an image to upload.",
        variant: "destructive",
      })
      return
    }

    uploadImageMutation.mutate(image)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Image</CardTitle>
        <CardDescription>Upload a new image to the gallery</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="image">Image</Label>
            <Input type="file" id="image" accept="image/*" onChange={handleImageChange} required />
          </div>
          <Button type="submit" disabled={uploadImageMutation.isPending} className="w-full">
            {uploadImageMutation.isPending ? (
              <>
                Uploading...
                <ImageIcon className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Upload Image"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
