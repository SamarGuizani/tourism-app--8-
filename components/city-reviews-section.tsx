"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StarIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Review {
  id: string
  user_id: string
  city_slug: string
  rating: number
  comment: string
  created_at: string
  user_name?: string
  avatar_url?: string
}

export default function CityReviewsSection({ citySlug, cityName }: { citySlug: string; cityName: string }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newReview, setNewReview] = useState("")
  const [newRating, setNewRating] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchReviews() {
      setIsLoading(true)
      setError(null)

      try {
        // First, get all reviews for this city
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("city_reviews")
          .select("*")
          .eq("city_slug", citySlug)
          .order("created_at", { ascending: false })

        if (reviewsError) {
          console.error("Error fetching reviews:", reviewsError)
          setError("Failed to load reviews. Please try again later.")
          return
        }

        if (!reviewsData || reviewsData.length === 0) {
          setReviews([])
          setIsLoading(false)
          return
        }

        // Now fetch user data separately for each review
        const reviewPromises = reviewsData.map(async (review) => {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("name, avatar_url")
            .eq("id", review.user_id)
            .single()

          if (userError) {
            console.warn(`Could not fetch user data for review ${review.id}:`, userError)
            return {
              ...review,
              user_name: "Anonymous",
              avatar_url: null,
            }
          }

          return {
            ...review,
            user_name: userData?.name,
            avatar_url: userData?.avatar_url,
          }
        })

        const reviewsWithUserData = await Promise.all(reviewPromises)
        setReviews(reviewsWithUserData)
      } catch (err) {
        console.error("Error in fetchReviews:", err)
        setError("An unexpected error occurred. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [citySlug])

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "You must be logged in to submit a review.",
        variant: "destructive",
      })
      return
    }

    if (!newReview.trim()) {
      toast({
        title: "Review Required",
        description: "Please enter a review comment.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from("city_reviews")
        .insert({
          user_id: user.id,
          city_slug: citySlug,
          rating: newRating,
          comment: newReview,
        })
        .select()

      if (error) {
        console.error("Error submitting review:", error)
        toast({
          title: "Error",
          description: "Failed to submit your review. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Add the new review to the list
      const newReviewData = {
        ...data[0],
        user_name: user.name || "Anonymous",
        avatar_url: user.avatar_url,
      }

      setReviews([newReviewData, ...reviews])
      setNewReview("")
      setNewRating(5)

      toast({
        title: "Review Submitted",
        description: "Thank you for your review!",
        variant: "default",
      })
    } catch (err) {
      console.error("Error in handleSubmitReview:", err)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Reviews for {cityName}</h2>

      {/* Review Form */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Write a Review</h3>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <p className="mr-2">Rating:</p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setNewRating(star)} className="focus:outline-none">
                    <StarIcon
                      className={`h-6 w-6 ${star <= newRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              placeholder="Share your experience..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="min-h-32"
              disabled={!user}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmitReview} disabled={isSubmitting || !user}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
          {!user && (
            <p className="ml-4 text-sm text-gray-500">
              Please{" "}
              <a href="/login" className="text-primary hover:underline">
                login
              </a>{" "}
              to submit a review
            </p>
          )}
        </CardFooter>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden mr-4">
                    <Image
                      src={review.avatar_url || `/placeholder.svg?height=40&width=40&query=user`}
                      alt={review.user_name || "User"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{review.user_name || "Anonymous"}</h4>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{new Date(review.created_at).toLocaleDateString()}</p>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">No reviews yet for {cityName}</p>
            <p className="text-sm text-gray-500">Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  )
}
