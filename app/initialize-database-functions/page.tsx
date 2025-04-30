import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle } from "lucide-react"

export default async function InitializeDatabaseFunctionsPage() {
  const supabase = createServerComponentClient({ cookies })

  // SQL script for add_column_if_not_exists function
  const addColumnScript = `
    -- Function to add a column if it doesn't exist
    CREATE OR REPLACE FUNCTION add_column_if_not_exists(
      table_name text,
      column_name text,
      column_type text
    )
    RETURNS boolean AS $$
    DECLARE
      column_exists boolean;
    BEGIN
      -- Check if the column already exists
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = $1
        AND column_name = $2
      ) INTO column_exists;
      
      -- If the column doesn't exist, add it
      IF NOT column_exists THEN
        EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s', $1, $2, $3);
        RETURN true;
      END IF;
      
      RETURN false;
    END;
    $$ LANGUAGE plpgsql;
  `

  // Execute the SQL script
  const { error } = await supabase.rpc("pgSQL", { query: addColumnScript })

  const success = !error
  const message = error ? error.message : "Database functions initialized successfully!"

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Initialize Database Functions</CardTitle>
          <CardDescription>Set up required database functions for the Tunisia Tourism app</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-2 p-4 rounded-md bg-gray-50">
            {success ? (
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            )}
            <div>
              <p className="font-medium">add_column_if_not_exists</p>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
