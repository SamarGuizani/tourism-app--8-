"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

interface ContentTableProps {
  contentType: "restaurants" | "activities" | "attractions"
  citySlug?: string
  region?: string
}

export default function ContentTable({ contentType, citySlug, region }: ContentTableProps) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchItems()
  }, [contentType, citySlug, region])

  const fetchItems = async () => {
    setLoading(true)
    try {
      let query = supabase.from(contentType).select("*")

      if (citySlug) {
        query = query.eq("city_slug", citySlug)
      }

      if (region) {
        // For items that have a direct region field
        query = query.eq("region", region)
      }

      const { data, error } = await query

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error(`Error fetching ${contentType}:`, error)
      toast({
        title: "Error",
        description: `Failed to load ${contentType}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this ${contentType.slice(0, -1)}?`)) return

    try {
      const { error } = await supabase.from(contentType).delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: `${contentType.slice(0, -1)} deleted successfully.`,
      })

      // Refresh the list
      fetchItems()
    } catch (error) {
      console.error(`Error deleting ${contentType.slice(0, -1)}:`, error)
      toast({
        title: "Error",
        description: `Failed to delete ${contentType.slice(0, -1)}. Please try again.`,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (items.length === 0) {
    return <div className="text-center py-8">No {contentType} found for the selected filters.</div>
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>City</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.city_slug || item.city || "N/A"}</TableCell>
              <TableCell className="hidden md:table-cell max-w-xs truncate">
                {item.description?.substring(0, 100)}...
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/edit/${contentType}/${item.id}`}>
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                  {item.google_map_link && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={item.google_map_link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
