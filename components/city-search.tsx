"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

type City = {
  id: string
  name: string
  slug: string
}

export function CitySearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<City[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const searchCities = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from("city")
          .select("id, name, slug")
          .ilike("name", `%${query}%`)
          .order("name")
          .limit(5)

        if (error) throw error
        setResults(data || [])
      } catch (error) {
        console.error("Error searching cities:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(() => {
      searchCities()
    }, 300)

    return () => clearTimeout(debounce)
  }, [query, supabase])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setShowResults(true)
  }

  const handleInputFocus = () => {
    if (query.length >= 2) {
      setShowResults(true)
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search Tunisian cities"
          className="pl-10 pr-4"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
      </div>

      {showResults && results.length > 0 && (
        <div ref={resultsRef} className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
          <ul className="max-h-60 overflow-auto py-1 text-base">
            {results.map((city) => (
              <li key={city.id}>
                <Link
                  href={`/cities/${city.slug}`}
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setShowResults(false)}
                >
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showResults && query.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white p-4 shadow-lg">
          <p className="text-sm text-gray-500">No cities found</p>
        </div>
      )}
    </div>
  )
}
