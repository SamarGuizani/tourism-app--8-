-- Function to create the get_all_attractions function
CREATE OR REPLACE FUNCTION create_get_all_attractions_function()
RETURNS void AS $$
BEGIN
    -- Create the function to get all attractions
    EXECUTE '
    CREATE OR REPLACE FUNCTION get_all_attractions()
    RETURNS TABLE (
        id UUID, 
        name VARCHAR(255), 
        description TEXT, 
        source_table TEXT,
        image_url TEXT
    ) AS $func$
    DECLARE
        query_text TEXT := '''';
        table_rec RECORD;
    BEGIN
        -- Start with the main attractions table
        query_text := ''SELECT 
            id, 
            name, 
            description, 
            ''''attractions'''' AS source_table,
            image_url
        FROM attractions'';
        
        -- Add all tables with attractions_ prefix
        FOR table_rec IN 
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = ''''public''''
            AND table_name LIKE ''''attractions_%''''
            AND table_name != ''''attractions''''
        LOOP
            -- Check if the table has the required columns
            IF EXISTS (
                SELECT 1 
                FROM information_schema.columns 
                WHERE table_name = table_rec.table_name 
                AND column_name = ''''id''''
            ) AND EXISTS (
                SELECT 1 
                FROM information_schema.columns 
                WHERE table_name = table_rec.table_name 
                AND column_name = ''''name''''
            ) AND EXISTS (
                SELECT 1 
                FROM information_schema.columns 
                WHERE table_name = table_rec.table_name 
                AND column_name = ''''description''''
            ) THEN
                -- Check if image_url column exists
                IF EXISTS (
                    SELECT 1 
                    FROM information_schema.columns 
                    WHERE table_name = table_rec.table_name 
                    AND column_name = ''''image_url''''
                ) THEN
                    query_text := query_text || '' UNION ALL SELECT 
                        id, 
                        name, 
                        description, 
                        '''''' || table_rec.table_name || '''''' AS source_table,
                        image_url
                    FROM '' || table_rec.table_name;
                ELSE
                    query_text := query_text || '' UNION ALL SELECT 
                        id, 
                        name, 
                        description, 
                        '''''' || table_rec.table_name || '''''' AS source_table,
                        NULL AS image_url
                    FROM '' || table_rec.table_name;
                END IF;
            END IF;
        END LOOP;
        
        -- Execute the dynamic query
        RETURN QUERY EXECUTE query_text;
    END;
    $func$ LANGUAGE plpgsql;';
END;
$$ LANGUAGE plpgsql;

-- Execute the function to create the get_all_attractions function
SELECT create_get_all_attractions_function();
