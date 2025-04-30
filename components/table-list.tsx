"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MapPin, Database, Search } from "lucide-react"

interface TableListProps {
  tables: string[]
  category: "restaurants" | "activities" | "other"
}

export function TableList({ tables, category }: TableListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTables = tables.filter((table) => table.toLowerCase().includes(searchQuery.toLowerCase()))

  const getCityName = (tableName: string) => {
    const parts = tableName.split("_")
    if (parts.length > 1) {
      return parts[1].charAt(0).toUpperCase() + parts[1].slice(1)
    }
    return tableName
  }

  const getIcon = (category: string) => {
    switch (category) {
      case "restaurants":
        return <MapPin className="h-5 w-5 text-orange-500" />
      case "activities":
        return <MapPin className="h-5 w-5 text-blue-500" />
      default:
        return <Database className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Search ${category}...`}
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredTables.length === 0 ? (
        <p className="text-center py-4 text-muted-foreground">No tables found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTables.map((table) => (
            <Link key={table} href={`/table/${table}`}>
              <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    {getIcon(category)}
                    <CardTitle className="text-lg">{getCityName(table)}</CardTitle>
                  </div>
                  <CardDescription>{table}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    View and manage {category} data for {getCityName(table)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
