"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function NavbarTestPage() {
  const [darkBackground, setDarkBackground] = useState(false)

  return (
    <div className={`min-h-screen ${darkBackground ? "bg-gray-900" : "bg-white"}`}>
      <Navbar />

      <div className="container mx-auto pt-24 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Navbar Test Page</CardTitle>
            <CardDescription>This page is for testing the Navbar component in isolation.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <Switch id="dark-mode" checked={darkBackground} onCheckedChange={setDarkBackground} />
              <Label htmlFor="dark-mode">Toggle dark background (to test transparency)</Label>
            </div>

            <p className="mb-4">Scroll down to see how the navbar changes appearance when scrolling.</p>

            <div className="h-[2000px] flex flex-col space-y-4 pt-10">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="p-4 border rounded">
                  Scroll section {i + 1}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
