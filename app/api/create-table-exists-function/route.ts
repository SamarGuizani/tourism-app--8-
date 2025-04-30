import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = createClient()

    // Create a function to check if a table exists
    const createTableExistsFunctionSql = `
      CREATE OR REPLACE FUNCTION table_exists(table_name TEXT)
      RETURNS BOOLEAN AS $
      DECLARE
          exists BOOLEAN;
      BEGIN
          SELECT COUNT(*) > 0 INTO exists
          FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = table_name;
          
          RETURN exists;
      END;
      $ LANGUAGE plpgsql;
    `

    const { error } = await supabase.rpc("exec_sql", {
      sql_query: createTableExistsFunctionSql,
    })

    if (error) {
      console.error("Error creating table_exists function:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Create a function to execute SQL
    const createExecSqlFunctionSql = `
      CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT)
      RETURNS JSONB AS $
      DECLARE
          result JSONB;
      BEGIN
          EXECUTE sql_query INTO result;
          RETURN result;
      EXCEPTION WHEN OTHERS THEN
          RETURN jsonb_build_object('error', SQLERRM);
      END;
      $ LANGUAGE plpgsql;
    `

    const { error: execSqlError } = await supabase.rpc("exec_sql", {
      sql_query: createExecSqlFunctionSql,
    })

    if (execSqlError) {
      console.error("Error creating exec_sql function:", execSqlError)
      return NextResponse.json({ error: execSqlError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "SQL utility functions created successfully",
    })
  } catch (error) {
    console.error("Error in create-table-exists-function:", error)
    return NextResponse.json({ error: "Failed to create SQL utility functions" }, { status: 500 })
  }
}
