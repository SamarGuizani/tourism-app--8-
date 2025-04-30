-- Check if we have all the necessary database tables
SELECT 
  table_name,
  EXISTS(
    SELECT 1 
    FROM information_schema.columns
    WHERE table_name = 'guides' AND column_name = 'user_id'
  ) AS has_user_id,
  EXISTS(
    SELECT 1 
    FROM information_schema.columns
    WHERE table_name = 'guides' AND column_name = 'profile_id'
  ) AS has_profile_id,
  EXISTS(
    SELECT 1 
    FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'id'
  ) AS profiles_has_id,
  EXISTS(
    SELECT 1 
    FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'user_id'
  ) AS profiles_has_user_id
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('guides', 'profiles', 'regions', 'cities', 'attractions', 'activities', 'restaurants');
