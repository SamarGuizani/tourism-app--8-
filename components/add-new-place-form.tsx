"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { v4 as uuidv4 } from "uuid"
import { CardFooter } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useMutation } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"

interface CityFormData {
  name: string
  slug: string
  region: string
  description: string
  image_url: string
  hero_image: FileList
}

interface AddCityContentFormProps {
  citySlug?: string
  cityName?: string
  cityRegion?: string
}

export default function AddNewPlaceForm({
  citySlug = "tunis",
  cityName = "Tunis",
  cityRegion = "North Tunisia",
}: AddCityContentFormProps = {}) {
  const { user } = useAuth()
  const router = useRouter()
  const [placeName, setPlaceName] = useState("")
  const [placeType, setPlaceType] = useState("city")
  const [region, setRegion] = useState("North Tunisia")
  const [governorate, setGovernorate] = useState("")
  const [description, setDescription] = useState("")
  const [slug, setSlug] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("add")
  const [cities, setCities] = useState<Array<{ name: string; slug: string }>>([])
  const [selectedCity, setSelectedCity] = useState("")
  const [userAddedItems, setUserAddedItems] = useState<Array<any>>([])
  const [isLoadingItems, setIsLoadingItems] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null)
  const [deleteItemType, setDeleteItemType] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const { toast: useToastHook } = useToast()
  const [heroImage, setHeroImage] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const {
    register,
    handleSubmit: handleReactHookFormSubmit,
    reset,
    formState: { errors },
  } = useForm<CityFormData>()

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-blob", {
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
        setUploadError("You must be logged in to upload images.")
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
        setSaveError("Failed to save image details to database.")
      } else {
        useToastHook({
          title: "Success",
          description: "Image uploaded successfully!",
        })
      }
      setTitle("")
      setDescription("")
      setImage(null)
    },
    onError: () => {
      setUploadError("Failed to upload image.")
    },
  })

  useEffect(() => {
    if (uploadError) {
      useToastHook({
        title: "Error",
        description: uploadError,
        variant: "destructive",
      })
      setUploadError(null)
    }
  }, [uploadError, useToastHook])

  useEffect(() => {
    if (saveError) {
      useToastHook({
        title: "Error",
        description: saveError,
        variant: "destructive",
      })
      setSaveError(null)
    }
  }, [saveError, useToastHook])

  // List of governorates by region
  const governoratesByRegion = {
    "North Tunisia": [
      "Ariana",
      "Béja",
      "Ben Arous",
      "Bizerte",
      "Jendouba",
      "La Manouba",
      "Le Kef",
      "Nabeul",
      "Siliana",
      "Tunis",
      "Zaghouan",
    ],
    "Central Tunisia": ["Kairouan", "Kasserine", "Mahdia", "Monastir", "Sfax", "Sidi Bouzid", "Sousse"],
    "South Tunisia": ["Gabès", "Gafsa", "Kébili", "Médenine", "Tataouine", "Tozeur"],
  }

  // Generate slug from name
  const handleNameChange = (name: string) => {
    setPlaceName(name)
    setSlug(
      name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    )
  }

  // Fetch cities when component mounts
  useEffect(() => {
    const fetchCities = async () => {
      try {
        // Use the correct table name "city" instead of "cities"
        const { data, error } = await supabase.from("city").select("name, slug").order("name", { ascending: true })

        if (error) throw error
        if (data) setCities(data)
      } catch (error) {
        console.error("Error fetching cities:", error)
      }
    }

    fetchCities()
  }, [])

  // Update governorate options when region changes
  useEffect(() => {
    if (region && governoratesByRegion[region]?.length > 0) {
      setGovernorate(governoratesByRegion[region][0])
    } else {
      setGovernorate("")
    }
  }, [region])

  // Fetch user's added items
  useEffect(() => {
    if (user && activeTab === "manage") {
      fetchUserItems()
    }
  }, [user, activeTab])

  const fetchUserItems = async () => {
    if (!user) return

    setIsLoadingItems(true)
    setUserAddedItems([])

    try {
      // Fetch attractions added by user
      const { data: attractions, error: attractionsError } = await supabase
        .from("attractions")
        .select("*")
        .eq("added_by", user.id)

      if (attractionsError) throw attractionsError

      // Fetch restaurants added by user
      const { data: restaurants, error: restaurantsError } = await supabase
        .from("restaurants")
        .select("*")
        .eq("added_by", user.id)

      if (restaurantsError) throw restaurantsError

      // Fetch activities added by user
      const { data: activities, error: activitiesError } = await supabase
        .from("activities")
        .select("*")
        .eq("added_by", user.id)

      if (activitiesError) throw activitiesError

      // Fetch cities added by user - use the correct table name "city" instead of "cities"
      const { data: userCities, error: citiesError } = await supabase.from("city").select("*").eq("added_by", user.id)

      if (citiesError) throw citiesError

      // Combine all items with type information
      const allItems = [
        ...(attractions || []).map((item) => ({ ...item, type: "attraction" })),
        ...(restaurants || []).map((item) => ({ ...item, type: "restaurant" })),
        ...(activities || []).map((item) => ({ ...item, type: "activity" })),
        ...(userCities || []).map((item) => ({ ...item, type: "city" })),
      ]

      setUserAddedItems(allItems)
    } catch (error) {
      console.error("Error fetching user items:", error)
      setError("Failed to load your added items")
    } finally {
      setIsLoadingItems(false)
    }
  }

  const handleDeleteItem = async (id: string, type: string) => {
    setDeleteItemId(id)
    setDeleteItemType(type)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!deleteItemId || !deleteItemType) return

    setIsDeleting(true)
    setError(null)

    try {
      let tableName = ""

      switch (deleteItemType) {
        case "city":
          tableName = "city" // Use the correct table name "city" instead of "cities"
          break
        case "attraction":
          tableName = "attractions"
          break
        case "restaurant":
          tableName = "restaurants"
          break
        case "activity":
          tableName = "activities"
          break
        default:
          throw new Error("Invalid item type")
      }

      const { error } = await supabase.from(tableName).delete().eq("id", deleteItemId)

      if (error) throw error

      // Refresh the list
      fetchUserItems()
      setSuccess(`Successfully deleted the ${deleteItemType}`)
    } catch (error) {
      console.error(`Error deleting ${deleteItemType}:`, error)
      setError(`Failed to delete ${deleteItemType}`)
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
      setDeleteItemId(null)
      setDeleteItemType(null)
    }
  }

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setHeroImage(file)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
    }
  }

  // Fix the handleCitySubmission function to properly handle bucket creation
  const handleCitySubmission = async (file: File): Promise<string> => {
    try {
      const bucketName = "place-images"

      // First try to upload directly - if bucket exists this will work
      try {
        const fileName = `cities/${uuidv4()}-${file.name}`
        const { data, error } = await supabase.storage.from(bucketName).upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
          onUploadProgress: (progress) => {
            setUploadProgress(Math.round((progress.loaded / progress.total) * 100))
          },
        })

        if (!error) {
          // Get public URL
          const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(fileName)
          return urlData.publicUrl
        }
      } catch (uploadError) {
        console.log("Initial upload attempt failed, checking if bucket exists:", uploadError)
      }

      // If we're here, either the bucket doesn't exist or there was another issue
      // Try to create the bucket first
      try {
        const { error: createBucketError } = await supabase.storage.createBucket(bucketName, {
          public: true,
        })

        if (createBucketError) {
          console.error("Error creating bucket:", createBucketError)
        } else {
          console.log("Bucket created successfully")
        }
      } catch (bucketError) {
        console.error("Error in bucket creation:", bucketError)
      }

      // Now try the upload again
      const fileName = `cities/${uuidv4()}-${file.name}`
      const { data, error } = await supabase.storage.from(bucketName).upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
        onUploadProgress: (progress) => {
          setUploadProgress(Math.round((progress.loaded / progress.total) * 100))
        },
      })

      if (error) {
        console.error("Error uploading file after bucket creation attempt:", error)

        // Fallback to using the Blob API route
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload-blob", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Error uploading via API route: ${response.statusText}`)
        }

        const result = await response.json()
        return result.url
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(fileName)
      return urlData.publicUrl
    } catch (error: any) {
      console.error("Error in handleCitySubmission:", error)
      throw new Error(`Error uploading hero image: ${error.message}`)
    }
  }

  const onSubmit = async (data: CityFormData) => {
    try {
      setIsSubmitting(true)
      setUploadProgress(0)

      let heroImageUrl = data.image_url

      // Upload hero image if provided
      if (data.hero_image && data.hero_image.length > 0) {
        const file = data.hero_image[0]
        heroImageUrl = await handleCitySubmission(file)
      }

      // Prepare city data
      const cityData = {
        name: data.name,
        slug: data.slug,
        region: data.region,
        description: data.description,
        image_url: heroImageUrl,
      }

      // Insert city data - use the correct table name "city" instead of "cities"
      const { data: insertedData, error } = await supabase.from("city").insert(cityData).select()

      if (error) {
        throw error
      }

      toast.success("City added successfully!")
      reset()
      router.push("/cities")
    } catch (error: any) {
      console.error("Error adding city:", error)
      toast.error(`Failed to add city: ${error.message}`)
    } finally {
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || (!user.is_local && !user.is_guide)) {
      setError("You must be logged in as a local or guide to add new places")
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      if (placeType === "city") {
        // Handle city submission
        await handleCitySubmission2()
      } else {
        // Handle attraction, restaurant, or activity submission
        await handlePlaceItemSubmission()
      }
    } catch (error: any) {
      console.error("Error adding new place:", error)
      setError(`Failed to add new place: ${error.message || "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCitySubmission2 = async () => {
    // First, check if the city already exists
    const { data: existingCity } = await supabase.from("city").select("slug").eq("slug", slug).single()

    if (existingCity) {
      setError(`A city with the slug "${slug}" already exists`)
      return
    }

    let heroImageUrl = null

    if (heroImage) {
      const { data, error: uploadError } = await supabase.storage
        .from("images")
        .upload(`cities/${slug}/${heroImage.name}`, heroImage, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        console.error("Error uploading hero image:", uploadError)
        setError("Failed to upload hero image")
        return
      }

      heroImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${data?.path}`
    }

    // Check if city table has added_by column
    const { data: hasAddedByColumn } = await supabase.rpc("column_exists", {
      table_name: "city",
      column_name: "added_by",
    })

    // Add new city with appropriate columns
    if (hasAddedByColumn) {
      // If added_by column exists, include it
      const { error: cityError } = await supabase.from("city").insert({
        name: placeName,
        slug: slug,
        region: region,
        governorate: governorate,
        description: description,
        added_by: user.id,
        photo_url: heroImageUrl,
      })

      if (cityError) throw cityError
    } else {
      // If added_by column doesn't exist, omit it
      const { error: cityError } = await supabase.from("city").insert({
        name: placeName,
        slug: slug,
        region: region,
        governorate: governorate,
        description: description,
        photo_url: heroImageUrl,
      })

      if (cityError) throw cityError
    }

    // Create tables for the new city
    await createCityTables(slug)

    setSuccess(`Successfully added new city: ${placeName}`)
    resetForm()
  }

  const handlePlaceItemSubmission = async () => {
    if (!selectedCity) {
      setError("Please select a city for this item")
      return
    }

    let itemImageUrl = null

    if (image) {
      const { data, error: uploadError } = await supabase.storage
        .from("images")
        .upload(`${placeType}s/${selectedCity}/${image.name}`, image, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        console.error("Error uploading item image:", uploadError)
        setError("Failed to upload item image")
        return
      }

      itemImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${data?.path}`
    }

    const tableName = `${placeType}s` // attractions, restaurants, activities

    // Add the new place item
    const { error: insertError } = await supabase.from(tableName).insert({
      name: placeName,
      description: description,
      city_slug: selectedCity,
      region: region,
      added_by: user.id,
      image_url: itemImageUrl,
    })

    if (insertError) throw insertError

    // Also add to city-specific table if it exists
    try {
      const citySpecificTable = `${placeType}s_${selectedCity.replace(/-/g, "_")}`

      // Check if the city-specific table exists
      const { data: tableExists } = await supabase.rpc("table_exists", {
        table_name: citySpecificTable,
      })

      if (tableExists) {
        await supabase.from(citySpecificTable).insert({
          name: placeName,
          description: description,
          city_slug: selectedCity,
          region: region,
          added_by: user.id,
          image_url: itemImageUrl,
        })
      }
    } catch (error) {
      console.log("City-specific table may not exist:", error)
      // Continue anyway, as the main table insertion was successful
    }

    setSuccess(`Successfully added new ${placeType}: ${placeName} to ${selectedCity}`)
    resetForm()
  }

  const createCityTables = async (citySlug: string) => {
    try {
      // Format the slug for table names (replace hyphens with underscores)
      const formattedSlug = citySlug.replace(/-/g, "_")

      // Create tables for the new city
      const createTablesQuery = `
     CREATE TABLE IF NOT EXISTS attractions_${formattedSlug} (
       id SERIAL PRIMARY KEY,
       name TEXT NOT NULL,
       description TEXT,
       address TEXT,
       image_url TEXT,
       details TEXT,
       city_slug TEXT,
       added_by TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
     );
     
     CREATE TABLE IF NOT EXISTS restaurants_${formattedSlug} (
       id SERIAL PRIMARY KEY,
       name TEXT NOT NULL,
       description TEXT,
       address TEXT,
       cuisine TEXT,
       price_range TEXT,
       image_url TEXT,
       city_slug TEXT,
       added_by TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
     );
     
     CREATE TABLE IF NOT EXISTS activities_${formattedSlug} (
       id SERIAL PRIMARY KEY,
       name TEXT NOT NULL,
       description TEXT,
       address TEXT,
       type TEXT,
       duration TEXT,
       difficulty TEXT,
       image_url TEXT,
       city_slug TEXT,
       added_by TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
     );
   `

      const { error: tablesError } = await supabase.rpc("execute_sql", { sql_query: createTablesQuery })

      if (tablesError) throw tablesError

      return true
    } catch (error) {
      console.error(`Error creating tables for ${citySlug}:`, error)
      throw error
    }
  }

  const resetForm = () => {
    setPlaceName("")
    setSlug("")
    setDescription("")
    setImage(null)
    setHeroImage(null)
    // Keep the current placeType, region, and governorate selections
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add & Manage Places</CardTitle>
        <CardDescription>Create new places or manage your existing contributions</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">Add New Place</TabsTrigger>
            <TabsTrigger value="manage">Manage My Places</TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="space-y-4 mt-4">
            <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
              <h1 className="text-2xl font-bold mb-6">Add New City</h1>

              <form onSubmit={handleReactHookFormSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">City Name *</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      {...register("name", { required: "City name is required" })}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">City Slug *</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="e.g. tunis, sousse, etc."
                      {...register("slug", { required: "City slug is required" })}
                    />
                    {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Region *</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      {...register("region", { required: "Region is required" })}
                    />
                    {errors.region && <p className="text-red-500 text-sm">{errors.region.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Image URL</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="Leave empty to upload an image file"
                      {...register("image_url")}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Upload Hero Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full p-2 border rounded-md"
                      {...register("hero_image")}
                    />
                    {uploadProgress > 0 && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Upload progress: {uploadProgress}%</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    rows={4}
                    className="w-full p-2 border rounded-md"
                    {...register("description", { required: "Description is required" })}
                  ></textarea>
                  {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {isSubmitting ? "Submitting..." : "Add City"}
                  </button>
                </div>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4 mt-4">
            {isLoadingItems ? (
              <div className="text-center py-8">Loading your places...</div>
            ) : userAddedItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">You haven't added any places yet.</p>
                <Button variant="outline" className="mt-4" onClick={() => setActiveTab("add")}>
                  Add Your First Place
                </Button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-medium">Your Added Places</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userAddedItems.map((item) => (
                      <TableRow key={`${item.type}-${item.id}`}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Badge>
                        </TableCell>
                        <TableCell>
                          {item.type === "city"
                            ? `${item.governorate || "Unknown"}, ${item.region}`
                            : item.city_slug?.replace(/-/g, " ") || "Unknown"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id, item.type)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert variant="success" className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success</AlertTitle>
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this {deleteItemType}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  )
}
