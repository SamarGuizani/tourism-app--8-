import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import SearchResults from "./search-results"

export const dynamic = "force-dynamic"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createServerComponentClient({ cookies })
  const query = searchParams.q as string
  const tab = (searchParams.tab as string) || "all"

  if (!query) {
    redirect("/")
  }

  // Search in attractions (Chebba, Mahdia, and El Haouaria)
  const { data: attractions, error: attractionsError } = await supabase
    .from("attractions_chebba")
    .select("id, title, description")
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(10)

  const { data: mahdiaAttractions, error: mahdiaAttractionsError } = await supabase
    .from("mahdia_attractions")
    .select("id, title, description")
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(10)

  const { data: haouariaAttractions, error: haouariaAttractionsError } = await supabase
    .from("el_haouaria_attractions")
    .select("id, title, description")
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(10)

  // Search in restaurants (Chebba, Mahdia, and El Haouaria)
  const { data: restaurants, error: restaurantsError } = await supabase
    .from("restaurants_chebba")
    .select("id, title, type, description")
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,type.ilike.%${query}%`)
    .limit(10)

  const { data: mahdiaRestaurants, error: mahdiaRestaurantsError } = await supabase
    .from("mahdia_restaurants")
    .select("id, title, type, description")
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,type.ilike.%${query}%`)
    .limit(10)

  const { data: haouariaRestaurants, error: haouariaRestaurantsError } = await supabase
    .from("el_haouaria_restaurants")
    .select("id, title, cuisine as type, description")
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,cuisine.ilike.%${query}%`)
    .limit(10)

  // Search in activities (Chebba, Mahdia, and El Haouaria)
  const { data: activities, error: activitiesError } = await supabase
    .from("activities_chebba")
    .select("id, title, type, description")
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,type.ilike.%${query}%`)
    .limit(10)

  const { data: mahdiaActivities, error: mahdiaActivitiesError } = await supabase
    .from("mahdia_activities")
    .select("id, title, type, description")
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,type.ilike.%${query}%`)
    .limit(10)

  const { data: haouariaActivities, error: haouariaActivitiesError } = await supabase
    .from("el_haouaria_activities")
    .select("id, title, type, description")
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,type.ilike.%${query}%`)
    .limit(10)

  // Search in cities
  const { data: cities, error: citiesError } = await supabase
    .from("cities")
    .select("id, name, region_id, description")
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(10)

  // Search in regions
  const { data: regions, error: regionsError } = await supabase
    .from("regions")
    .select("id, name, description")
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(10)

  // Search in guides
  const { data: guides, error: guidesError } = await supabase
    .from("guides")
    .select("id, name, specialization, bio")
    .or(`name.ilike.%${query}%,specialization.ilike.%${query}%,bio.ilike.%${query}%`)
    .limit(10)

  if (
    attractionsError ||
    restaurantsError ||
    activitiesError ||
    citiesError ||
    regionsError ||
    guidesError ||
    mahdiaAttractionsError ||
    mahdiaRestaurantsError ||
    mahdiaActivitiesError ||
    haouariaAttractionsError ||
    haouariaRestaurantsError ||
    haouariaActivitiesError
  ) {
    console.error("Search errors:", {
      attractionsError,
      restaurantsError,
      activitiesError,
      citiesError,
      regionsError,
      guidesError,
      mahdiaAttractionsError,
      mahdiaRestaurantsError,
      mahdiaActivitiesError,
      haouariaAttractionsError,
      haouariaRestaurantsError,
      haouariaActivitiesError,
    })
  }

  // Process attractions results
  const allAttractions = [
    ...(attractions || []).map((item) => ({
      ...item,
      type: "attraction",
      city: "chebba",
      url: `/attractions/chebba/${item.id}`,
    })),
    ...(mahdiaAttractions || []).map((item) => ({
      ...item,
      type: "attraction",
      city: "mahdia",
      url: `/attractions/mahdia/${item.id}`,
    })),
    ...(haouariaAttractions || []).map((item) => ({
      ...item,
      type: "attraction",
      city: "haouaria",
      url: `/attractions/haouaria/${item.id}`,
    })),
  ]

  // Process restaurants results
  const allRestaurants = [
    ...(restaurants || []).map((item) => ({
      ...item,
      type: "restaurant",
      city: "chebba",
      url: `/restaurants/chebba/${item.id}`,
    })),
    ...(mahdiaRestaurants || []).map((item) => ({
      ...item,
      type: "restaurant",
      city: "mahdia",
      url: `/restaurants/mahdia/${item.id}`,
    })),
    ...(haouariaRestaurants || []).map((item) => ({
      ...item,
      type: "restaurant",
      city: "haouaria",
      url: `/restaurants/haouaria/${item.id}`,
    })),
  ]

  // Process activities results
  const allActivities = [
    ...(activities || []).map((item) => ({
      ...item,
      type: "activity",
      city: "chebba",
      url: `/activities/chebba/${item.id}`,
    })),
    ...(mahdiaActivities || []).map((item) => ({
      ...item,
      type: "activity",
      city: "mahdia",
      url: `/activities/mahdia/${item.id}`,
    })),
    ...(haouariaActivities || []).map((item) => ({
      ...item,
      type: "activity",
      city: "haouaria",
      url: `/activities/haouaria/${item.id}`,
    })),
  ]

  // Process cities results
  const allCities = (cities || []).map((item) => ({
    ...item,
    type: "city",
    url: `/cities-regions/${item.id}`,
  }))

  // Process regions results
  const allRegions = (regions || []).map((item) => ({
    ...item,
    type: "region",
    url: `/cities-regions/region/${item.id}`,
  }))

  // Process guides results
  const allGuides = (guides || []).map((item) => ({
    ...item,
    type: "guide",
    url: `/guides/${item.id}`,
  }))

  // Combine all results
  const allResults = [...allAttractions, ...allRestaurants, ...allActivities, ...allCities, ...allRegions, ...allGuides]

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>
      <SearchResults
        query={query}
        activeTab={tab}
        allResults={allResults}
        attractions={allAttractions}
        restaurants={allRestaurants}
        activities={allActivities}
        cities={allCities}
        regions={allRegions}
        guides={allGuides}
      />
    </div>
  )
}
