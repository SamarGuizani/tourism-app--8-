"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Database, Users, Calendar, MapPin, PlusCircle, Table2, Globe } from "lucide-react"

export default function FixUtilitiesPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-2 text-center">Fix Utilities Dashboard</h1>
      <p className="text-center text-gray-500 mb-8">Use these utilities to fix various issues in the application</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Update Bookings Schema
            </CardTitle>
            <CardDescription>Add missing columns to the bookings table to fix booking errors.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Fixes the "Could not find the 'activity_id' column" error when booking guides.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/update-bookings-schema" className="w-full">
              <Button className="w-full">Fix Bookings Schema</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Add 'added_by' Column
            </CardTitle>
            <CardDescription>Add the 'added_by' column to the cities table.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Fixes the "Could not find the 'added_by' column of 'cities'" error when adding new places.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/add-added-by-column" className="w-full">
              <Button className="w-full">Add Missing Column</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Fix Guide Locations
            </CardTitle>
            <CardDescription>Ensure all guides have valid locations.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Fixes the issue where not all cities are displayed in the location dropdown when booking a guide.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/fix-guide-locations" className="w-full">
              <Button className="w-full">Fix Guide Locations</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Table2 className="h-5 w-5" />
              Initialize Column Exists Function
            </CardTitle>
            <CardDescription>Create a SQL function to check if columns exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Required for other fix utilities to work properly.</p>
          </CardContent>
          <CardFooter>
            <Link href="/initialize-column-exists-function" className="w-full">
              <Button className="w-full">Initialize Function</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Fix Database
            </CardTitle>
            <CardDescription>Fix guide relationships and other database issues.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Ensures guides are properly linked to cities.</p>
          </CardContent>
          <CardFooter>
            <Link href="/fix-database" className="w-full">
              <Button className="w-full">Fix Database</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Update Guide Schema
            </CardTitle>
            <CardDescription>Add missing columns to the guides table.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Ensures guides have all required fields like phone_number, age, etc.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/api/update-guide-schema" className="w-full">
              <Button className="w-full">Update Guide Schema</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Add Google Map Links
            </CardTitle>
            <CardDescription>Add Google Map links to all attractions, restaurants, and activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Adds a Google Map link to each attraction, restaurant, and activity for easy navigation.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/add-google-map-links" className="w-full">
              <Button className="w-full">Add Google Map Links</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  )
}
