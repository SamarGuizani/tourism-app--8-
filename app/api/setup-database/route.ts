import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Check if we already have data
    const { data: existingCities } = await supabase.from("cities").select("id").limit(1)

    if (existingCities && existingCities.length > 0) {
      return NextResponse.json({ message: "Database already has data" })
    }

    // Create regions
    const regions = [
      {
        name: "Northern Tunisia",
        slug: "northern-tunisia",
        description: "Explore the lush green landscapes, mountains, and coastal cities of Northern Tunisia.",
        country: "Tunisia",
      },
      {
        name: "Central Tunisia",
        slug: "central-tunisia",
        description: "Discover the historical sites, desert oases, and unique architecture of Central Tunisia.",
        country: "Tunisia",
      },
      {
        name: "Southern Tunisia",
        slug: "southern-tunisia",
        description:
          "Experience the Sahara Desert, traditional Berber villages, and stunning landscapes of Southern Tunisia.",
        country: "Tunisia",
      },
    ]

    const { data: regionsData, error: regionsError } = await supabase.from("regions").insert(regions).select()

    if (regionsError) {
      throw regionsError
    }

    // Create cities
    const cities = [
      {
        name: "Tunis",
        slug: "tunis",
        region: "Northern Tunisia",
        description:
          "The capital city of Tunisia, known for its ancient medina, modern business district, and rich cultural heritage.",
        hero_image: "https://drive.google.com/file/d/1XyYZHR7ZyMTBQwS9SgG3Jn6AXlE-5XWB/view",
      },
      {
        name: "Sidi Bou Said",
        slug: "sidi-bou-said",
        region: "Northern Tunisia",
        description:
          "A picturesque blue and white village perched on a cliff overlooking the Mediterranean Sea, known for its artistic atmosphere.",
        hero_image: "https://drive.google.com/file/d/1XyYZHR7ZyMTBQwS9SgG3Jn6AXlE-5XWB/view",
      },
      {
        name: "Carthage",
        slug: "carthage",
        region: "Northern Tunisia",
        description:
          "An ancient city with impressive ruins from the Phoenician and Roman periods, including the Antonine Baths and Carthage Museum.",
        hero_image: "https://drive.google.com/file/d/1XyYZHR7ZyMTBQwS9SgG3Jn6AXlE-5XWB/view",
      },
      {
        name: "Sousse",
        slug: "sousse",
        region: "Central Tunisia",
        description: "A coastal city with beautiful beaches, a historic medina, and the impressive Ribat fortress.",
        hero_image: "https://drive.google.com/file/d/1XyYZHR7ZyMTBQwS9SgG3Jn6AXlE-5XWB/view",
      },
      {
        name: "Kairouan",
        slug: "kairouan",
        region: "Central Tunisia",
        description:
          "One of Islam's holiest cities, featuring the Great Mosque of Kairouan and traditional carpet workshops.",
        hero_image: "https://drive.google.com/file/d/1XyYZHR7ZyMTBQwS9SgG3Jn6AXlE-5XWB/view",
      },
      {
        name: "Tozeur",
        slug: "tozeur",
        region: "Southern Tunisia",
        description:
          "An oasis town known for its date palms, unique architecture, and as a gateway to the Sahara Desert.",
        hero_image: "https://drive.google.com/file/d/1XyYZHR7ZyMTBQwS9SgG3Jn6AXlE-5XWB/view",
      },
    ]

    const { error: citiesError } = await supabase.from("cities").insert(cities)

    if (citiesError) {
      throw citiesError
    }

    // Create restaurants table
    await supabase.query(`
  CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    city_slug TEXT NOT NULL REFERENCES cities(slug),
    address TEXT,
    added_by TEXT NOT NULL,
    image_url TEXT,
    cuisine TEXT,
    price_range TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )
`)

    // Create activities table
    await supabase.query(`
  CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    city_slug TEXT NOT NULL REFERENCES cities(slug),
    address TEXT,
    added_by TEXT NOT NULL,
    image_url TEXT,
    type TEXT,
    duration TEXT,
    difficulty TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )
`)

    // Create sample attractions
    const attractions = [
      {
        name: "Bardo Museum",
        description:
          "One of the most important museums in the Mediterranean, housing one of the world's largest collections of Roman mosaics.",
        city_slug: "tunis",
        address: "Le Bardo, Tunis",
        added_by: "system",
      },
      {
        name: "Medina of Tunis",
        description:
          "A UNESCO World Heritage site with narrow winding streets, traditional markets, and historic monuments.",
        city_slug: "tunis",
        address: "Medina, Tunis",
        added_by: "system",
      },
      {
        name: "Café des Délices",
        description:
          "A famous café with stunning views of the Mediterranean, featured in a popular song by Patrick Bruel.",
        city_slug: "sidi-bou-said",
        address: "Rue Habib Thameur, Sidi Bou Said",
        added_by: "system",
      },
      {
        name: "Antonine Baths",
        description: "The largest Roman baths built on the African continent, offering impressive ruins and sea views.",
        city_slug: "carthage",
        address: "Carthage, Tunisia",
        added_by: "system",
      },
      {
        name: "Ribat of Sousse",
        description: "A fortified Islamic monastery with panoramic views of the city and sea.",
        city_slug: "sousse",
        address: "Medina, Sousse",
        added_by: "system",
      },
      {
        name: "Great Mosque of Kairouan",
        description:
          "One of the oldest and most important Islamic monuments in North Africa, dating back to the 7th century.",
        city_slug: "kairouan",
        address: "Rue de la Kasbah, Kairouan",
        added_by: "system",
      },
    ]

    const { error: attractionsError } = await supabase.from("attractions").insert(attractions)

    if (attractionsError) {
      throw attractionsError
    }

    // Create sample restaurants
    const restaurants = [
      {
        name: "Dar El Jeld",
        description: "Upscale Tunisian cuisine served in a beautifully restored traditional house in the medina.",
        city_slug: "tunis",
        address: "5-10 Rue Dar El Jeld, Tunis",
        added_by: "system",
      },
      {
        name: "Au Bon Vieux Temps",
        description: "Mediterranean restaurant with a terrace offering panoramic views of the Gulf of Tunis.",
        city_slug: "sidi-bou-said",
        address: "Rue Habib Thameur, Sidi Bou Said",
        added_by: "system",
      },
      {
        name: "Restaurant Carthage",
        description: "Seafood restaurant with views of the archaeological site, serving fresh Mediterranean dishes.",
        city_slug: "carthage",
        address: "Avenue Habib Bourguiba, Carthage",
        added_by: "system",
      },
      {
        name: "Dar Zarrouk",
        description: "Traditional Tunisian cuisine in an elegant setting with sea views.",
        city_slug: "sousse",
        address: "Rue de la Kasbah, Sousse",
        added_by: "system",
      },
      {
        name: "Restaurant Sabra",
        description: "Authentic local cuisine featuring traditional dishes from Kairouan.",
        city_slug: "kairouan",
        address: "Avenue de la République, Kairouan",
        added_by: "system",
      },
    ]

    const { error: restaurantsError } = await supabase.from("restaurants").insert(restaurants)

    if (restaurantsError) {
      throw restaurantsError
    }

    // Create sample activities
    const activities = [
      {
        name: "Medina Shopping Tour",
        description:
          "Guided tour through the traditional markets of Tunis, with opportunities to purchase local crafts and souvenirs.",
        city_slug: "tunis",
        address: "Medina, Tunis",
        added_by: "system",
      },
      {
        name: "Coastal Boat Tour",
        description:
          "Scenic boat tour along the coast, offering beautiful views of Sidi Bou Said and the surrounding area.",
        city_slug: "sidi-bou-said",
        address: "Port de Sidi Bou Said",
        added_by: "system",
      },
      {
        name: "Archaeological Guided Tour",
        description:
          "Expert-led tour of the ancient ruins of Carthage, including the Antonine Baths, Amphitheater, and Punic Ports.",
        city_slug: "carthage",
        address: "Carthage Archaeological Park",
        added_by: "system",
      },
      {
        name: "Beach Day at Boujaffar",
        description: "Relax on the golden sands of Boujaffar Beach, with water sports and beachside cafes.",
        city_slug: "sousse",
        address: "Boujaffar Beach, Sousse",
        added_by: "system",
      },
      {
        name: "Carpet Workshop Visit",
        description: "Visit traditional carpet workshops and learn about the ancient art of Tunisian carpet making.",
        city_slug: "kairouan",
        address: "Medina, Kairouan",
        added_by: "system",
      },
    ]

    const { error: activitiesError } = await supabase.from("activities").insert(activities)

    if (activitiesError) {
      throw activitiesError
    }

    // Create guides table
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS guides (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id),
          bio TEXT NOT NULL,
          languages TEXT[] NOT NULL,
          locations TEXT[] NOT NULL,
          tourist_price INTEGER NOT NULL DEFAULT 30,
          local_price INTEGER NOT NULL DEFAULT 10,
          rating FLOAT NOT NULL DEFAULT 5.0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    // Create city_reviews table
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS city_reviews (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id),
          city_slug TEXT NOT NULL,
          rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
          comment TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    // Create media_galleries table
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS media_galleries (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          city_slug TEXT NOT NULL,
          media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
          url TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    // Create city_guides table
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS city_guides (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          guide_id UUID NOT NULL REFERENCES guides(id),
          city_slug TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    // Update restaurants table to add cuisine_type if it doesn't exist
    await supabase.rpc("execute_sql", {
      sql_query: `
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'restaurants' AND column_name = 'cuisine_type'
          ) THEN
            ALTER TABLE restaurants ADD COLUMN cuisine_type TEXT;
          END IF;
        END $$;
      `,
    })

    return NextResponse.json({ message: "Database setup completed successfully" })
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json({ error: "Failed to set up database" }, { status: 500 })
  }
}
