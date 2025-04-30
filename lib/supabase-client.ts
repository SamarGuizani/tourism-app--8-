import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Check if we're in a test environment
const isTest = process.env.NODE_ENV === "test"

// Create a singleton client factory to avoid multiple instances
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const createClientInstance = () => {
  // For tests, return a mock client if URL is not available
  if (isTest && (!supabaseUrl || !supabaseAnonKey)) {
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            limit: () => ({
              maybeSingle: () => ({ data: null, error: null }),
            }),
            data: [],
            error: null,
          }),
          ilike: () => ({
            limit: () => ({
              data: [],
              error: null,
            }),
            data: [],
            error: null,
          }),
          order: () => ({
            data: [],
            error: null,
          }),
          data: [],
          error: null,
        }),
        insert: () => ({ data: [{}], error: null }),
        update: () => ({ data: [{}], error: null }),
        delete: () => ({ data: null, error: null }),
        match: () => ({ data: null, error: null }),
      }),
      storage: {
        from: () => ({
          upload: () => ({ data: { path: "test-path" }, error: null }),
          remove: () => ({ data: { path: "test-path" }, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: "https://test-url.com" } }),
        }),
      },
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
        signUp: () => Promise.resolve({ data: { user: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
      },
      channel: () => ({
        on: () => ({ on: () => ({ subscribe: () => {} }) }),
        subscribe: () => {},
      }),
    } as unknown as ReturnType<typeof createClient>
  }

  // For production/development, create a real client
  if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: isBrowser,
      },
    })
  }

  return supabaseInstance
}

// Create a single supabase client for interacting with your database
export const supabase = createClientInstance()

// Add the named export for createClient
export function getSupabaseClient() {
  return createClientInstance()
}
