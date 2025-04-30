import { supabase } from "@/lib/supabase"

// Helper function to format city slug for database tables
export function formatCitySlugForDb(slug: string): string {
  return slug.replace(/-/g, "_")
}

// North Tunisia cities
export const northTunisiaCities = [
  "tunis-city",
  "medina-of-tunis",
  "carthage",
  "sidi-bou-said",
  "bizerte-city",
  "tabarka",
  "dougga",
  "bulla-regia",
  "hammamet",
  "kelibia",
  "nabeul-city",
  "testour",
  "beja-city",
  "uthina",
  "ben-arous-city",
  "la-marsa",
  "ain-draham",
  "rafraf",
  "haouaria",
]

// Central Tunisia cities
export const centralTunisiaCities = [
  "kairouan-city",
  "sousse-city",
  "monastir-city",
  "el-jem",
  "sfax-city",
  "chebba",
  "mahdia-city",
  "sbeitla",
  "kerkennah-islands",
  "salakta",
  "oued-zitoun",
  "port-el-kantaoui",
]

// South Tunisia cities
export const southTunisiaCities = [
  "djerba",
  "houmt-souk",
  "midoun",
  "aghir",
  "tozeur-city",
  "tamerza",
  "douz",
  "matmata",
  "tataouine-city",
  "ksar-ghilane",
  "gabes-city",
  "medenine-city",
  "zarzis",
  "chebika",
  "ksar-ouled-soltane",
]

// Tunisian governorates (administrative divisions)
export const governorates = [
  // North Tunisia
  {
    id: "tunis",
    name: "Tunis",
    region: "North Tunisia",
    description: "The capital governorate of Tunisia, home to the vibrant city of Tunis and its suburbs.",
    image: "/governorates/tunis.jpg",
  },
  {
    id: "ariana",
    name: "Ariana",
    region: "North Tunisia",
    description: "A governorate in northeastern Tunisia, part of Greater Tunis.",
    image: "/governorates/ariana.jpg",
  },
  {
    id: "ben-arous",
    name: "Ben Arous",
    region: "North Tunisia",
    description: "An industrial hub and residential area south of Tunis.",
    image: "/governorates/ben-arous.jpg",
  },
  {
    id: "bizerte",
    name: "Bizerte",
    region: "North Tunisia",
    description: "The northernmost governorate with beautiful beaches and a strategic port.",
    image: "/governorates/bizerte.jpg",
  },
  {
    id: "nabeul",
    name: "Nabeul",
    region: "North Tunisia",
    description: "Known as the Cap Bon peninsula, famous for its beaches and pottery.",
    image: "/governorates/nabeul.jpg",
  },
  {
    id: "beja",
    name: "Béja",
    region: "North Tunisia",
    description: "An agricultural region known for its wheat fields and ancient ruins.",
    image: "/governorates/beja.jpg",
  },
  {
    id: "jendouba",
    name: "Jendouba",
    region: "North Tunisia",
    description: "A mountainous region with forests, rivers, and the ancient site of Bulla Regia.",
    image: "/governorates/jendouba.jpg",
  },
  {
    id: "kef",
    name: "Le Kef",
    region: "North Tunisia",
    description: "A mountainous region with a rich history and archaeological sites.",
    image: "/governorates/kef.jpg",
  },
  {
    id: "siliana",
    name: "Siliana",
    region: "North Tunisia",
    description: "A governorate known for its agricultural lands and natural beauty.",
    image: "/governorates/siliana.jpg",
  },
  {
    id: "zaghouan",
    name: "Zaghouan",
    region: "North Tunisia",
    description: "Home to the ancient Roman temple of water and beautiful mountains.",
    image: "/governorates/zaghouan.jpg",
  },

  // Central Tunisia
  {
    id: "sousse",
    name: "Sousse",
    region: "Central Tunisia",
    description: "A coastal governorate with beautiful beaches and a historic medina.",
    image: "/governorates/sousse.jpg",
  },
  {
    id: "monastir",
    name: "Monastir",
    region: "Central Tunisia",
    description: "A coastal governorate known for tourism and the birthplace of former president Habib Bourguiba.",
    image: "/governorates/monastir.jpg",
  },
  {
    id: "mahdia",
    name: "Mahdia",
    region: "Central Tunisia",
    description: "A coastal governorate with a rich history and beautiful beaches.",
    image: "/governorates/mahdia.jpg",
  },
  {
    id: "kairouan",
    name: "Kairouan",
    region: "Central Tunisia",
    description: "Home to the holy city of Kairouan, one of the most important cities in Islamic history.",
    image: "/governorates/kairouan.jpg",
  },
  {
    id: "sfax",
    name: "Sfax",
    region: "Central Tunisia",
    description: "Tunisia's second-largest city and a major economic center.",
    image: "/governorates/sfax.jpg",
  },
  {
    id: "kasserine",
    name: "Kasserine",
    region: "Central Tunisia",
    description: "A mountainous region with the highest peak in Tunisia, Mount Chambi.",
    image: "/governorates/kasserine.jpg",
  },
  {
    id: "sidi-bouzid",
    name: "Sidi Bouzid",
    region: "Central Tunisia",
    description: "The birthplace of the Tunisian Revolution and an agricultural region.",
    image: "/governorates/sidi-bouzid.jpg",
  },

  // South Tunisia
  {
    id: "tozeur",
    name: "Tozeur",
    region: "South Tunisia",
    description: "An oasis governorate known for its date palms and desert landscapes.",
    image: "/governorates/tozeur.jpg",
  },
  {
    id: "kebili",
    name: "Kebili",
    region: "South Tunisia",
    description: "Home to some of the oldest oases in the world and gateway to the Grand Erg Oriental.",
    image: "/governorates/kebili.jpg",
  },
  {
    id: "gabes",
    name: "Gabès",
    region: "South Tunisia",
    description: "A coastal governorate with the only seaside oasis in the Mediterranean.",
    image: "/governorates/gabes.jpg",
  },
  {
    id: "medenine",
    name: "Medenine",
    region: "South Tunisia",
    description: "Home to the island of Djerba and traditional Berber architecture.",
    image: "/governorates/medenine.jpg",
  },
  {
    id: "tataouine",
    name: "Tataouine",
    region: "South Tunisia",
    description: "The southernmost governorate, known for its desert landscapes and Berber villages.",
    image: "/governorates/tataouine.jpg",
  },
  {
    id: "gafsa",
    name: "Gafsa",
    region: "South Tunisia",
    description: "A mining region with oases and archaeological sites.",
    image: "/governorates/gafsa.jpg",
  },
]

// Cities organized by governorate
export const cities = [
  // Tunis Governorate
  {
    id: "tunis-city",
    name: "Tunis City",
    slug: "tunis-city",
    governorate: "tunis",
    region: "North Tunisia",
    description: "Tunisia's vibrant capital with a rich blend of history and modernity.",
    image: "/cities/tunis.jpg",
    heroImage: "/cities/tunis-hero.jpg",
    featured: true,
  },
  {
    id: "medina-of-tunis",
    name: "Medina of Tunis",
    slug: "medina-of-tunis",
    governorate: "tunis",
    region: "North Tunisia",
    description:
      "A UNESCO World Heritage site with narrow winding streets, traditional markets, and historic monuments.",
    image: "/cities/medina-of-tunis.jpg",
    heroImage: "/cities/medina-of-tunis-hero.jpg",
    featured: true,
  },
  {
    id: "carthage",
    name: "Carthage",
    slug: "carthage",
    governorate: "tunis",
    region: "North Tunisia",
    description: "Ancient city with impressive ruins from the Phoenician and Roman periods.",
    image: "/cities/carthage.jpg",
    heroImage: "/cities/carthage-hero.jpg",
    featured: true,
  },
  {
    id: "sidi-bou-said",
    name: "Sidi Bou Said",
    slug: "sidi-bou-said",
    governorate: "tunis",
    region: "North Tunisia",
    description: "Picturesque blue and white village perched on a cliff overlooking the Mediterranean Sea.",
    image: "/cities/sidi-bou-said.jpg",
    heroImage: "/cities/sidi-bou-said-hero.jpg",
    featured: true,
  },
  {
    id: "la-marsa",
    name: "La Marsa",
    slug: "la-marsa",
    governorate: "tunis",
    region: "North Tunisia",
    description: "Upscale coastal suburb of Tunis with beautiful beaches and cafes.",
    image: "/cities/la-marsa.jpg",
    heroImage: "/cities/la-marsa-hero.jpg",
  },

  // Ben Arous Governorate
  {
    id: "ben-arous-city",
    name: "Ben Arous",
    slug: "ben-arous-city",
    governorate: "ben-arous",
    region: "North Tunisia",
    description: "Industrial city and residential area south of Tunis.",
    image: "/cities/ben-arous.jpg",
    heroImage: "/cities/ben-arous-hero.jpg",
  },
  {
    id: "uthina",
    name: "Uthina",
    slug: "uthina",
    governorate: "ben-arous",
    region: "North Tunisia",
    description: "Ancient Roman city with well-preserved ruins including a large amphitheater.",
    image: "/cities/uthina.jpg",
    heroImage: "/cities/uthina-hero.jpg",
  },

  // Nabeul Governorate
  {
    id: "hammamet",
    name: "Hammamet",
    slug: "hammamet",
    governorate: "nabeul",
    region: "North Tunisia",
    description: "Popular resort town known for its beaches and jasmine production.",
    image: "/cities/hammamet.jpg",
    heroImage: "/cities/hammamet-hero.jpg",
    featured: true,
  },
  {
    id: "nabeul-city",
    name: "Nabeul",
    slug: "nabeul-city",
    governorate: "nabeul",
    region: "North Tunisia",
    description: "Known for its pottery and ceramics industry.",
    image: "/cities/nabeul.jpg",
    heroImage: "/cities/nabeul-hero.jpg",
  },
  {
    id: "kelibia",
    name: "Kelibia",
    slug: "kelibia",
    governorate: "nabeul",
    region: "North Tunisia",
    description: "Coastal town with a beautiful fortress and pristine beaches.",
    image: "/cities/kelibia.jpg",
    heroImage: "/cities/kelibia-hero.jpg",
  },

  // Bizerte Governorate
  {
    id: "bizerte-city",
    name: "Bizerte",
    slug: "bizerte-city",
    governorate: "bizerte",
    region: "North Tunisia",
    description: "Port city with a charming old harbor and beautiful beaches.",
    image: "/cities/bizerte.jpg",
    heroImage: "/cities/bizerte-hero.jpg",
  },

  // Beja Governorate
  {
    id: "beja-city",
    name: "Béja",
    slug: "beja-city",
    governorate: "beja",
    region: "North Tunisia",
    description: "Agricultural city surrounded by wheat fields and hills.",
    image: "/cities/beja.jpg",
    heroImage: "/cities/beja-hero.jpg",
  },
  {
    id: "testour",
    name: "Testour",
    slug: "testour",
    governorate: "beja",
    region: "North Tunisia",
    description: "Historic town with Andalusian influence and unique architecture.",
    image: "/cities/testour.jpg",
    heroImage: "/cities/testour-hero.jpg",
  },
  {
    id: "dougga",
    name: "Dougga",
    slug: "dougga",
    governorate: "beja",
    region: "North Tunisia",
    description: "Home to the best-preserved Roman ruins in North Africa.",
    image: "/cities/dougga.jpg",
    heroImage: "/cities/dougga-hero.jpg",
  },

  // Jendouba Governorate
  {
    id: "tabarka",
    name: "Tabarka",
    slug: "tabarka",
    governorate: "jendouba",
    region: "North Tunisia",
    description: "Coastal town known for its coral fishing, music festivals, and the Needles rock formation.",
    image: "/cities/tabarka.jpg",
    heroImage: "/cities/tabarka-hero.jpg",
  },
  {
    id: "ain-draham",
    name: "Ain Draham",
    slug: "ain-draham",
    governorate: "jendouba",
    region: "North Tunisia",
    description: "Mountain town surrounded by cork oak forests, popular for winter tourism.",
    image: "/cities/ain-draham.jpg",
    heroImage: "/cities/ain-draham-hero.jpg",
  },
  {
    id: "bulla-regia",
    name: "Bulla Regia",
    slug: "bulla-regia",
    governorate: "jendouba",
    region: "North Tunisia",
    description: "Ancient Roman city famous for its unique underground villas with preserved mosaics.",
    image: "/cities/bulla-regia.jpg",
    heroImage: "/cities/bulla-regia-hero.jpg",
  },

  // Additional North Tunisia cities
  {
    id: "rafraf",
    name: "Rafraf",
    slug: "rafraf",
    governorate: "bizerte",
    region: "North Tunisia",
    description:
      "A charming coastal town known for its beautiful beaches, traditional architecture, and relaxed atmosphere.",
    image: "/rafraf-coastal-charm.png",
    heroImage: "/rafraf-tunisia-coastline.png",
  },
  {
    id: "haouaria",
    name: "Haouaria",
    slug: "haouaria",
    governorate: "nabeul",
    region: "North Tunisia",
    description:
      "A picturesque town on the Cap Bon peninsula famous for its bird sanctuary, dramatic cliffs, and ancient Roman quarries.",
    image: "/haouaria-cliffs-mediterranean.png",
    heroImage: "/haouaria-coastline.png",
  },

  // Sousse Governorate
  {
    id: "sousse-city",
    name: "Sousse",
    slug: "sousse-city",
    governorate: "sousse",
    region: "Central Tunisia",
    description: "Coastal city with beautiful beaches, a historic medina, and the impressive Ribat fortress.",
    image: "/cities/sousse.jpg",
    heroImage: "/cities/sousse-hero.jpg",
    featured: true,
  },
  {
    id: "port-el-kantaoui",
    name: "Port El Kantaoui",
    slug: "port-el-kantaoui",
    governorate: "sousse",
    region: "Central Tunisia",
    description: "Purpose-built tourist complex with a beautiful marina and golf courses.",
    image: "/cities/port-el-kantaoui.jpg",
    heroImage: "/cities/port-el-kantaoui-hero.jpg",
  },

  // Monastir Governorate
  {
    id: "monastir-city",
    name: "Monastir",
    slug: "monastir-city",
    governorate: "monastir",
    region: "Central Tunisia",
    description: "Coastal city with a magnificent Ribat fortress and the mausoleum of Habib Bourguiba.",
    image: "/cities/monastir.jpg",
    heroImage: "/cities/monastir-hero.jpg",
  },
  {
    id: "el-jem",
    name: "El Jem",
    slug: "el-jem",
    governorate: "mahdia",
    region: "Central Tunisia",
    description: "Home to one of the best-preserved Roman amphitheaters in the world.",
    image: "/cities/el-jem.jpg",
    heroImage: "/cities/el-jem-hero.jpg",
    featured: true,
  },

  // Mahdia Governorate
  {
    id: "mahdia-city",
    name: "Mahdia",
    slug: "mahdia-city",
    governorate: "mahdia",
    region: "Central Tunisia",
    description: "Historic coastal city known for its textiles and fishing port.",
    image: "/cities/mahdia.jpg",
    heroImage: "/cities/mahdia-hero.jpg",
  },
  {
    id: "chebba",
    name: "Chebba",
    slug: "chebba",
    governorate: "mahdia",
    region: "Central Tunisia",
    description: "Coastal town known for its fishing industry and beautiful beaches.",
    image: "/cities/chebba.jpg",
    heroImage: "/cities/chebba-hero.jpg",
    featured: true,
  },
  {
    id: "salakta",
    name: "Salakta",
    slug: "salakta",
    governorate: "mahdia",
    region: "Central Tunisia",
    description: "Ancient port city with Roman ruins and beautiful beaches.",
    image: "/cities/salakta.jpg",
    heroImage: "/cities/salakta-hero.jpg",
  },

  // Kairouan Governorate
  {
    id: "kairouan-city",
    name: "Kairouan",
    slug: "kairouan-city",
    governorate: "kairouan",
    region: "Central Tunisia",
    description: "One of Islam's holiest cities, featuring the Great Mosque of Kairouan.",
    image: "/cities/kairouan.jpg",
    heroImage: "/cities/kairouan-hero.jpg",
    featured: true,
  },
  {
    id: "oued-zitoun",
    name: "Oued Zitoun",
    slug: "oued-zitoun",
    governorate: "kairouan",
    region: "Central Tunisia",
    description: "Rural area known for its olive groves and traditional agriculture.",
    image: "/cities/oued-zitoun.jpg",
    heroImage: "/cities/oued-zitoun-hero.jpg",
  },

  // Kasserine Governorate
  {
    id: "sbeitla",
    name: "Sbeitla",
    slug: "sbeitla",
    governorate: "kasserine",
    region: "Central Tunisia",
    description: "Site of the ancient Roman city of Sufetula with well-preserved temples and forum.",
    image: "/cities/sbeitla.jpg",
    heroImage: "/cities/sbeitla-hero.jpg",
  },

  // Sfax Governorate
  {
    id: "sfax-city",
    name: "Sfax",
    slug: "sfax-city",
    governorate: "sfax",
    region: "Central Tunisia",
    description: "Tunisia's second-largest city and industrial center with a well-preserved medina.",
    image: "/cities/sfax.jpg",
    heroImage: "/cities/sfax-hero.jpg",
  },
  {
    id: "kerkennah",
    name: "Kerkennah Islands",
    slug: "kerkennah-islands",
    governorate: "sfax",
    region: "Central Tunisia",
    description: "Archipelago known for traditional fishing methods and tranquil beaches.",
    image: "/cities/kerkennah.jpg",
    heroImage: "/cities/kerkennah-hero.jpg",
  },

  // Tozeur Governorate
  {
    id: "tozeur-city",
    name: "Tozeur",
    slug: "tozeur-city",
    governorate: "tozeur",
    region: "South Tunisia",
    description: "Oasis town known for its date palms, unique architecture, and as a gateway to the Sahara Desert.",
    image: "/cities/tozeur.jpg",
    heroImage: "/cities/tozeur-hero.jpg",
    featured: true,
  },
  {
    id: "chebika",
    name: "Chebika",
    slug: "chebika",
    governorate: "tozeur",
    region: "South Tunisia",
    description: "Mountain oasis with stunning waterfalls and desert landscapes.",
    image: "/cities/chebika.jpg",
    heroImage: "/cities/chebika-hero.jpg",
  },
  {
    id: "tamerza",
    name: "Tamerza",
    slug: "tamerza",
    governorate: "tozeur",
    region: "South Tunisia",
    description: "Largest mountain oasis in Tunisia with a beautiful canyon and waterfall.",
    image: "/cities/tamerza.jpg",
    heroImage: "/cities/tamerza-hero.jpg",
  },

  // Kebili Governorate
  {
    id: "douz",
    name: "Douz",
    slug: "douz",
    governorate: "kebili",
    region: "South Tunisia",
    description: "Known as the 'Gateway to the Sahara', famous for its desert festival.",
    image: "/cities/douz.jpg",
    heroImage: "/cities/douz-hero.jpg",
  },
  {
    id: "ksar-ghilane",
    name: "Ksar Ghilane",
    slug: "ksar-ghilane",
    governorate: "kebili",
    region: "South Tunisia",
    description: "Desert oasis with hot springs and a Roman fort in the middle of the Sahara.",
    image: "/cities/ksar-ghilane.jpg",
    heroImage: "/cities/ksar-ghilane-hero.jpg",
  },

  // Gabes Governorate
  {
    id: "gabes-city",
    name: "Gabès",
    slug: "gabes-city",
    governorate: "gabes",
    region: "South Tunisia",
    description: "Coastal city with the only seaside oasis in the Mediterranean.",
    image: "/cities/gabes.jpg",
    heroImage: "/cities/gabes-hero.jpg",
  },
  {
    id: "matmata",
    name: "Matmata",
    slug: "matmata",
    governorate: "gabes",
    region: "South Tunisia",
    description: "Berber town famous for its troglodyte dwellings and Star Wars filming locations.",
    image: "/cities/matmata.jpg",
    heroImage: "/cities/matmata-hero.jpg",
    featured: true,
  },

  // Medenine Governorate
  {
    id: "medenine-city",
    name: "Medenine",
    slug: "medenine-city",
    governorate: "medenine",
    region: "South Tunisia",
    description: "City known for its traditional Berber architecture and former ksour (fortified granaries).",
    image: "/cities/medenine.jpg",
    heroImage: "/cities/medenine-hero.jpg",
  },
  {
    id: "djerba",
    name: "Djerba",
    slug: "djerba",
    governorate: "medenine",
    region: "South Tunisia",
    description: "Beautiful island with pristine beaches, traditional villages, and rich cultural heritage.",
    image: "/cities/djerba.jpg",
    heroImage: "/cities/djerba-hero.jpg",
    featured: true,
  },
  {
    id: "houmt-souk",
    name: "Houmt Souk",
    slug: "houmt-souk",
    governorate: "medenine",
    region: "South Tunisia",
    description: "The main town on Djerba island, known for its markets and historic center.",
    image: "/cities/houmt-souk.jpg",
    heroImage: "/cities/houmt-souk-hero.jpg",
  },
  {
    id: "midoun",
    name: "Midoun",
    slug: "midoun",
    governorate: "medenine",
    region: "South Tunisia",
    description: "Second largest town on Djerba island with a traditional weekly market.",
    image: "/cities/midoun.jpg",
    heroImage: "/cities/midoun-hero.jpg",
  },
  {
    id: "aghir",
    name: "Aghir",
    slug: "aghir",
    governorate: "medenine",
    region: "South Tunisia",
    description: "Beach resort area on the southeast coast of Djerba island.",
    image: "/cities/aghir.jpg",
    heroImage: "/cities/aghir-hero.jpg",
  },
  {
    id: "zarzis",
    name: "Zarzis",
    slug: "zarzis",
    governorate: "medenine",
    region: "South Tunisia",
    description: "Coastal city known for its olive groves, beaches, and fishing port.",
    image: "/cities/zarzis.jpg",
    heroImage: "/cities/zarzis-hero.jpg",
  },

  // Tataouine Governorate
  {
    id: "tataouine-city",
    name: "Tataouine",
    slug: "tataouine-city",
    governorate: "tataouine",
    region: "South Tunisia",
    description: "Desert city known for its Berber architecture and Star Wars filming locations.",
    image: "/cities/tataouine.jpg",
    heroImage: "/cities/tataouine-hero.jpg",
  },
  {
    id: "ksar-ouled-soltane",
    name: "Ksar Ouled Soltane",
    slug: "ksar-ouled-soltane",
    governorate: "tataouine",
    region: "South Tunisia",
    description: "Well-preserved fortified granary with distinctive architecture.",
    image: "/cities/ksar-ouled-soltane.jpg",
    heroImage: "/cities/ksar-ouled-soltane-hero.jpg",
  },
]

// Regions
export const regions = [
  {
    id: "north-tunisia",
    name: "North Tunisia",
    slug: "north-tunisia",
    description: "Explore the lush green landscapes and beautiful coastlines of Northern Tunisia",
    image: "/regions/north-tunisia.jpg",
    cities: northTunisiaCities,
  },
  {
    id: "central-tunisia",
    name: "Central Tunisia",
    slug: "central-tunisia",
    description: "Discover the historical sites, desert oases, and unique architecture of Central Tunisia",
    image: "/regions/central-tunisia.jpg",
    cities: centralTunisiaCities,
  },
  {
    id: "south-tunisia",
    name: "South Tunisia",
    slug: "south-tunisia",
    description:
      "Experience the Sahara Desert, traditional Berber villages, and stunning landscapes of Southern Tunisia",
    image: "/regions/south-tunisia.jpg",
    cities: southTunisiaCities,
  },
]

// Helper function to get all cities
export async function getAllCities() {
  try {
    const { data, error } = await supabase.from("city").select("*").order("name")

    if (error) {
      console.error("Error fetching cities:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllCities:", error)
    return []
  }
}

// Helper function to get featured cities
export function getFeaturedCities() {
  return cities.filter((city) => city.featured)
}

// Helper function to get cities by region
export function getCitiesByRegion(regionSlug: string) {
  return cities.filter((city) => {
    const region = regions.find((r) => r.slug === regionSlug)
    return region && city.region === region.name
  })
}

// Helper function to get cities by governorate
export function getCitiesByGovernorate(governorateId: string) {
  return cities.filter((city) => city.governorate === governorateId)
}

// Helper function to get city by slug
export function getCityBySlug(slug: string) {
  return cities.find((city) => city.slug === slug)
}

// Helper function to get governorate by id
export function getGovernorateById(id: string) {
  return governorates.find((gov) => gov.id === id)
}

// Helper function to get region by slug
export function getRegionBySlug(slug: string) {
  return regions.find((region) => region.slug === slug)
}

// Helper function to get governorates by region
export function getGovernoratesByRegion(regionName: string) {
  return governorates.filter((gov) => gov.region === regionName)
}
