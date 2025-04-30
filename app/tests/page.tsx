import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, User, MapPin, Upload, Calendar, LayoutDashboard, CheckSquare, BookOpen } from "lucide-react"

export default function TestsPage() {
  const tests = [
    {
      id: "search",
      title: "Search Functionality",
      description: "Test the search bar and search results",
      icon: <Search className="h-5 w-5" />,
      path: "/tests/search",
    },
    {
      id: "auth",
      title: "Authentication",
      description: "Test sign in and registration functionality",
      icon: <User className="h-5 w-5" />,
      path: "/tests/auth",
    },
    {
      id: "add-place",
      title: "Add Place",
      description: "Test adding places to cities from the backend",
      icon: <MapPin className="h-5 w-5" />,
      path: "/tests/add-place",
    },
    {
      id: "blob-upload",
      title: "Photo Upload",
      description: "Test uploading photos to Vercel Blob",
      icon: <Upload className="h-5 w-5" />,
      path: "/tests/blob-upload",
    },
    {
      id: "booking",
      title: "Guide Booking",
      description: "Test the guide booking functionality",
      icon: <Calendar className="h-5 w-5" />,
      path: "/tests/booking",
    },
    {
      id: "components",
      title: "Component Rendering",
      description: "Test the rendering of key components",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/tests/components",
    },
    {
      id: "unit-tests",
      title: "Unit Tests",
      description: "Run Jest unit tests for components",
      icon: <CheckSquare className="h-5 w-5" />,
      path: "/tests/unit",
    },
    {
      id: "integration-tests",
      title: "Integration Tests",
      description: "Run integration tests for app workflows",
      icon: <BookOpen className="h-5 w-5" />,
      path: "/tests/integration",
    },
    {
      id: "setup",
      title: "Setup Database",
      description: "Setup the database for the application",
      icon: <BookOpen className="h-5 w-5" />,
      path: "/setup",
    },
  ]

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Tourism App Test Suite</h1>
      <p className="text-gray-600 mb-8">Use these test pages to verify functionality of your tourism app</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <Card key={test.id}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-md mr-3">{test.icon}</div>
                {test.title}
              </CardTitle>
              <CardDescription>{test.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={test.path}>
                <Button className="w-full">Run Test</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">How to Use These Tests</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Click on any test to navigate to its dedicated test page</li>
          <li>Each test provides detailed feedback and error messages</li>
          <li>Use these tests to verify your app's functionality before deploying</li>
          <li>If you encounter errors, check the console for additional information</li>
          <li>
            Unit tests can be run via Jest in VS Code or terminal with <code>npm test</code>
          </li>
        </ol>
      </div>
    </div>
  )
}
