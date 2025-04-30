import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!

export async function POST(request: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { email, password, name } = await request.json()

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      console.error("Error signing up user:", error)
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Update user profile and set admin role
    const { error: profileError } = await supabase.from("users").insert({
      id: data.user.id,
      email,
      name,
      is_admin: true, // Set admin role
    })

    if (profileError) {
      console.error("Error creating user profile:", profileError)
      return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 })
    }

    return NextResponse.json({ message: "Admin account created successfully" })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Failed to create admin account" }, { status: 500 })
  }
}
