interface VideoGalleryProps {
  videos: {
    name: string
    url: string
    orientation?: string
  }[]
}

export function VideoGallery({ videos }: VideoGalleryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video, index) => {
        // Extract YouTube video ID
        const match = video.url.match(
          /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)([^#&?]*).*)|((?:https?:\/\/)?(?:www\.)?youtu\.be\/([^#&?]*))/,
        )
        const videoId = match ? match[1] || match[3] : null

        if (!videoId) return null

        return (
          <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={video.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        )
      })}
    </div>
  )
}
