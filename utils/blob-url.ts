import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

export function getPublicUrl(bucketName: string, path: string): string {
  const supabase = createClientComponentClient<Database>()
  const { data } = supabase.storage.from(bucketName).getPublicUrl(path)
  return data.publicUrl
}

export async function uploadImage(bucketName: string, file: File, path: string): Promise<string> {
  const supabase = createClientComponentClient<Database>()

  const { data, error } = await supabase.storage.from(bucketName).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  })

  if (error) {
    throw new Error(error.message)
  }

  return getPublicUrl(bucketName, data.path)
}

export async function deleteImage(bucketName: string, path: string): Promise<void> {
  const supabase = createClientComponentClient<Database>()

  const { error } = await supabase.storage.from(bucketName).remove([path])

  if (error) {
    throw new Error(error.message)
  }
}
