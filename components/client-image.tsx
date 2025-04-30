"use client"

import Image from "next/image"
import { useState } from "react"

interface ClientImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
}

export function ClientImage({ src, alt, fill, width, height, className }: ClientImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  // Handle image error on the client side only
  const handleImageError = () => {
    setImgSrc("/placeholder.svg")
  }

  return (
    <Image
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      onError={handleImageError}
    />
  )
}
