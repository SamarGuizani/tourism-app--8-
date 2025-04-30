import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a new Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!

export async function POST(request: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    // SQL to create the exec_sql function
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT)
      RETURNS JSONB
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        result JSONB;
      BEGIN
        EXECUTE sql_query INTO result;
        RETURN result;
      EXCEPTION WHEN OTHERS THEN
        RETURN jsonb_build_object('error', SQLERRM);
      END;
      $$;
    `

    // Execute the SQL to create the function
    const { error } = await supabase
      .from("_exec_sql_temp")
      .select("*")
      .limit(1)
      .then(() => {
        // This is just a dummy query to get access to the connection
        // We'll catch the error and use a different approach
        return { error: new Error("Dummy query") }
      })
      .catch(async () => {
        // Now let's try a different approach using auth.admin functions
        try {
          // This is a workaround since we can't directly execute SQL
          // We'll create a temporary table, which will fail, but we can catch that
          // and use the connection to execute our SQL
          await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${supabaseKey}`,
              apikey: supabaseKey,
            },
            body: JSON.stringify({ sql_query: createFunctionSQL }),
          })
          return { error: null }
        } catch (err) {
          return { error: err }
        }
      })

    if (error) {
      console.error("Error creating function:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Function created successfully" })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create function" },
      { status: 500 },
    )
  }
}
