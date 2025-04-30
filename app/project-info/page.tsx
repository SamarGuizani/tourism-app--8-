import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProjectInfoPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Tunisia Tourism App</h1>
      <p className="text-gray-600 mb-8">A comprehensive platform for exploring Tunisia's tourism offerings</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
            <CardDescription>Key information about the application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Purpose</h3>
              <p>
                A digital platform to showcase Tunisia's tourism destinations, connect tourists with local guides, and
                promote cultural experiences.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Target Users</h3>
              <ul className="list-disc pl-5">
                <li>Tourists planning to visit Tunisia</li>
                <li>Local guides offering their services</li>
                <li>Local businesses promoting tourism-related services</li>
                <li>Administrators managing the platform</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Key Features</h3>
              <ul className="list-disc pl-5">
                <li>City and region exploration</li>
                <li>Guide booking system</li>
                <li>User role-based dashboards</li>
                <li>Authentication and authorization</li>
                <li>Admin management tools</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technical Stack</CardTitle>
            <CardDescription>Technologies used in development</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Frontend</h3>
              <ul className="list-disc pl-5">
                <li>Next.js 14 (App Router)</li>
                <li>React 18</li>
                <li>Tailwind CSS</li>
                <li>Shadcn UI Components</li>
                <li>TypeScript</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Backend</h3>
              <ul className="list-disc pl-5">
                <li>Next.js API Routes</li>
                <li>Server Actions</li>
                <li>Supabase (PostgreSQL)</li>
                <li>Vercel Blob Storage</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Testing</h3>
              <ul className="list-disc pl-5">
                <li>Jest</li>
                <li>React Testing Library</li>
                <li>Integration Tests</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-semibold">Tourist:</span> Browse cities, book guides, manage bookings
              </li>
              <li>
                <span className="font-semibold">Guide:</span> Create profile, set availability, manage bookings
              </li>
              <li>
                <span className="font-semibold">Local:</span> Apply to become a guide, promote local services
              </li>
              <li>
                <span className="font-semibold">Admin:</span> Manage users, content, and platform settings
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Architecture</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-semibold">Client-side:</span> React components, context providers
              </li>
              <li>
                <span className="font-semibold">Server-side:</span> Server Components, API routes
              </li>
              <li>
                <span className="font-semibold">Database:</span> Supabase PostgreSQL tables
              </li>
              <li>
                <span className="font-semibold">Storage:</span> Vercel Blob for images
              </li>
              <li>
                <span className="font-semibold">Authentication:</span> Supabase Auth
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Future Enhancements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Mobile application</li>
              <li>Multilingual support</li>
              <li>AI-powered recommendations</li>
              <li>Virtual tours</li>
              <li>Integration with payment gateways</li>
              <li>Review and rating system</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
