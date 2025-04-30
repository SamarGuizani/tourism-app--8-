import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET() {
  try {
    const supabase = createClient()

    // Execute the SQL function
    const { data, error } = await supabase.rpc("create_table_structure_function")

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, message: "Table structure created successfully" })
  } catch (error) {
    console.error("Error executing SQL function:", error)
    return NextResponse.json({ success: false, error: "Failed to create table structure" }, { status: 500 })
  }
}

export function createTableStructureFunction() {
  return `
-- Function to create the table structure for the tourism app
CREATE OR REPLACE FUNCTION create_table_structure_function()
RETURNS void AS $$
BEGIN
  -- Create extension for UUID generation if it doesn't exist
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  -- Create regions table if it doesn't exist
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'regions') THEN
    CREATE TABLE regions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      image_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;

  -- Create cities table if it doesn't exist
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cities') THEN
    CREATE TABLE cities (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
      description TEXT,
      image_url TEXT,
      latitude DECIMAL,
      longitude DECIMAL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;

  -- Create attractions table if it doesn't exist
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'attractions') THEN
    CREATE TABLE attractions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      region VARCHAR(255),
      city_id UUID REFERENCES cities(id) ON DELETE SET NULL,
      image_url TEXT,
      image_gallery JSONB DEFAULT '[]'::jsonb,
      video_gallery JSONB DEFAULT '[]'::jsonb,
      latitude DECIMAL,
      longitude DECIMAL,
      address TEXT,
      opening_hours JSONB,
      contact_info JSONB,
      added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;

  -- Create restaurants table if it doesn't exist
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'restaurants') THEN
    CREATE TABLE restaurants (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      region VARCHAR(255),
      city_id UUID REFERENCES cities(id) ON DELETE SET NULL,
      cuisine_type VARCHAR(255),
      price_range VARCHAR(50),
      image_url TEXT,
      image_gallery JSONB DEFAULT '[]'::jsonb,
      video_gallery JSONB DEFAULT '[]'::jsonb,
      latitude DECIMAL,
      longitude DECIMAL,
      address TEXT,
      opening_hours JSONB,
      contact_info JSONB,
      menu_url TEXT,
      added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;

  -- Create activities table if it doesn't exist
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'activities') THEN
    CREATE TABLE activities (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      region VARCHAR(255),
      city_id UUID REFERENCES cities(id) ON DELETE SET NULL,
      activity_type VARCHAR(255),
      duration VARCHAR(100),
      price_range VARCHAR(50),
      image_url TEXT,
      image_gallery JSONB DEFAULT '[]'::jsonb,
      video_gallery JSONB DEFAULT '[]'::jsonb,
      latitude DECIMAL,
      longitude DECIMAL,
      address TEXT,
      availability JSONB,
      contact_info JSONB,
      booking_url TEXT,
      added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;

  -- Create profiles table if it doesn't exist
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    CREATE TABLE profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      name TEXT,
      email TEXT,
      is_local BOOLEAN DEFAULT FALSE,
      is_tourist BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;

  -- Create guides table if it doesn't exist
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'guides') THEN
    CREATE TABLE guides (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      bio TEXT,
      languages TEXT[],
      tourist_price INTEGER DEFAULT 50,
      local_price INTEGER DEFAULT 30,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;

  -- Create bookings table if it doesn't exist
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'bookings') THEN
    CREATE TABLE bookings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      time TIME NOT NULL,
      duration INTEGER NOT NULL, -- in hours
      status VARCHAR(50) DEFAULT 'pending',
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;

  -- Create reviews table if it doesn't exist
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'reviews') THEN
    CREATE TABLE reviews (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      place_id UUID NOT NULL,
      place_type VARCHAR(50) NOT NULL, -- 'attraction', 'restaurant', 'activity'
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;

  -- Create trigger to automatically create profile when user is created
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'create_profile_trigger') THEN
    CREATE OR REPLACE FUNCTION public.create_profile_for_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.profiles (id, email)
      VALUES (NEW.id, NEW.email);
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    
    DROP TRIGGER IF EXISTS create_profile_trigger ON auth.users;
    CREATE TRIGGER create_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.create_profile_for_user();
  END IF;

END;
$$ LANGUAGE plpgsql;
  `
}
