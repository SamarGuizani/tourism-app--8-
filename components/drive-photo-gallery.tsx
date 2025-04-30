"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { getProxyImageUrl } from "@/lib/drive-utils"

interface DrivePhotoGalleryProps {
  photos: {
    drive_url: string
    title: string
    description?: string
  }[]
  className?: string
}

export default function DrivePhotoGallery({ photos, className = "" }: DrivePhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)

  if (!photos || photos.length === 0) {
    return <div className="p-4 text-center text-gray-500">No photos available</div>
  }

  const handlePrevious = () => {
    if (selectedPhoto === null) return
    setSelectedPhoto(selectedPhoto === 0 ? photos.length - 1 : selectedPhoto - 1)
  }

  const handleNext = () => {
    if (selectedPhoto === null) return
    setSelectedPhoto(selectedPhoto === photos.length - 1 ? 0 : selectedPhoto + 1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious()
    if (e.key === "ArrowRight") handleNext()
    if (e.key === "Escape") setSelectedPhoto(null)
  }

  // Helper function to get a valid image URL
  const getImageUrl = (photo: { drive_url: string }) => {
    if (!photo || !photo.drive_url) {
      return "/placeholder.svg"
    }

    try {
      // If it's not a Google Drive URL, return it directly
      if (!photo.drive_url.includes("drive.google.com")) {
        return photo.drive_url
      }

      // Otherwise, use the proxy
      return getProxyImageUrl(photo.drive_url) || "/placeholder.svg"
    } catch (error) {
      console.error("Error processing image URL:", error)
      return "/placeholder.svg"
    }
  }

  return (
    <>
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ${className}`}>
        {photos.map((photo, index) => (
          <div
            key={index}
            className="cursor-pointer aspect-square relative rounded-md overflow-hidden group"
            onClick={() => setSelectedPhoto(index)}
          >
            <Image
              src={getImageUrl(photo) || "/placeholder.svg"}
              alt={photo.title || `Photo ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>

      <Dialog open={selectedPhoto !== null} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-5xl w-full p-0 bg-black overflow-hidden" onKeyDown={handleKeyDown} tabIndex={0}>
          {selectedPhoto !== null && (
            <div className="relative h-[80vh]">
              <Image
                src={getImageUrl(photos[selectedPhoto]) || "/placeholder.svg"}
                alt={photos[selectedPhoto].title || `Photo ${selectedPhoto + 1}`}
                fill
                className="object-contain"
              />

              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full"
                onClick={() => setSelectedPhoto(null)}
              >
                <X className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4">
                <h3 className="text-lg font-semibold">{photos[selectedPhoto].title || `Photo ${selectedPhoto + 1}`}</h3>
                {photos[selectedPhoto].description && (
                  <p className="text-gray-300 mt-1">{photos[selectedPhoto].description}</p>
                )}
                <p className="text-gray-400 text-sm mt-2">
                  {selectedPhoto + 1} of {photos.length}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
