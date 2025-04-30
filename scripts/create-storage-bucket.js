import { createClient } from "@supabase/supabase-js"

async function createStorageBucket() {
  try {
    // Initialize the Supabase client with admin privileges
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceRole) {
      throw new Error("Missing Supabase environment variables")
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRole)

    console.log("Checking for existing buckets...")
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      throw listError
    }

    const bucketName = "place-images"
    const bucketExists = buckets.some((bucket) => bucket.name === bucketName)

    if (bucketExists) {
      console.log(`Bucket '${bucketName}' already exists.`)
    } else {
      console.log(`Creating bucket '${bucketName}'...`)
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      })

      if (error) {
        throw error
      }

      console.log(`Bucket '${bucketName}' created successfully.`)
    }

    // Set up public access policy
    console.log("Setting up storage policies...")
    const { error: policyError } = await supabase.rpc("create_storage_policy", {
      bucket_name: bucketName,
    })

    if (policyError) {
      console.warn("Could not set up policies via RPC:", policyError.message)
      console.log("You may need to set up policies manually in the Supabase dashboard.")
    } else {
      console.log("Storage policies set up successfully.")
    }

    console.log("Storage bucket setup complete!")
  } catch (error) {
    console.error("Error setting up storage bucket:", error)
    process.exit(1)
  }
}

createStorageBucket()
