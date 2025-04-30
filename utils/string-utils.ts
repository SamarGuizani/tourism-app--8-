/**
 * Converts a string to a URL-friendly slug
 * @param text The text to convert to a slug
 * @returns The slugified text
 */
export function slugify(text: string | null | undefined): string {
  if (!text) return ""

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
}

/**
 * Truncates a string to a specified length and adds a suffix
 * @param text The text to truncate
 * @param length Maximum length before truncation
 * @param suffix The suffix to add to truncated text
 * @returns The truncated text
 */
export function truncate(text: string | null | undefined, length: number, suffix = "..."): string {
  if (!text) return ""
  if (text.length <= length) return text

  return text.substring(0, length).trim() + suffix
}

/**
 * Capitalizes the first letter of each word in a string
 * @param text The text to capitalize
 * @returns The capitalized text
 */
export function capitalize(text: string | null | undefined): string {
  if (!text) return ""

  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
