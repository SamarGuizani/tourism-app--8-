"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { useToast } from "@/components/ui/use-toast"

interface Activity {
  id: string
  name: string
  description: string
  location?: string
  city_name?: string
  city_slug?: string
  region?: string
  image_url?: string
  duration?: string
  difficulty?: string
  type?: string
  google_map_link?: string
}

interface City {
  id: string
  name: string
  slug: string
  region: string
}

export default function AdminActivitiesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [activities, setActivities] = useState<Activity[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<Partial<Activity>>({
    id: uuidv4(),
    name: "",
    description: "",
    location: "",
    image_url: "",
    duration: "",
    difficulty: "",
    type: "",
    google_map_link: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch activities
        const { data: activitiesData, error: activitiesError } = await supabase
          .from("activities")
          .select("*")
          .order("name")

        if (activitiesError) throw activitiesError
        setActivities(activitiesData || [])

        // Fetch cities
        const { data: citiesData, error: citiesError } = await supabase
          .from("cities")
          .select("id, name, slug, region")
          .order("name")

        if (citiesError) throw citiesError
        setCities(citiesData || [])
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // If city is selected, update city_name and region
    if (name === "city_slug") {
      const selectedCity = cities.find((city) => city.slug === value)
      if (selectedCity) {
        setFormData((prev) => ({
          ...prev,
          city_name: selectedCity.name,
          region: selectedCity.region,
        }))
      }
    }
  }

  const resetForm = () => {
    setFormData({
      id: uuidv4(),
      name: "",
      description: "",
      location: "",
      image_url: "",
      duration: "",
      difficulty: "",
      type: "",
      google_map_link: "",
    })
    setIsEditing(false)
  }

  const handleEdit = (activity: Activity) => {
    setFormData(activity)
    setIsEditing(true)
    setDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!activityToDelete) return

    try {
      const { error } = await supabase.from("activities").delete().eq("id", activityToDelete)

      if (error) throw error

      setActivities((prev) => prev.filter((activity) => activity.id !== activityToDelete))
      toast({
        title: "Success",
        description: "Activity deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting activity:", error)
      toast({
        title: "Error",
        description: "Failed to delete activity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setActivityToDelete(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to perform this action.",
        variant: "destructive",
      })
      return
    }

    if (!formData.name || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Name and description are required.",
        variant: "destructive",
      })
      return
    }

    try {
      setFormSubmitting(true)

      const activityData = {
        ...formData,
        added_by: user.id,
      }

      if (isEditing) {
        // Update existing activity
        const { error } = await supabase.from("activities").update(activityData).eq("id", formData.id)

        if (error) throw error

        setActivities((prev) =>
          prev.map((activity) => (activity.id === formData.id ? { ...activity, ...activityData } : activity)),
        )

        toast({
          title: "Success",
          description: "Activity updated successfully",
        })
      } else {
        // Create new activity
        const { error } = await supabase.from("activities").insert(activityData)

        if (error) throw error

        setActivities((prev) => [...prev, activityData as Activity])

        toast({
          title: "Success",
          description: "Activity created successfully",
        })
      }

      resetForm()
      setDialogOpen(false)
    } catch (error) {
      console.error("Error saving activity:", error)
      toast({
        title: "Error",
        description: "Failed to save activity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setFormSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You must be logged in to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Activities</h1>
          <p className="text-gray-500">Add, edit, and delete activities</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
                setIsEditing(false)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Activity" : "Add New Activity"}</DialogTitle>
              <DialogDescription>
                {isEditing ? "Update the details of this activity." : "Fill in the details to create a new activity."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" name="name" value={formData.name || ""} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city_slug">City</Label>
                    <Select
                      value={formData.city_slug || ""}
                      onValueChange={(value) => handleSelectChange("city_slug", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.slug} value={city.slug}>
                            {city.name} ({city.region})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={formData.location || ""} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type || ""} onValueChange={(value) => handleSelectChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Outdoor">Outdoor</SelectItem>
                        <SelectItem value="Cultural">Cultural</SelectItem>
                        <SelectItem value="Adventure">Adventure</SelectItem>
                        <SelectItem value="Water">Water</SelectItem>
                        <SelectItem value="Mountain">Mountain</SelectItem>
                        <SelectItem value="Desert">Desert</SelectItem>
                        <SelectItem value="Historical">Historical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      name="duration"
                      value={formData.duration || ""}
                      onChange={handleInputChange}
                      placeholder="e.g. 2 hours, Half day"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={formData.difficulty || ""}
                      onValueChange={(value) => handleSelectChange("difficulty", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Challenging">Challenging</SelectItem>
                        <SelectItem value="Difficult">Difficult</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      name="image_url"
                      value={formData.image_url || ""}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="google_map_link">Google Map Link</Label>
                    <Input
                      id="google_map_link"
                      name="google_map_link"
                      value={formData.google_map_link || ""}
                      onChange={handleInputChange}
                      placeholder="https://www.google.com/maps/embed?..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    rows={5}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={formSubmitting}>
                  {formSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : isEditing ? (
                    "Update Activity"
                  ) : (
                    "Add Activity"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activities</CardTitle>
          <CardDescription>Manage all activities across Tunisia</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">No activities found</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Activity
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.name}</TableCell>
                    <TableCell>
                      {activity.city_name || activity.location || "Unknown"}
                      {activity.region && ` (${activity.region})`}
                    </TableCell>
                    <TableCell>{activity.type || "—"}</TableCell>
                    <TableCell>{activity.difficulty || "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(activity)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog
                          open={deleteDialogOpen && activityToDelete === activity.id}
                          onOpenChange={(open) => {
                            setDeleteDialogOpen(open)
                            if (!open) setActivityToDelete(null)
                          }}
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => setActivityToDelete(activity.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the activity "{activity.name}". This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-700">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
