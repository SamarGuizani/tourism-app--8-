import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Check if the chebba_attractions table exists
    const { data: attractionsTableExists } = await supabase.rpc("table_exists", { table_name: "chebba_attractions" })

    if (!attractionsTableExists) {
      // Create the attractions table
      await supabase.rpc("execute_sql", {
        sql_query: `
          CREATE TABLE IF NOT EXISTS chebba_attractions (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            type TEXT,
            ranking INTEGER,
            photos TEXT[],
            google_map_link TEXT,
            videos JSONB[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )
        `,
      })
    }

    // Check if the chebba_restaurants table exists
    const { data: restaurantsTableExists } = await supabase.rpc("table_exists", { table_name: "chebba_restaurants" })

    if (!restaurantsTableExists) {
      // Create the restaurants table
      await supabase.rpc("execute_sql", {
        sql_query: `
          CREATE TABLE IF NOT EXISTS chebba_restaurants (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            cuisine TEXT,
            price_range TEXT,
            ranking INTEGER,
            photos TEXT[],
            google_map_link TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )
        `,
      })
    }

    // Check if the chebba_activities table exists
    const { data: activitiesTableExists } = await supabase.rpc("table_exists", { table_name: "chebba_activities" })

    if (!activitiesTableExists) {
      // Create the activities table
      await supabase.rpc("execute_sql", {
        sql_query: `
          CREATE TABLE IF NOT EXISTS chebba_activities (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            type TEXT,
            duration TEXT,
            difficulty TEXT,
            photos TEXT[],
            contact JSONB,
            google_map_link TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )
        `,
      })
    }

    // Insert attractions data
    const attractions = [
      {
        id: "chebba-beach",
        name: "Chebba Beach",
        ranking: 1,
        type: "Beach",
        description:
          "A stunning stretch of golden sand with crystal-clear Mediterranean waters, perfect for swimming and sunbathing.",
        photos: ["/chebba-beach-sunset.png"],
        google_map_link: "https://goo.gl/maps/example",
      },
      {
        id: "old-port",
        name: "Old Port",
        ranking: 2,
        type: "Historical Site",
        description:
          "Traditional fishing port showcasing local maritime culture and offering fresh seafood restaurants.",
        photos: ["/chebba-fishing-boats.png"],
        google_map_link: "https://goo.gl/maps/example",
      },
      {
        id: "coastal-promenade",
        name: "Coastal Promenade",
        ranking: 3,
        type: "Recreation",
        description: "A scenic walkway along the Mediterranean coast, perfect for evening strolls and sunset views.",
        photos: ["/coastal-walkway-evening.png"],
        google_map_link: "https://goo.gl/maps/example",
      },
      {
        id: "douira-chebba",
        name: "Douira Chebba",
        ranking: 4,
        type: "Historical & Cultural",
        description:
          "Douira, located in the Chebba region of Tunisia, is a captivating destination that seamlessly blends natural beauty with cultural richness. Renowned for its pristine beaches, lush forests, and serene landscapes, it offers visitors a tranquil escape from urban life. The area is known for its historical significance, offering authentic local culture and beautiful coastal views.",
        photos: [
          "/douira-chebba-coastal-view.png",
          "https://tse4.mm.bing.net/th?id=OIP.aAqJQ56-A83Y-ifu8tTELwHaE7&pid=Api",
          "https://tse1.mm.bing.net/th?id=OIP.ncFfM30V8ZkVLpdp1eMN3AHaEK&pid=Api",
          "https://tse1.mm.bing.net/th?id=OIP.ovPOt-Ljl6MdnrU5QL9pXAHaFj&pid=Api",
          "https://tse1.mm.bing.net/th?id=OIP.zyN3JuSfD08UmkfxjYp2CAHaHa&pid=Api",
          "https://drive.google.com/uc?export=view&id=14QpXd6GXNEA1KVbVgRsHPN85qn6Cj7Gx",
          "https://drive.google.com/uc?export=view&id=1W4q3u8VwAQwhurnKK1jZp0IxuN8tCYkj",
          "https://drive.google.com/uc?export=view&id=1i-Xz1jX8NLwmicmppxRFkjjb3dpYztZV",
        ],
        google_map_link: "https://www.google.com/maps/search/?api=1&query=Douira+Chebba",
        videos: [
          {
            name: "Douira Chebba Tour",
            url: "https://drive.google.com/file/d/1mz_vjsipiUq9udP-ofyQesWCyBNK31Cz/view",
            orientation: "portrait",
          },
        ],
      },
      {
        id: "borj-khadija",
        name: "Borj Khadija",
        ranking: 5,
        type: "historical monument",
        description:
          "A historical fortress built during the Ottoman era. It played a significant role in protecting the city from invasions.",
        photos: ["/borj-khadija-chebba-coastal-view.png"],
        google_map_link: "https://www.google.com/maps/search/?api=1&query=Borj+Khadija+Chebba",
      },
      {
        id: "el-sir-beach",
        name: "El Sir Beach",
        ranking: 6,
        type: "beach",
        description:
          "El Sir Beach is a pristine stretch of coastline known for its soft sands and clear waters, ideal for swimming and relaxation.",
        photos: ["/placeholder.svg?height=400&width=600&query=El Sir Beach Chebba"],
        google_map_link: "https://www.google.com/maps/search/?api=1&query=El+Sir+Beach+Chebba",
      },
      {
        id: "sidi-abdallah-beach",
        name: "Sidi Abdallah Beach",
        ranking: 7,
        type: "beach",
        description:
          "A quiet and scenic beach named after the nearby Sidi Abdallah shrine, perfect for a peaceful retreat.",
        photos: ["/placeholder.svg?height=400&width=600&query=Sidi Abdallah Beach Chebba"],
        google_map_link: "https://www.google.com/maps/search/?api=1&query=Sidi+Abdallah+Beach+Chebba",
      },
      {
        id: "sidi-abdallah-maqam",
        name: "Sidi Abdallah Maqam",
        ranking: 8,
        type: "religious site",
        description: "A revered shrine dedicated to Sidi Abdallah, attracting visitors for spiritual reflection.",
        photos: ["/placeholder.svg?height=400&width=600&query=Sidi Abdallah Maqam Chebba"],
        google_map_link: "https://www.google.com/maps/search/?api=1&query=Sidi+Abdallah+Maqam+Chebba",
      },
      {
        id: "museum-of-chebba",
        name: "Museum of Chebba",
        ranking: 9,
        type: "museum",
        description:
          "A cultural institution showcasing the rich history and heritage of Chebba through artifacts and exhibits.",
        photos: ["/placeholder.svg?height=400&width=600&query=Museum of Chebba"],
        google_map_link: "https://www.google.com/maps/search/?api=1&query=Museum+of+Chebba",
      },
      {
        id: "jbal-gaboudia",
        name: "Jbal Gaboudia",
        ranking: 10,
        type: "natural site",
        description:
          "A series of small, untouched islands off the coast of Chebba, featuring crystal-clear waters and diverse marine life.",
        photos: ["/placeholder.svg?height=400&width=600&query=Jbal Gaboudia Chebba"],
        google_map_link: "https://www.google.com/maps/search/?api=1&query=Jbal+Gaboudia+Chebba",
      },
    ]

    // Insert restaurants data
    const restaurants = [
      {
        id: "mamma-lisa-cafe-resto",
        name: "Mamma Lisa Café-Resto",
        ranking: 1,
        cuisine: "Cafe, Restaurant",
        photos: ["/placeholder.svg?height=400&width=600&query=Mamma Lisa Cafe Resto Chebba"],
        google_map_link: "https://www.google.com/maps/search/?api=1&query=Mamma+Lisa+Café-Resto+Chebba",
      },
      {
        id: "la-cantine-royale",
        name: "La Cantine Royale",
        ranking: 2,
        cuisine: "Restaurant",
        photos: ["/placeholder.svg?height=400&width=600&query=La Cantine Royale Chebba"],
        google_map_link: "https://www.google.com/maps/search/?api=1&query=La+Cantine+Royale+Chebba",
      },
      {
        id: "pizzeria-khadija",
        name: "Pizzeria Khadija",
        ranking: 3,
        cuisine: "Pizza",
        photos: ["/placeholder.svg?height=400&width=600&query=Pizzeria Khadija Chebba"],
        google_map_link: "https://www.google.com/maps/search/?api=1&query=Pizzeria+Khadija+Chebba",
      },
      {
        id: "restaurant-la-barque",
        name: "Restaurant La Barque",
        ranking: 4,
        cuisine: "Fast Food",
        photos: ["/placeholder.svg?height=400&width=600&query=Restaurant La Barque Chebba"],
        google_map_link: "https://www.google.com/maps/search/?api=1&query=Restaurant+La+Barque+Chebba",
      },
      {
        id: "my-story-coffee-resto",
        name: "MY STORY Coffee Resto",
        ranking: 5,
        cuisine: "Cafe, Restaurant",
        photos: ["/placeholder.svg?height=400&width=600&query=MY STORY Coffee Resto Chebba"],
        google_map_link: "https://www.google.com/maps/search/?api=1&query=MY+STORY+Coffee+Resto+Chebba",
      },
      {
        id: "del-capo",
        name: "DEL CAPO",
        ranking: 6,
        cuisine: "Pizza",
        photos: ["/placeholder.svg?height=400&width=600&query=DEL CAPO Chebba"],
        google_map_link: "https://www.google.com/maps/search/?api=1&query=DEL+CAPO+Chebba",
      },
    ]

    // Insert activities data
    const activities = [
      {
        id: "blue-wave-chebba",
        name: "Blue Wave Chebba",
        type: "water sports",
        description: "Offers paddle and kayak adventures along Chebba's hidden shores.",
        contact: {
          phone: "+216 54 888 229",
          instagram: "@bluewavechebba",
        },
        photos: ["/placeholder.svg?height=400&width=600&query=Blue Wave Chebba water sports"],
        google_map_link: "https://www.google.com/maps/search/?api=1&query=Blue+Wave+Chebba",
      },
      {
        id: "lets-roll-chebba",
        name: "Let's Roll Chebba",
        type: "sports and fun",
        description: "Provides electric scooter rentals, bike adventures, and other sports activities.",
        contact: {
          phone: "+216 28553562",
          instagram: "@letsrollchebba",
        },
        photos: ["/placeholder.svg?height=400&width=600&query=Let's Roll Chebba activities"],
        google_map_link: "https://www.google.com/maps/search/?api=1&query=Let's+Roll+Chebba",
      },
    ]

    // Insert data into tables
    const { error: attractionsError } = await supabase.from("chebba_attractions").upsert(attractions)
    const { error: restaurantsError } = await supabase.from("chebba_restaurants").upsert(restaurants)
    const { error: activitiesError } = await supabase.from("chebba_activities").upsert(activities)

    // Check for errors
    if (attractionsError) {
      console.error("Error inserting attractions:", attractionsError)
    }

    if (restaurantsError) {
      console.error("Error inserting restaurants:", restaurantsError)
    }

    if (activitiesError) {
      console.error("Error inserting activities:", activitiesError)
    }

    // Make sure Chebba is in the cities table
    const { data: chebbaExists } = await supabase.from("cities").select("slug").eq("slug", "chebba").single()

    if (!chebbaExists) {
      await supabase.from("cities").insert({
        name: "Chebba",
        slug: "chebba",
        region: "Central Tunisia",
        description:
          "Chebba is a coastal town in Tunisia known for its beautiful beaches, fishing traditions, and relaxed atmosphere.",
      })
    }

    return NextResponse.json({
      success: true,
      message: "Chebba data inserted successfully",
      errors: {
        attractions: attractionsError ? attractionsError.message : null,
        restaurants: restaurantsError ? restaurantsError.message : null,
        activities: activitiesError ? activitiesError.message : null,
      },
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
