import { supabase } from "@/lib/supabase"
import { centralTunisiaCities, southTunisiaCities } from "@/lib/region-data"

// Update the createSafeImageUrl function to better handle Supabase URLs
export function createSafeImageUrl(imageUrl: string | undefined, fallbackText: string): string {
  if (!imageUrl || imageUrl.trim() === "") {
    return `/placeholder.svg?height=800&width=1200&query=${encodeURIComponent(fallbackText)}`
  }

  // If it's a Blob URL or any other valid URL, use it directly
  if (imageUrl.startsWith("http")) {
    return imageUrl
  }

  // Otherwise, assume it's a local path
  return imageUrl
}

// Function to get all cities
export async function getAllCities() {
  try {
    const { data, error } = await supabase.from("city").select("*").order("name")

    if (error) {
      console.error("Error fetching cities:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching cities:", error)
    return []
  }
}

// Function to normalize slug for database queries
function normalizeSlug(slug: string): string {
  // Handle both encoded and decoded slugs
  let normalizedSlug = slug
  if (slug.includes("%20")) {
    normalizedSlug = decodeURIComponent(slug)
  }

  // Replace spaces and hyphens with underscores for database table names
  return normalizedSlug.replace(/ /g, "_").replace(/-/g, "_").toLowerCase()
}

// Function to get city by slug
export async function getCityBySlug(slug: string) {
  try {
    // Handle both encoded and decoded slugs
    let citySlug = slug
    if (slug.includes("%20")) {
      citySlug = decodeURIComponent(slug)
    }

    // Try to fetch the city data directly from Supabase
    // Use .limit(1) to ensure we only get one result even if multiple matches exist
    const { data, error } = await supabase.from("city").select("*").eq("slug", citySlug).limit(1).maybeSingle()

    if (error || !data) {
      console.error("Error fetching city by slug:", error)
      console.log("Trying alternative slug format...")

      // Try with the other format (encoded or decoded)
      const alternativeSlug = slug.includes("%20") ? decodeURIComponent(slug) : encodeURIComponent(slug)
      const { data: altData, error: altError } = await supabase
        .from("city")
        .select("*")
        .eq("slug", alternativeSlug)
        .limit(1)
        .maybeSingle()

      if (altError || !altData) {
        console.error("Error fetching city with alternative slug:", altError)

        // Fallback to creating a default city object
        let region = "North Tunisia"
        if (centralTunisiaCities.includes(slug)) {
          region = "Central Tunisia"
        } else if (southTunisiaCities.includes(slug)) {
          region = "South Tunisia"
        }

        // Create a city name from the slug
        const cityName = slug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")

        return {
          id: slug,
          name: cityName,
          slug,
          title: `${cityName} - Explore Tunisia`,
          description: `Explore the beautiful area of ${cityName}.`,
          heroImage: `/placeholder.svg?height=800&width=1200&query=${encodeURIComponent(cityName)}`,
          hero_image_link: `/placeholder.svg?height=800&width=1200&query=${encodeURIComponent(cityName)}`,
          header_image_link: `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(cityName)}`,
          image: `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(cityName)}`,
          images: [],
          region,
          getting_there: "Information about getting to this destination will be available soon.",
          best_time_to_visit: "This destination can be visited year-round.",
          category: "Cities",
          coordinates: {
            latitude: 36.8,
            longitude: 10.18,
          },
        }
      }

      return {
        ...altData,
        heroImage: altData.hero_image_link, // Add this for compatibility with existing code
        image: altData.header_image_link, // Add this for compatibility with existing code
      }
    }

    return {
      ...data,
      heroImage: data.hero_image_link, // Add this for compatibility with existing code
      image: data.header_image_link, // Add this for compatibility with existing code
    }
  } catch (error) {
    console.error(`Error getting city by slug ${slug}:`, error)
    return null
  }
}

// Update the loadAllCityData function to properly handle image URLs and fetch all related data
export async function loadAllCityData(slug: string) {
  try {
    // Get the city data
    const city = await getCityBySlug(slug)
    if (!city) {
      throw new Error(`City not found: ${slug}`)
    }

    // Normalize the slug for database queries
    const normalizedSlug = normalizeSlug(city.slug || slug)

    // Fetch data from city-specific tables using the correct naming pattern
    // Based on the database structure, the pattern is [content_type]_[city_name]
    const [attractionsData, restaurantsData, activitiesData] = await Promise.all([
      fetchFromTable(`attractions_${normalizedSlug}`),
      fetchFromTable(`restaurants_${normalizedSlug}`),
      fetchFromTable(`activities_${normalizedSlug}`),
    ])

    // Add city_slug to each item for proper linking
    const attractions = attractionsData.map((item) => ({ ...item, city_slug: city.slug }))
    const restaurants = restaurantsData.map((item) => ({ ...item, city_slug: city.slug }))
    const activities = activitiesData.map((item) => ({ ...item, city_slug: city.slug }))

    return {
      ...city,
      attractions,
      restaurants,
      activities,
    }
  } catch (error) {
    console.error(`Error loading data for city ${slug}:`, error)
    return null
  }
}

// Function to fetch data from a specific table
async function fetchFromTable(tableName: string) {
  try {
    const { data, error } = await supabase.from(tableName).select("*")

    if (error) {
      console.error(`Error fetching from ${tableName}:`, error)
      return []
    }

    return data || []
  } catch (error) {
    console.error(`Error fetching from ${tableName}:`, error)
    return []
  }
}
