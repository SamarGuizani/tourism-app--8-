"use client"

import { useState } from "react"
import { ClientImage as Image } from "@/components/client-image"
import { getProxyImageUrl } from "@/lib/drive-utils"

interface DirectDriveImageProps {
  url: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
}

export default function DirectDriveImage({
  url,
  alt,
  width,
  height,
  className = "",
  fill = false,
}: DirectDriveImageProps) {
  const [error, setError] = useState(false)
  const imageUrl = getProxyImageUrl(url)

  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`} style={{ width, height }}>
        <span className="text-gray-500 text-sm">Image not available</span>
      </div>
    )
  }

  if (fill) {
    return (
      <Image
        src={imageUrl || "/placeholder.svg"}
        alt={alt}
        fill
        className={`object-cover ${className}`}
        onError={() => setError(true)}
      />
    )
  }

  return (
    <Image
      src={imageUrl || "/placeholder.svg"}
      alt={alt}
      width={width || 400}
      height={height || 300}
      className={className}
      onError={() => setError(true)}
    />
  )
}
