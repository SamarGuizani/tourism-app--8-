export const createCitiesTableSQL = `
CREATE OR REPLACE FUNCTION create_cities_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the cities table exists
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'cities'
  ) THEN
    -- Create the cities table
    CREATE TABLE cities (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      region TEXT,
      description TEXT,
      hero_image TEXT,
      image TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Create index on slug for faster lookups
    CREATE INDEX cities_slug_idx ON cities(slug);
  END IF;
END;
$$;
`
