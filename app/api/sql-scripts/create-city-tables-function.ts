export const createCityTablesFunction = `
CREATE OR REPLACE FUNCTION create_city_tables(city_slug TEXT)
RETURNS VOID AS $$
BEGIN
    -- Create attractions table for the city
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I_attractions (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            type TEXT,
            ranking INTEGER,
            photos TEXT[],
            google_map_link TEXT,
            videos JSONB[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )', city_slug);
    
    -- Create restaurants table for the city
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I_restaurants (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            cuisine TEXT,
            price_range TEXT,
            ranking INTEGER,
            photos TEXT[],
            google_map_link TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )', city_slug);
    
    -- Create activities table for the city
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I_activities (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            type TEXT,
            duration TEXT,
            difficulty TEXT,
            photos TEXT[],
            contact JSONB,
            google_map_link TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )', city_slug);
END;
$$ LANGUAGE plpgsql;

-- Create a function to execute arbitrary SQL
CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
RETURNS VOID AS $$
BEGIN
    EXECUTE sql_query;
END;
$$ LANGUAGE plpgsql;
`
