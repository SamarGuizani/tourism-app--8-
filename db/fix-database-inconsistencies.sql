-- First, check if uuid-ossp extension is installed (required for UUID generation)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create place-images bucket if it doesn't exist
DO $$
BEGIN
    -- This can only be executed with admin privileges
    -- You may need to run this part manually in the Supabase dashboard
    -- or using the Supabase CLI
    EXECUTE 'CREATE BUCKET IF NOT EXISTS place-images';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not create bucket. You may need to create it manually in the Supabase dashboard.';
END $$;

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
END $$;

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
END $$;

-- Ensure all tables have proper UUID primary keys
DO $$
BEGIN
  -- Check attractions table
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'attractions' AND column_name = 'id'
  ) THEN
    -- Make sure id is UUID and has default value
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'attractions' AND column_name = 'id' 
      AND data_type = 'uuid'
    ) THEN
      ALTER TABLE attractions 
      ALTER COLUMN id TYPE UUID USING (uuid_generate_v4());
    END IF;
    
    -- Add default value if missing
    ALTER TABLE attractions 
    ALTER COLUMN id SET DEFAULT uuid_generate_v4();
  END IF;
  
  -- Check restaurants table
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'restaurants' AND column_name = 'id'
  ) THEN
    -- Make sure id is UUID and has default value
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'restaurants' AND column_name = 'id' 
      AND data_type = 'uuid'
    ) THEN
      ALTER TABLE restaurants 
      ALTER COLUMN id TYPE UUID USING (uuid_generate_v4());
    END IF;
    
    -- Add default value if missing
    ALTER TABLE restaurants 
    ALTER COLUMN id SET DEFAULT uuid_generate_v4();
  END IF;
  
  -- Check activities table
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'activities' AND column_name = 'id'
  ) THEN
    -- Make sure id is UUID and has default value
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'activities' AND column_name = 'id' 
      AND data_type = 'uuid'
    ) THEN
      ALTER TABLE activities 
      ALTER COLUMN id TYPE UUID USING (uuid_generate_v4());
    END IF;
    
    -- Add default value if missing
    ALTER TABLE activities 
    ALTER COLUMN id SET DEFAULT uuid_generate_v4();
  END IF;
END $$;

-- Ensure all tables have created_at column with default value
DO $$
BEGIN
  -- Check attractions table
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'attractions'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'attractions' AND column_name = 'created_at'
    ) THEN
      ALTER TABLE attractions 
      ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    ELSE
      ALTER TABLE attractions 
      ALTER COLUMN created_at SET DEFAULT NOW();
    END IF;
  END IF;
  
  -- Check restaurants table
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'restaurants'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'restaurants' AND column_name = 'created_at'
    ) THEN
      ALTER TABLE restaurants 
      ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    ELSE
      ALTER TABLE restaurants 
      ALTER COLUMN created_at SET DEFAULT NOW();
    END IF;
  END IF;
  
  -- Check activities table
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'activities'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'activities' AND column_name = 'created_at'
    ) THEN
      ALTER TABLE activities 
      ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    ELSE
      ALTER TABLE activities 
      ALTER COLUMN created_at SET DEFAULT NOW();
    END IF;
  END IF;
END $$;

-- Ensure all tables have added_by column with foreign key to auth.users
DO $$
BEGIN
  -- Check attractions table
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'attractions'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'attractions' AND column_name = 'added_by'
    ) THEN
      ALTER TABLE attractions 
      ADD COLUMN added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
  END IF;
  
  -- Check restaurants table
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'restaurants'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'restaurants' AND column_name = 'added_by'
    ) THEN
      ALTER TABLE restaurants 
      ADD COLUMN added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
  END IF;
  
  -- Check activities table
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'activities'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'activities' AND column_name = 'added_by'
    ) THEN
      ALTER TABLE activities 
      ADD COLUMN added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- Ensure all tables have proper JSONB columns for image_gallery and video_gallery
DO $$
BEGIN
  -- Check attractions table
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'attractions'
  ) THEN
    -- Add image_gallery if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'attractions' AND column_name = 'image_gallery'
    ) THEN
      ALTER TABLE attractions 
      ADD COLUMN image_gallery JSONB DEFAULT '[]'::jsonb;
    END IF;
    
    -- Add video_gallery if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'attractions' AND column_name = 'video_gallery'
    ) THEN
      ALTER TABLE attractions 
      ADD COLUMN video_gallery JSONB DEFAULT '[]'::jsonb;
    END IF;
  END IF;
  
  -- Check restaurants table
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'restaurants'
  ) THEN
    -- Add image_gallery if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'restaurants' AND column_name = 'image_gallery'
    ) THEN
      ALTER TABLE restaurants 
      ADD COLUMN image_gallery JSONB DEFAULT '[]'::jsonb;
    END IF;
    
    -- Add video_gallery if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'restaurants' AND column_name = 'video_gallery'
    ) THEN
      ALTER TABLE restaurants 
      ADD COLUMN video_gallery JSONB DEFAULT '[]'::jsonb;
    END IF;
  END IF;
  
  -- Check activities table
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'activities'
  ) THEN
    -- Add image_gallery if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'activities' AND column_name = 'image_gallery'
    ) THEN
      ALTER TABLE activities 
      ADD COLUMN image_gallery JSONB DEFAULT '[]'::jsonb;
    END IF;
    
    -- Add video_gallery if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'activities' AND column_name = 'video_gallery'
    ) THEN
      ALTER TABLE activities 
      ADD COLUMN video_gallery JSONB DEFAULT '[]'::jsonb;
    END IF;
  END IF;
END $$;

-- Create RLS policies for storage bucket
BEGIN;
  -- Enable RLS on storage.objects
  ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

  -- Create policy for public read access to place-images bucket
  DROP POLICY IF EXISTS "Public Access to place-images" ON storage.objects;
  CREATE POLICY "Public Access to place-images"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'place-images');

  -- Create policy for authenticated users to upload to place-images bucket
  DROP POLICY IF EXISTS "Authenticated users can upload to place-images" ON storage.objects;
  CREATE POLICY "Authenticated users can upload to place-images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'place-images');

  -- Create policy for authenticated users to update their own uploads
  DROP POLICY IF EXISTS "Authenticated users can update their own uploads" ON storage.objects;
  CREATE POLICY "Authenticated users can update their own uploads"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'place-images' AND owner = auth.uid())
    WITH CHECK (bucket_id = 'place-images');
COMMIT;
