// This is a TypeScript file that exports the SQL content
// We're using .ts extension since SQL files don't typically have exports

export const createTableStructureFunction = `
-- Function to create the basic table structure for the tourism app
CREATE OR REPLACE FUNCTION create_table_structure()
RETURNS void AS $$
BEGIN
 -- Create extension for UUID generation if it doesn't exist
 CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

 -- Create profiles table if it doesn't exist
 CREATE TABLE IF NOT EXISTS profiles (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
   username TEXT UNIQUE,
   full_name TEXT,
   avatar_url TEXT,
   bio TEXT,
   created_at TIMESTAMPTZ DEFAULT NOW(),
   updated_at TIMESTAMPTZ DEFAULT NOW()
 );

 -- Create regions table if it doesn't exist
 CREATE TABLE IF NOT EXISTS regions (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   name TEXT NOT NULL,
   description TEXT,
   image_url TEXT,
   hero_image TEXT,
   created_at TIMESTAMPTZ DEFAULT NOW(),
   updated_at TIMESTAMPTZ DEFAULT NOW(),
   user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
 );

 -- Create cities table if it doesn't exist
 CREATE TABLE IF NOT EXISTS cities (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   name TEXT NOT NULL,
   description TEXT,
   region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
   image_url TEXT,
   hero_image TEXT,
   created_at TIMESTAMPTZ DEFAULT NOW(),
   updated_at TIMESTAMPTZ DEFAULT NOW(),
   user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
 );

 -- Create attractions table if it doesn't exist
 CREATE TABLE IF NOT EXISTS attractions (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   name TEXT NOT NULL,
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

 -- Create restaurants table if it doesn't exist
 IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'restaurants') THEN
   CREATE TABLE restaurants (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name VARCHAR(255) NOT NULL,
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
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     username TEXT UNIQUE,
     full_name TEXT,
     avatar_url TEXT,
     bio TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
 END IF;

 -- Create guides table if it doesn't exist
 IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'guides') THEN
   CREATE TABLE guides (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
     bio TEXT,
     languages TEXT[],
     specialties TEXT[],
     years_of_experience INTEGER,
     hourly_rate DECIMAL(10, 2),
     is_available BOOLEAN DEFAULT TRUE,
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
     date_start TIMESTAMPTZ NOT NULL,
     date_end TIMESTAMPTZ NOT NULL,
     status TEXT DEFAULT 'pending',
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
