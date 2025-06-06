export const createColumnExistsFunction = `
CREATE OR REPLACE FUNCTION column_exists(table_name text, column_name text)
RETURNS boolean AS $$
DECLARE
  exists boolean;
BEGIN
  SELECT COUNT(*) > 0 INTO exists
  FROM information_schema.columns
  WHERE table_name = $1
  AND column_name = $2;
  
  RETURN exists;
END;
$$ LANGUAGE plpgsql;
`
