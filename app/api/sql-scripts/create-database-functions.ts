import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Create the get_all_tables function
    const createGetAllTablesFunction = `
      CREATE OR REPLACE FUNCTION get_all_tables()
      RETURNS TABLE(table_name text) AS $$
      BEGIN
        RETURN QUERY
        SELECT tablename::text
        FROM pg_catalog.pg_tables
        WHERE schemaname = 'public';
      END;
      $$ LANGUAGE plpgsql;
    `

    // Create the get_table_schema function
    const createGetTableSchemaFunction = `
      CREATE OR REPLACE FUNCTION get_table_schema(table_name text)
      RETURNS TABLE(column_name text, data_type text) AS $$
      BEGIN
        RETURN QUERY
        SELECT c.column_name::text, c.data_type::text
        FROM information_schema.columns c
        WHERE c.table_schema = 'public' AND c.table_name = table_name
        ORDER BY c.ordinal_position;
      END;
      $$ LANGUAGE plpgsql;
    `

    // Create the exec_sql function
    const createExecSqlFunction = `
      CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
      RETURNS JSONB AS $$
      DECLARE
        result JSONB;
      BEGIN
        EXECUTE 'SELECT jsonb_agg(row_to_json(t)) FROM (' || sql_query || ') t' INTO result;
        RETURN COALESCE(result, '[]'::jsonb);
      EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'SQL Error: %', SQLERRM;
      END;
      $$ LANGUAGE plpgsql;
    `

    // Execute the SQL statements
    const { error: error1 } = await supabase.rpc("exec_sql", {
      sql_query: createGetAllTablesFunction,
    })

    const { error: error2 } = await supabase.rpc("exec_sql", {
      sql_query: createGetTableSchemaFunction,
    })

    const { error: error3 } = await supabase.rpc("exec_sql", {
      sql_query: createExecSqlFunction,
    })

    if (error1 || error2 || error3) {
      console.error("Error creating database functions:", error1 || error2 || error3)
      return NextResponse.json(
        {
          error: "Failed to create one or more database functions",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      message: "Database functions created successfully",
    })
  } catch (error) {
    console.error("Error in /api/sql-scripts/create-database-functions:", error)
    return NextResponse.json(
      {
        error: "Failed to create database functions",
      },
      { status: 500 },
    )
  }
}
