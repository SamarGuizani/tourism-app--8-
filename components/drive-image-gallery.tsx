"use client"

import { useState } from "react"
import Image from "next/image"
import { getProxyImageUrl } from "@/lib/drive-utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface DriveImageGalleryProps {
  images: {
    drive_url: string
    title: string
    description?: string
  }[]
  className?: string
}

export default function DriveImageGallery({ images, className = "" }: DriveImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  if (!images || images.length === 0) {
    return <div className="p-4 text-center text-gray-500">No images available</div>
  }

  return (
    <>
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setSelectedImage(index)}
          >
            <Image
              src={getProxyImageUrl(image.drive_url) || "/placeholder.svg"}
              alt={image.title || `Image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
        ))}
      </div>

      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black">
          {selectedImage !== null && (
            <div className="relative">
              <div className="relative h-[80vh]">
                <Image
                  src={getProxyImageUrl(images[selectedImage].drive_url) || "/placeholder.svg"}
                  alt={images[selectedImage].title || `Image ${selectedImage + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-4 text-white">
                <h3 className="text-lg font-semibold">{images[selectedImage].title}</h3>
                {images[selectedImage].description && (
                  <p className="text-sm opacity-90">{images[selectedImage].description}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
