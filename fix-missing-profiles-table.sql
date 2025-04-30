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

-- Add profile_id to guides table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guides' AND column_name = 'profile_id'
  ) THEN
    ALTER TABLE guides ADD COLUMN profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create a profile for each guide that doesn't have one
DO $$
DECLARE
  guide_record RECORD;
BEGIN
  FOR guide_record IN 
    SELECT g.id, g.user_id 
    FROM guides g
    LEFT JOIN profiles p ON g.user_id = p.user_id
    WHERE p.id IS NULL
  LOOP
    -- Insert a new profile
    WITH new_profile AS (
      INSERT INTO profiles (user_id, username, full_name)
      VALUES (
        guide_record.user_id,
        'guide_' || SUBSTRING(guide_record.user_id::text, 1, 8),
        'Guide ' || SUBSTRING(guide_record.user_id::text, 1, 8)
      )
      RETURNING id
    )
    -- Update the guide with the new profile_id
    UPDATE guides
    SET profile_id = new_profile.id
    FROM new_profile
    WHERE guides.id = guide_record.id;
  END LOOP;
END $$;
