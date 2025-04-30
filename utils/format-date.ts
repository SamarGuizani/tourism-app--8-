type DateFormatOptions = Intl.DateTimeFormatOptions

/**
 * Formats a date using Intl.DateTimeFormat
 * @param date The date to format
 * @param options Formatting options
 * @returns Formatted date string or empty string if date is invalid
 */
export function formatDate(
  date: Date | string | number | null | undefined,
  options: DateFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  },
): string {
  if (!date) return ""

  const dateObj = date instanceof Date ? date : new Date(date)

  // Check if date is valid
  if (isNaN(dateObj.getTime())) return ""

  return new Intl.DateTimeFormat("en-US", options).format(dateObj)
}
