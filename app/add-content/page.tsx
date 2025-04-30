"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddCityContentForm from "@/components/add-city-content-form"
import AddNewPlaceForm from "@/components/add-new-place-form"
import ImageUploadForm from "@/components/image-upload-form"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect } from "react"

export default function AddContentPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("city-content")
  const [queryClient] = useState(() => new QueryClient())

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  // Only locals and guides can add content
  if (!user.is_local && !user.is_guide) {
    router.push("/")
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Add Content</h1>

        <Tabs defaultValue="city-content" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="city-content">City Content</TabsTrigger>
            <TabsTrigger value="new-place">New Place</TabsTrigger>
            {user.is_admin && <TabsTrigger value="image">Image</TabsTrigger>}
            <TabsTrigger value="general">General Content</TabsTrigger>
          </TabsList>

          <TabsContent value="city-content">
            <div className="max-w-3xl mx-auto">
              <AddCityContentForm />
            </div>
          </TabsContent>

          <TabsContent value="new-place">
            <div className="max-w-3xl mx-auto">
              <AddNewPlaceForm />
            </div>
          </TabsContent>

          {user.is_admin && (
            <TabsContent value="image">
              <div className="max-w-3xl mx-auto">
                <ImageUploadForm />
              </div>
            </TabsContent>
          )}

          <TabsContent value="general">
            <div className="max-w-3xl mx-auto">
              {/* General content form will go here */}
              <p className="text-center py-12 bg-gray-50 rounded-lg">General content functionality coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </QueryClientProvider>
  )
}
