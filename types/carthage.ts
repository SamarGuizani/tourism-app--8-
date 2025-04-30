export interface CarthageAttraction {
  id?: string
  name: string
  type: string
  description: string
  image: string
  google_map_link?: string
}

export interface CarthageRestaurant {
  id?: string
  name: string
  rating: string
  price_range?: string
  cuisine: string
  comment?: string
  opening_hours?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  google_map_link?: string
}
