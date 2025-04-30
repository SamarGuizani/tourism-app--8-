export const linkRestaurantsSQL = `
-- Step 1: Create a temporary table to store city-region mappings
CREATE TEMP TABLE IF NOT EXISTS city_region_map AS
SELECT 
  slug AS city_slug,
  name AS city_name,
  region
FROM cities;

-- Step 2: Update restaurants that have city_slug but missing region
UPDATE restaurants
SET region = crm.region
FROM city_region_map crm
WHERE restaurants.city_slug = crm.city_slug
  AND (restaurants.region IS NULL OR restaurants.region = '');

-- Step 3: Create a view that combines all restaurants
CREATE OR REPLACE VIEW all_restaurants_view AS
SELECT 
  r.id,
  r.name,
  r.description,
  r.address,
  r.city_slug,
  COALESCE(r.region, 
    (SELECT region FROM cities WHERE slug = r.city_slug LIMIT 1), 
    'Unknown') AS region,
  r.image_url,
  r.cuisine,
  r.price_range,
  r.created_at,
  c.name AS city_name
FROM restaurants r
LEFT JOIN cities c ON r.city_slug = c.slug;

-- Step 4: Create a function to get all restaurants with region info
CREATE OR REPLACE FUNCTION get_all_restaurants()
RETURNS TABLE (
  id TEXT,
  name TEXT,
  description TEXT,
  address TEXT,
  city_slug TEXT,
  region TEXT,
  image_url TEXT,
  cuisine TEXT,
  price_range TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  city_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM all_restaurants_view;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Create a function to get restaurants by region
CREATE OR REPLACE FUNCTION get_restaurants_by_region(region_name TEXT)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  description TEXT,
  address TEXT,
  city_slug TEXT,
  region TEXT,
  image_url TEXT,
  cuisine TEXT,
  price_range TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  city_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM all_restaurants_view
  WHERE region = region_name;
END;
$$ LANGUAGE plpgsql;
`
