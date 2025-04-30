-- First, check if uuid-ossp extension is installed (required for UUID generation)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Check and fix guides table foreign key
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_guides_user_id' 
    AND table_name = 'guides'
  ) THEN
    -- Delete guides with missing user
    DELETE FROM guides WHERE user_id NOT IN (SELECT id FROM auth.users);
    
    -- Add foreign key constraint
    ALTER TABLE guides 
    ADD CONSTRAINT fk_guides_user_id 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;
  END IF;
END
$$;

-- Create places table (if it doesn't exist) for unified place handling
CREATE TABLE IF NOT EXISTS places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  region TEXT NOT NULL,
  city_name TEXT NOT NULL,
  city_slug VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  image_url TEXT,
  google_map_link TEXT,
  difficulty TEXT,
  duration TEXT,
  cuisine TEXT,
  price_range TEXT,
  coordinates JSONB,
  image_gallery JSONB DEFAULT '[]'::jsonb,
  video_gallery JSONB DEFAULT '[]'::jsonb
);

-- Create index on common search fields
CREATE INDEX IF NOT EXISTS idx_places_type ON places(type);
CREATE INDEX IF NOT EXISTS idx_places_region ON places(region);
CREATE INDEX IF NOT EXISTS idx_places_city_slug ON places(city_slug);

-- Make sure all tables have proper triggers for created_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'set_timestamp_attractions'
  ) THEN
    CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.created_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    
    CREATE TRIGGER set_timestamp_attractions
    BEFORE UPDATE ON attractions
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
    
    CREATE TRIGGER set_timestamp_restaurants
    BEFORE UPDATE ON restaurants
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
    
    CREATE TRIGGER set_timestamp_activities
    BEFORE UPDATE ON activities
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
    
    CREATE TRIGGER set_timestamp_places
    BEFORE UPDATE ON places
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
  END IF;
END
$$;

-- Ensure tables have UUID primary keys
DO $$
BEGIN
  -- Check attractions table
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'attractions' AND column_name = 'id' 
    AND data_type != 'uuid'
  ) THEN
    -- Convert id column to UUID if it's not already
    ALTER TABLE attractions 
    ALTER COLUMN id TYPE UUID USING uuid_generate_v4();
  END IF;
  
  -- Check restaurants table
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'restaurants' AND column_name = 'id' 
    AND data_type != 'uuid'
  ) THEN
    -- Convert id column to UUID if it's not already
    ALTER TABLE restaurants 
    ALTER COLUMN id TYPE UUID USING uuid_generate_v4();
  END IF;
  
  -- Check activities table
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'activities' AND column_name = 'id' 
    AND data_type != 'uuid'
  ) THEN
    -- Convert id column to UUID if it's not already
    ALTER TABLE activities 
    ALTER COLUMN id TYPE UUID USING uuid_generate_v4();
  END IF;
END
$$;

-- Fix bookings table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'bookings'
  ) THEN
    -- Delete bookings with missing guides
    DELETE FROM bookings
    WHERE guide_id NOT IN (SELECT id FROM guides);
    
    -- Add foreign key if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'fk_bookings_guide_id' 
      AND table_name = 'bookings'
    ) THEN
      ALTER TABLE bookings
      ADD CONSTRAINT fk_bookings_guide_id
      FOREIGN KEY (guide_id)
      REFERENCES guides(id)
      ON DELETE CASCADE;
    END IF;
  END IF;
END
$$;
