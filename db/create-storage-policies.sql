-- Create a function to set up storage policies
CREATE OR REPLACE FUNCTION create_storage_policy(bucket_name TEXT)
RETURNS VOID AS $$
BEGIN
  -- Enable RLS on storage.objects
  ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

  -- Create policy for public read access to the bucket
  EXECUTE format('
    DROP POLICY IF EXISTS "Public Access to %I" ON storage.objects;
    CREATE POLICY "Public Access to %I"
      ON storage.objects
      FOR SELECT
      USING (bucket_id = %L);
  ', bucket_name, bucket_name, bucket_name);

  -- Create policy for authenticated users to upload to the bucket
  EXECUTE format('
    DROP POLICY IF EXISTS "Authenticated users can upload to %I" ON storage.objects;
    CREATE POLICY "Authenticated users can upload to %I"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = %L);
  ', bucket_name, bucket_name, bucket_name);

  -- Create policy for authenticated users to update their own uploads
  EXECUTE format('
    DROP POLICY IF EXISTS "Authenticated users can update their own uploads in %I" ON storage.objects;
    CREATE POLICY "Authenticated users can update their own uploads in %I"
      ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (bucket_id = %L AND owner = auth.uid())
      WITH CHECK (bucket_id = %L);
  ', bucket_name, bucket_name, bucket_name, bucket_name);

  -- Create policy for authenticated users to delete their own uploads
  EXECUTE format('
    DROP POLICY IF EXISTS "Authenticated users can delete their own uploads in %I" ON storage.objects;
    CREATE POLICY "Authenticated users can delete their own uploads in %I"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (bucket_id = %L AND owner = auth.uid());
  ', bucket_name, bucket_name, bucket_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
