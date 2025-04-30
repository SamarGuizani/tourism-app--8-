import { SupabaseConnectionTest } from "@/components/supabase-connection-test"

export default function TestSupabasePage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Supabase Integration Test</h1>
      <SupabaseConnectionTest />
    </div>
  )
}
