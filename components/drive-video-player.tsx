"use client"

import { getDriveVideoUrl } from "@/lib/drive-utils"

interface DriveVideoPlayerProps {
  url: string
  title: string
  className?: string
}

export default function DriveVideoPlayer({ url, title, className = "" }: DriveVideoPlayerProps) {
  const videoUrl = getDriveVideoUrl(url)

  if (!videoUrl) {
    return <div className="bg-gray-200 p-4 text-center text-gray-500 rounded-lg">Invalid video URL</div>
  }

  return (
    <div className={`aspect-video ${className}`}>
      <iframe
        src={videoUrl}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded-lg"
      ></iframe>
    </div>
  )
}
