// Coordinates for major Tunisian cities
export const CITY_COORDINATES: Record<string, { latitude: number; longitude: number }> = {
  tunis: { latitude: 36.8065, longitude: 10.1815 },
  sfax: { latitude: 34.7406, longitude: 10.7603 },
  sousse: { latitude: 35.8245, longitude: 10.6346 },
  kairouan: { latitude: 35.6781, longitude: 10.0969 },
  bizerte: { latitude: 37.2746, longitude: 9.8714 },
  gabes: { latitude: 33.8881, longitude: 10.0975 },
  ariana: { latitude: 36.8625, longitude: 10.1956 },
  gafsa: { latitude: 34.4311, longitude: 8.7757 },
  monastir: { latitude: 35.7643, longitude: 10.8113 },
  "ben-arous": { latitude: 36.7533, longitude: 10.2283 },
  kasserine: { latitude: 35.1722, longitude: 8.8364 },
  medenine: { latitude: 33.3547, longitude: 10.5053 },
  nabeul: { latitude: 36.4513, longitude: 10.7357 },
  tataouine: { latitude: 32.9297, longitude: 10.4518 },
  beja: { latitude: 36.7256, longitude: 9.1817 },
  jendouba: { latitude: 36.5011, longitude: 8.7803 },
  "el-kef": { latitude: 36.1675, longitude: 8.7047 },
  mahdia: { latitude: 35.5047, longitude: 11.0622 },
  "sidi-bouzid": { latitude: 35.0381, longitude: 9.4858 },
  tozeur: { latitude: 33.9197, longitude: 8.1335 },
  siliana: { latitude: 36.0844, longitude: 9.3744 },
  kebili: { latitude: 33.7058, longitude: 8.9689 },
  zaghouan: { latitude: 36.4103, longitude: 10.1433 },
  carthage: { latitude: 36.8528, longitude: 10.3253 },
  hammamet: { latitude: 36.4022, longitude: 10.6178 },
  djerba: { latitude: 33.8075, longitude: 10.8451 },
  "sidi-bou-said": { latitude: 36.8698, longitude: 10.3417 },
  chebba: { latitude: 35.2372, longitude: 11.1147 },
  rafraf: { latitude: 37.1908, longitude: 10.1839 },
  haouaria: { latitude: 37.0514, longitude: 11.0106 },
}

/**
 * Get coordinates for a city by its slug
 * @param citySlug The slug of the city
 * @returns Coordinates object or default coordinates for Tunisia
 */
export function getCityCoordinates(citySlug: string) {
  // Default to Tunis coordinates if city not found
  const defaultCoordinates = { latitude: 36.8065, longitude: 10.1815 }

  if (!citySlug) return defaultCoordinates

  // Normalize the slug
  const normalizedSlug = citySlug.toLowerCase().trim()

  // Check if we have coordinates for this city
  if (CITY_COORDINATES[normalizedSlug]) {
    return CITY_COORDINATES[normalizedSlug]
  }

  // Try to find a partial match
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (normalizedSlug.includes(key) || key.includes(normalizedSlug)) {
      return coords
    }
  }

  return defaultCoordinates
}
