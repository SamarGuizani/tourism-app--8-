export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      activities: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          city_id: string | null
          created_at: string
          updated_at: string | null
          duration: string | null
          price: number | null
          difficulty: string | null
          best_time: string | null
          map_link: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          city_id?: string | null
          created_at?: string
          updated_at?: string | null
          duration?: string | null
          price?: number | null
          difficulty?: string | null
          best_time?: string | null
          map_link?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          city_id?: string | null
          created_at?: string
          updated_at?: string | null
          duration?: string | null
          price?: number | null
          difficulty?: string | null
          best_time?: string | null
          map_link?: string | null
        }
        Relationships: []
      }
      attractions: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          region: string | null
          city_id: string | null
          image_url: string | null
          image_gallery: Json | null
          video_gallery: Json | null
          latitude: number | null
          longitude: number | null
          address: string | null
          opening_hours: Json | null
          contact_info: Json | null
          added_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          region?: string | null
          city_id?: string | null
          image_url?: string | null
          image_gallery?: Json | null
          video_gallery?: Json | null
          latitude?: number | null
          longitude?: number | null
          address?: string | null
          opening_hours?: Json | null
          contact_info?: string | null
          added_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          region?: string | null
          city_id?: string | null
          image_url?: string | null
          image_gallery?: Json | null
          video_gallery?: Json | null
          latitude?: number | null
          longitude?: number | null
          address?: string | null
          opening_hours?: Json | null
          contact_info?: string | null
          added_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attractions_city_id_fkey"
            columns: ["city_id"]
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attractions_added_by_fkey"
            columns: ["added_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      city: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          region_id: string | null
          governorate_id: string | null
          created_at: string
          updated_at: string | null
          header_image: string | null
          latitude: number | null
          longitude: number | null
          map_link: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          region_id?: string | null
          governorate_id?: string | null
          created_at?: string
          updated_at?: string | null
          header_image?: string | null
          latitude?: number | null
          longitude?: number | null
          map_link?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          region_id?: string | null
          governorate_id?: string | null
          created_at?: string
          updated_at?: string | null
          header_image?: string | null
          latitude?: number | null
          longitude?: number | null
          map_link?: string | null
        }
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          rating: number
          city_slug: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          rating: number
          city_slug: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          rating?: number
          city_slug?: string
          user_id?: string
        }
        Relationships: []
      }
      guides: {
        Row: {
          bio: string
          created_at: string
          id: string
          languages: string[]
          local_price: number
          locations: string[]
          rating: number
          tourist_price: number
          user_id: string
        }
        Insert: {
          bio: string
          created_at?: string
          id?: string
          languages: string[]
          local_price: number
          locations: string[]
          rating?: number
          tourist_price: number
          user_id: string
        }
        Update: {
          bio?: string
          created_at?: string
          id?: string
          languages?: string[]
          local_price?: number
          locations?: string[]
          rating?: number
          tourist_price?: number
          user_id?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          added_by: string
          city_slug: string
          created_at: string
          description: string
          drive_url: string
          id: string
          title: string
          type: "image" | "video"
        }
        Insert: {
          added_by: string
          city_slug: string
          created_at?: string
          description: string
          drive_url: string
          id?: string
          title: string
          type: "image" | "video"
        }
        Update: {
          added_by?: string
          city_slug?: string
          created_at?: string
          description?: string
          drive_url?: string
          id?: string
          title?: string
          type?: "image" | "video"
        }
        Relationships: []
      }
      places: {
        Row: {
          id: string
          name: string
          description: string | null
          location: string | null
          image_url: string | null
          created_at: string
          city_id: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          location?: string | null
          image_url?: string | null
          created_at?: string
          city_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          location?: string | null
          image_url?: string | null
          created_at?: string
          city_id?: string | null
        }
      }
      regions: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          name: string
          country: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          name: string
          country?: string | null
          slug: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          name?: string
          country?: string | null
          slug?: string
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          city_id: string | null
          created_at: string
          updated_at: string | null
          price_range: string | null
          cuisine_type: string | null
          address: string | null
          phone: string | null
          website: string | null
          map_link: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          city_id?: string | null
          created_at?: string
          updated_at?: string | null
          price_range?: string | null
          cuisine_type?: string | null
          address?: string | null
          phone?: string | null
          website?: string | null
          map_link?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          city_id?: string | null
          created_at?: string
          updated_at?: string | null
          price_range?: string | null
          cuisine_type?: string | null
          address?: string | null
          phone?: string | null
          website?: string | null
          map_link?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_guide: boolean
          is_local: boolean
          is_tourist: boolean
          name: string
          is_admin: boolean | null
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          is_guide?: boolean
          is_local: boolean
          is_tourist: boolean
          name: string
          is_admin?: boolean | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_guide?: boolean
          is_local?: boolean
          is_tourist?: boolean
          name?: string
          is_admin?: boolean | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          guide_id: string
          tourist_id: string
          location: string
          date: string
          hours: number
          total_price: number
          commission: number
          created_at: string
          attraction_id: string | null
          restaurant_id: string | null
          activity_id: string | null
        }
        Insert: {
          id?: string
          guide_id: string
          tourist_id: string
          location: string
          date: string
          hours: number
          total_price: number
          commission: number
          created_at?: string
          attraction_id: string | null
          restaurant_id: string | null
          activity_id: string | null
        }
        Update: {
          id?: string
          guide_id?: string
          tourist_id?: string
          location?: string
          date?: string
          hours?: number
          total_price?: number
          commission?: number
          created_at?: string
          attraction_id?: string | null
          restaurant_id?: string | null
          activity_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      guides_with_profiles: {
        Row: {
          id: string
          user_id: string
          bio: string | null
          languages: string[] | null
          tourist_price: number | null
          local_price: number | null
          created_at: string | null
          updated_at: string | null
          name: string | null
          email: string | null
          is_local: boolean | null
          is_tourist: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "guides_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      create_table_structure_function: {
        Args: Record<string, never>
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
