/**
 * Converts a Google Drive URL to a direct download URL
 * @param url The Google Drive URL or ID
 * @returns The direct download URL or null if the input is invalid
 */
export function getDriveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null

  // If it's already a direct URL, return it
  if (url.startsWith("http") && !url.includes("drive.google.com")) {
    return url
  }

  // Extract the file ID from various Google Drive URL formats
  let fileId: string | null = null

  if (url.includes("drive.google.com")) {
    // Format: https://drive.google.com/file/d/FILE_ID/view
    const match = url.match(/\/d\/(.+?)\/|id=(.+?)&/)
    if (match) {
      fileId = match[1] || match[2]
    }
  } else if (/^[a-zA-Z0-9_-]{25,}$/.test(url)) {
    // If the URL is just the file ID
    fileId = url
  }

  if (!fileId) return null

  // Return the direct download URL
  return `https://drive.google.com/uc?export=view&id=${fileId}`
}

/**
 * Safely gets an image URL, handling various formats and providing a fallback
 * @param url The image URL or Google Drive URL
 * @param title The title to use for the placeholder image
 * @returns A valid image URL
 */
export function getImageUrl(url: string | null | undefined, title: string): string {
  const driveUrl = getDriveImageUrl(url)
  if (driveUrl) return driveUrl

  // Return a placeholder image if no valid URL is found
  return `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(title)}`
}

/**
 * Gets a proxied image URL to avoid CORS issues
 * This is an alias for getDriveImageUrl for backward compatibility
 * @param url The image URL
 * @returns A proxied image URL or null if the input is invalid
 */
export function getProxyImageUrl(url: string | null | undefined): string | null {
  return getDriveImageUrl(url)
}

/**
 * Converts a Google Drive video URL to an embeddable URL
 * @param url The Google Drive video URL or ID
 * @returns An embeddable video URL or null if the input is invalid
 */
export function getDriveVideoUrl(url: string | null | undefined): string | null {
  if (!url) return null

  // If it's already a direct URL and not from Google Drive, return it
  if (url.startsWith("http") && !url.includes("drive.google.com")) {
    return url
  }

  // Extract the file ID from various Google Drive URL formats
  let fileId: string | null = null

  if (url.includes("drive.google.com")) {
    // Format: https://drive.google.com/file/d/FILE_ID/view
    const match = url.match(/\/d\/(.+?)\/|id=(.+?)&/)
    if (match) {
      fileId = match[1] || match[2]
    }
  } else if (/^[a-zA-Z0-9_-]{25,}$/.test(url)) {
    // If the URL is just the file ID
    fileId = url
  }

  if (!fileId) return null

  // Return the embeddable URL
  return `https://drive.google.com/file/d/${fileId}/preview`
}

/**
 * Gets a video URL that can be used in a video element
 * @param url The video URL
 * @returns A video URL that can be used in a video element
 */
export function getVideoUrl(url: string | null | undefined): string | null {
  return getDriveVideoUrl(url)
}
