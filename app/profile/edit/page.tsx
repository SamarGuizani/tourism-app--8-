"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { MultiSelect } from "@/components/ui/multi-select"
import type { Guide } from "@/types"
import { useToast } from "@/hooks/use-toast"

export default function EditProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [name, setName] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Guide profile fields
  const [guideProfile, setGuideProfile] = useState<Guide | null>(null)
  const [bio, setBio] = useState("")
  const [languages, setLanguages] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [touristPrice, setTouristPrice] = useState(30)
  const [localPrice, setLocalPrice] = useState(10)

  const [availableCities, setAvailableCities] = useState<{ value: string; label: string }[]>([])
  const [availableLanguages] = useState<{ value: string; label: string }[]>([
    { value: "Arabic", label: "Arabic" },
    { value: "English", label: "English" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Italian", label: "Italian" },
    { value: "Spanish", label: "Spanish" },
    { value: "Russian", label: "Russian" },
  ])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user && user.name) {
      setName(user.name)
    }

    // Fetch available cities
    const fetchCities = async () => {
      try {
        // Use the correct table name "city" instead of "cities"
        const { data, error } = await supabase.from("city").select("name, slug").order("name", { ascending: true })

        if (error) throw error

        if (data && data.length > 0) {
          setAvailableCities(
            data.map((city) => ({
              value: city.slug,
              label: city.name,
            })),
          )
        } else {
          // Fallback to hardcoded cities if none found in database
          setAvailableCities([
            { value: "tunis", label: "Tunis" },
            { value: "carthage", label: "Carthage" },
            { value: "sidi-bou-said", label: "Sidi Bou Said" },
            { value: "sousse", label: "Sousse" },
            { value: "kairouan", label: "Kairouan" },
            { value: "djerba", label: "Djerba" },
            { value: "tozeur", label: "Tozeur" },
            { value: "chebba", label: "Chebba" },
          ])
        }
      } catch (error) {
        console.error("Error in fetchCities:", error)
        // Fallback to hardcoded cities
        setAvailableCities([
          { value: "tunis", label: "Tunis" },
          { value: "carthage", label: "Carthage" },
          { value: "sidi-bou-said", label: "Sidi Bou Said" },
          { value: "sousse", label: "Sousse" },
          { value: "kairouan", label: "Kairouan" },
          { value: "djerba", label: "Djerba" },
          { value: "tozeur", label: "Tozeur" },
          { value: "chebba", label: "Chebba" },
        ])
      }
    }

    // Fetch guide profile if user is a guide
    const fetchGuideProfile = async () => {
      if (user.is_guide) {
        const { data } = await supabase.from("guides").select("*").eq("user_id", user.id).single()

        if (data) {
          setGuideProfile(data)
          setBio(data.bio)
          setLanguages(data.languages)
          setLocations(data.locations)
          setTouristPrice(data.tourist_price)
          setLocalPrice(data.local_price)
        }
      }
    }

    fetchCities()
    fetchGuideProfile()
  }, [user, router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setError(null)
    setSuccess(null)

    try {
      // Update user profile
      const { error: updateError } = await supabase.from("users").update({ name }).eq("id", user?.id)

      if (updateError) {
        console.error("Error updating profile:", updateError)
        setError(`Failed to update profile: ${updateError.message}`)
        return
      }

      setSuccess("Profile updated successfully")
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })
    } catch (error: any) {
      console.error("Error updating profile:", error)
      setError(`Failed to update profile: ${error.message}`)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUpdateGuideProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setError(null)
    setSuccess(null)

    try {
      if (!guideProfile) return

      // Update guide profile
      const { error: updateError } = await supabase
        .from("guides")
        .update({
          bio,
          languages,
          locations,
          tourist_price: touristPrice,
          local_price: localPrice,
        })
        .eq("id", guideProfile.id)

      if (updateError) {
        console.error("Error updating guide profile:", updateError)
        setError(`Failed to update guide profile: ${updateError.message}`)
        return
      }

      setSuccess("Guide profile updated successfully")
      toast({
        title: "Success",
        description: "Guide profile updated successfully!",
      })
    } catch (error: any) {
      console.error("Error updating guide profile:", error)
      setError(`Failed to update guide profile: ${error.message}`)
    } finally {
      setIsUpdating(false)
    }
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

      <Tabs defaultValue="profile">
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Basic Information</TabsTrigger>
          {user.is_guide && <TabsTrigger value="guide">Guide Profile</TabsTrigger>}
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`} alt={name} />
                  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{name || "Unknown User"}</h3>
                  <p className="text-sm text-gray-500">Email: {user.email}</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" required />
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}
                {success && <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">{success}</div>}

                <div className="flex justify-end">
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Update Profile"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {user.is_guide && (
          <TabsContent value="guide">
            <Card>
              <CardHeader>
                <CardTitle>Guide Profile</CardTitle>
                <CardDescription>Update your guide information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateGuideProfile} className="space-y-6">
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="mt-1 min-h-32"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="languages">Languages</Label>
                    <MultiSelect
                      options={availableLanguages}
                      selected={languages}
                      onChange={setLanguages}
                      placeholder="Select languages you speak..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="locations">Locations</Label>
                    <MultiSelect
                      options={availableCities}
                      selected={locations}
                      onChange={setLocations}
                      placeholder="Select cities you can guide in..."
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="touristPrice">Tourist Price (DT/hour)</Label>
                      <Input
                        id="touristPrice"
                        type="number"
                        min="30"
                        value={touristPrice}
                        onChange={(e) => setTouristPrice(Number.parseInt(e.target.value) || 30)}
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimum: 30 DT/hour</p>
                    </div>

                    <div>
                      <Label htmlFor="localPrice">Local Price (DT/hour)</Label>
                      <Input
                        id="localPrice"
                        type="number"
                        min="10"
                        value={localPrice}
                        onChange={(e) => setLocalPrice(Number.parseInt(e.target.value) || 10)}
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimum: 10 DT/hour</p>
                    </div>
                  </div>

                  {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}
                  {success && <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">{success}</div>}

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? "Updating..." : "Update Guide Profile"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
