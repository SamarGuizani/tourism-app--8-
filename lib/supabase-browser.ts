"use client"

import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

let clientInstance: ReturnType<typeof createClient<Database>> | null = null

export function createClientSupabaseClient() {
  if (clientInstance) return clientInstance

  // Check if environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing. Please check your environment variables.", {
      url: supabaseUrl ? "✓" : "✗",
      key: supabaseAnonKey ? "✓" : "✗",
    })

    // Return a dummy client that won't cause runtime errors
    return createClient<Database>("https://placeholder.supabase.co", "placeholder-key", {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }

  clientInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  return clientInstance
}

// Export for convenience
export const supabase = createClientSupabaseClient()
