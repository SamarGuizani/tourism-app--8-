"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// Create a singleton pattern for the Supabase client to prevent
// multiple instances which can cause memory leaks and other issues
let clientInstance: ReturnType<typeof createClientComponentClient<Database>> | null = null

export function getSupabaseClient() {
  if (!clientInstance) {
    clientInstance = createClientComponentClient<Database>()
  }
  return clientInstance
}

// Add an error boundary wrapper for Supabase operations
export async function safeSupabaseOperation<T>(
  operation: () => Promise<T>,
  errorMessage = "Error performing Supabase operation",
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const result = await operation()
    return { data: result, error: null }
  } catch (error) {
    console.error(`${errorMessage}:`, error)
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) }
  }
}

// Helper to check if a path is a valid Supabase storage URL
export function isValidSupabaseUrl(url: string): boolean {
  try {
    if (!url) return false

    // Check if it's a relative path starting with /
    if (url.startsWith("/")) return true

    // Check if it contains supabase URL parts
    const urlObj = new URL(url)
    return (
      urlObj.hostname.includes("supabase") || urlObj.pathname.includes("storage") || urlObj.pathname.includes("object")
    )
  } catch {
    return false
  }
}

// Helper to format Supabase storage URLs consistently
export function formatStorageUrl(path: string): string {
  if (!path) return ""

  // If it's already a full URL, return it
  if (path.startsWith("http")) return path

  // If it's a relative path, ensure it starts with /
  if (!path.startsWith("/")) {
    path = "/" + path
  }

  return path
}
