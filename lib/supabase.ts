import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a singleton Supabase client for browser-side usage
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
)

// Create a Supabase client with the service role key for server-side operations
export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : supabase // Fallback to regular client if service role key is not available

// Helper function to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

// Helper function to get image URL from Supabase Storage
export function getImageUrl(bucket: string, path: string): string {
  if (!path) return ""
  if (path.startsWith("http")) return path
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return path

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
}

// Export a createServerSupabaseClient function for compatibility
export function createServerSupabaseClient() {
  return supabaseAdmin
}
