/**
 * Generates a Google Maps search link for a location
 * @param locationName The name of the location
 * @param city The city where the location is located
 * @returns A Google Maps search link
 */
export function generateGoogleMapsSearchLink(locationName: string, city: string): string {
  // Format the search query
  const searchQuery = `${locationName}, ${city}, Tunisia`

  // Create a Google Maps search link
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`
}
