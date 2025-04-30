"use client"

import { useState, useRef, useEffect } from "react"
import { getProxyImageUrl } from "@/lib/drive-utils"

interface PortraitVideoPlayerProps {
  url: string
  title: string
  className?: string
  autoPlay?: boolean
  muted?: boolean
  controls?: boolean
  loop?: boolean
  thumbnail?: string
}

export default function PortraitVideoPlayer({
  url,
  title,
  className = "",
  autoPlay = false,
  muted = false,
  controls = true,
  loop = false,
  thumbnail,
}: PortraitVideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedData = () => {
      setIsLoading(false)
    }

    const handleError = () => {
      setIsLoading(false)
      setError("Failed to load video")
    }

    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("error", handleError)

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("error", handleError)
    }
  }, [])

  // Process the URL to ensure it works with Google Drive
  const processedUrl = url.includes("drive.google.com") ? url.replace(/\/view(\?.*)?$/, "/preview") : url

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-red-500 text-center p-4">
            <p className="font-semibold">Error loading video</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {url.includes("drive.google.com") ? (
        <div className="aspect-[9/16] w-full">
          <iframe
            src={processedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              setError("Failed to load video")
            }}
          />
        </div>
      ) : (
        <video
          ref={videoRef}
          src={url}
          poster={thumbnail ? getProxyImageUrl(thumbnail) : undefined}
          title={title}
          autoPlay={autoPlay}
          muted={muted}
          controls={controls}
          loop={loop}
          playsInline
          className="w-full aspect-[9/16] object-cover rounded-lg"
        />
      )}
    </div>
  )
}
