"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Search, Menu, X, MapPin, Building2, Compass, User, ChevronDown, Utensils, Landmark } from "lucide-react"

export default function Navbar() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Check if we're on the homepage
  const isHomePage = pathname === "/"

  // Ensure component is mounted before rendering motion elements
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
    }
  }

  // Animation variants
  const navbarVariants = {
    visible: {
      backgroundColor: scrolled || !isHomePage ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0)",
      boxShadow: scrolled || !isHomePage ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none",
      borderBottom: scrolled || !isHomePage ? "1px solid rgba(229, 231, 235, 0.5)" : "none",
      backdropFilter: scrolled || !isHomePage ? "blur(8px)" : "none",
    },
    hidden: {
      backgroundColor: "rgba(255, 255, 255, 0)",
      boxShadow: "none",
      borderBottom: "none",
      backdropFilter: "none",
    },
  }

  const searchVariants = {
    closed: {
      width: "40px",
      backgroundColor: "transparent",
      border: "none",
    },
    open: {
      width: "300px",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      border: "1px solid rgba(229, 231, 235, 0.5)",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
  }

  // Return a simpler header while client-side hydration is happening
  if (!isMounted) {
    return (
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white shadow ${scrolled || !isHomePage ? "text-gray-800" : "text-white"}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="text-xl md:text-2xl font-bold">
              Tunisia Guide
            </Link>
            <div className="hidden md:flex items-center space-x-1">{/* Simplified navigation */}</div>
            <div className="hidden md:flex items-center space-x-4">{/* Simplified auth */}</div>
            <div className="flex items-center md:hidden space-x-2">{/* Simplified mobile menu */}</div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHomePage ? "text-gray-800" : "text-white"
      }`}
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="text-xl md:text-2xl font-bold">
            Tunisia Guide
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`flex items-center gap-1 ${
                    scrolled || !isHomePage ? "hover:bg-gray-100" : "hover:bg-white/20"
                  }`}
                >
                  <Building2 className="h-4 w-4 mr-1" />
                  Explore
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/cities" className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2" />
                    Cities
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/governorates" className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Governorates
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`flex items-center gap-1 ${
                    scrolled || !isHomePage ? "hover:bg-gray-100" : "hover:bg-white/20"
                  }`}
                >
                  <Utensils className="h-4 w-4 mr-1" />
                  Restaurants
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
                <DropdownMenuItem className="font-medium text-sm text-gray-500" disabled>
                  By Cuisine
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/restaurants?cuisine=traditional" className="flex items-center">
                    Traditional Tunisian
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/restaurants?cuisine=seafood" className="flex items-center">
                    Seafood
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/restaurants?cuisine=mediterranean" className="flex items-center">
                    Mediterranean
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/restaurants?cuisine=international" className="flex items-center">
                    International
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="font-medium text-sm text-gray-500" disabled>
                  By Region
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/restaurants?region=north-tunisia" className="flex items-center">
                    North Tunisia
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/restaurants?region=central-tunisia" className="flex items-center">
                    Central Tunisia
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/restaurants?region=south-tunisia" className="flex items-center">
                    South Tunisia
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`flex items-center gap-1 ${
                    scrolled || !isHomePage ? "hover:bg-gray-100" : "hover:bg-white/20"
                  }`}
                >
                  <Compass className="h-4 w-4 mr-1" />
                  Activities
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
                <DropdownMenuItem className="font-medium text-sm text-gray-500" disabled>
                  By Type
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/activities?type=cultural" className="flex items-center">
                    Cultural
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/activities?type=adventure" className="flex items-center">
                    Adventure
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/activities?type=beach" className="flex items-center">
                    Beach & Water
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/activities?type=desert" className="flex items-center">
                    Desert Experiences
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="font-medium text-sm text-gray-500" disabled>
                  By Region
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/activities?region=north-tunisia" className="flex items-center">
                    North Tunisia
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/activities?region=central-tunisia" className="flex items-center">
                    Central Tunisia
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/activities?region=south-tunisia" className="flex items-center">
                    South Tunisia
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* New Attractions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`flex items-center gap-1 ${
                    scrolled || !isHomePage ? "hover:bg-gray-100" : "hover:bg-white/20"
                  }`}
                >
                  <Landmark className="h-4 w-4 mr-1" />
                  Attractions
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
                <DropdownMenuItem className="font-medium text-sm text-gray-500" disabled>
                  By Type
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/attractions?type=historical" className="flex items-center">
                    Historical Sites
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/attractions?type=museum" className="flex items-center">
                    Museums
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/attractions?type=natural" className="flex items-center">
                    Natural Wonders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/attractions?type=cultural" className="flex items-center">
                    Cultural Sites
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="font-medium text-sm text-gray-500" disabled>
                  By Region
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/attractions?region=north-tunisia" className="flex items-center">
                    North Tunisia
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/attractions?region=central-tunisia" className="flex items-center">
                    Central Tunisia
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/attractions?region=south-tunisia" className="flex items-center">
                    South Tunisia
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/book-guide">
              <Button
                variant="ghost"
                className={`${scrolled || !isHomePage ? "hover:bg-gray-100" : "hover:bg-white/20"}`}
              >
                Find a Guide
              </Button>
            </Link>

            {user?.is_guide && (
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className={`${scrolled || !isHomePage ? "hover:bg-gray-100" : "hover:bg-white/20"}`}
                >
                  Dashboard
                </Button>
              </Link>
            )}

            {(user?.is_local || user?.is_guide || user?.is_admin) && (
              <Link href="/add-content">
                <Button
                  variant="ghost"
                  className={`${scrolled || !isHomePage ? "hover:bg-gray-100" : "hover:bg-white/20"}`}
                >
                  Add Content
                </Button>
              </Link>
            )}
          </nav>

          {/* Desktop Search and Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="w-full">
                  <Input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 h-9 rounded-full border-none focus-visible:ring-0 w-[300px]"
                    autoFocus
                    onBlur={() => !searchQuery && setSearchOpen(false)}
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Search className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full ${scrolled || !isHomePage ? "hover:bg-gray-100" : "hover:bg-white/20"}`}
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </div>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`relative h-9 w-9 rounded-full ${
                      scrolled || !isHomePage ? "hover:bg-gray-100" : "hover:bg-white/20"
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "User"}`}
                        alt={user?.name || "User"}
                      />
                      <AvatarFallback>{user?.name ? user.name.charAt(0) : "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/edit">Edit Profile</Link>
                  </DropdownMenuItem>
                  {user.is_local && !user.is_guide && (
                    <DropdownMenuItem asChild>
                      <Link href="/become-guide">Become a Guide</Link>
                    </DropdownMenuItem>
                  )}
                  {user.is_admin && (
                    <DropdownMenuItem asChild>
                      <Link href="/create-admin">Create Admin</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className={`${scrolled || !isHomePage ? "hover:bg-gray-100" : "hover:bg-white/20"}`}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className={`${scrolled || !isHomePage ? "bg-primary text-white" : "bg-white text-primary"}`}>
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${scrolled || !isHomePage ? "hover:bg-gray-100" : "hover:bg-white/20"}`}
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${scrolled || !isHomePage ? "hover:bg-gray-100" : "hover:bg-white/20"}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="md:hidden bg-white border-b"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container mx-auto px-4 py-3">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search cities, attractions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                    autoFocus
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Search className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white border-b"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <div className="space-y-2">
                <div className="font-medium text-sm text-gray-500 px-2">Explore</div>
                <Link
                  href="/cities"
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Building2 className="h-5 w-5 mr-3 text-primary" />
                  <span>Cities</span>
                </Link>
                <Link
                  href="/governorates"
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MapPin className="h-5 w-5 mr-3 text-primary" />
                  <span>Governorates</span>
                </Link>
                <Link
                  href="/regions"
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Compass className="h-5 w-5 mr-3 text-primary" />
                  <span>Regions</span>
                </Link>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-sm text-gray-500 px-2">Restaurants</div>
                <div className="pl-2">
                  <div className="font-medium text-xs text-gray-400 px-2 mb-1">By Cuisine</div>
                  <Link
                    href="/restaurants?cuisine=traditional"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Traditional Tunisian</span>
                  </Link>
                  <Link
                    href="/restaurants?cuisine=seafood"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Seafood</span>
                  </Link>
                  <Link
                    href="/restaurants?cuisine=mediterranean"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Mediterranean</span>
                  </Link>
                  <Link
                    href="/restaurants?cuisine=international"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>International</span>
                  </Link>
                </div>
                <div className="pl-2">
                  <div className="font-medium text-xs text-gray-400 px-2 mb-1">By Region</div>
                  <Link
                    href="/restaurants?region=north-tunisia"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>North Tunisia</span>
                  </Link>
                  <Link
                    href="/restaurants?region=central-tunisia"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Central Tunisia</span>
                  </Link>
                  <Link
                    href="/restaurants?region=south-tunisia"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>South Tunisia</span>
                  </Link>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-sm text-gray-500 px-2">Activities</div>
                <div className="pl-2">
                  <div className="font-medium text-xs text-gray-400 px-2 mb-1">By Type</div>
                  <Link
                    href="/activities?type=cultural"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Cultural</span>
                  </Link>
                  <Link
                    href="/activities?type=adventure"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Adventure</span>
                  </Link>
                  <Link
                    href="/activities?type=beach"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Beach & Water</span>
                  </Link>
                  <Link
                    href="/activities?type=desert"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Desert Experiences</span>
                  </Link>
                </div>
                <div className="pl-2">
                  <div className="font-medium text-xs text-gray-400 px-2 mb-1">By Region</div>
                  <Link
                    href="/activities?region=north-tunisia"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>North Tunisia</span>
                  </Link>
                  <Link
                    href="/activities?region=central-tunisia"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Central Tunisia</span>
                  </Link>
                  <Link
                    href="/activities?region=south-tunisia"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>South Tunisia</span>
                  </Link>
                </div>
              </div>

              {/* New Attractions Section for Mobile */}
              <div className="space-y-2">
                <div className="font-medium text-sm text-gray-500 px-2">Attractions</div>
                <div className="pl-2">
                  <div className="font-medium text-xs text-gray-400 px-2 mb-1">By Type</div>
                  <Link
                    href="/attractions?type=historical"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Historical Sites</span>
                  </Link>
                  <Link
                    href="/attractions?type=museum"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Museums</span>
                  </Link>
                  <Link
                    href="/attractions?type=natural"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Natural Wonders</span>
                  </Link>
                  <Link
                    href="/attractions?type=cultural"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Cultural Sites</span>
                  </Link>
                </div>
                <div className="pl-2">
                  <div className="font-medium text-xs text-gray-400 px-2 mb-1">By Region</div>
                  <Link
                    href="/attractions?region=north-tunisia"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>North Tunisia</span>
                  </Link>
                  <Link
                    href="/attractions?region=central-tunisia"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Central Tunisia</span>
                  </Link>
                  <Link
                    href="/attractions?region=south-tunisia"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>South Tunisia</span>
                  </Link>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-sm text-gray-500 px-2">Services</div>
                <Link
                  href="/book-guide"
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5 mr-3 text-primary" />
                  <span>Find a Guide</span>
                </Link>
                {user?.is_guide && (
                  <Link
                    href="/dashboard"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-3 text-primary" />
                    <span>Dashboard</span>
                  </Link>
                )}
                {(user?.is_local || user?.is_guide || user?.is_admin) && (
                  <Link
                    href="/add-content"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-3 text-primary" />
                    <span>Add Content</span>
                  </Link>
                )}
              </div>

              <div className="pt-4 border-t">
                {user ? (
                  <>
                    <div className="flex items-center mb-4 p-2">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "User"}`}
                          alt={user?.name || "User"}
                        />
                        <AvatarFallback>{user?.name ? user.name.charAt(0) : "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium">{user?.name || "User"}</span>
                        <p className="text-xs text-gray-500">{user?.email || "No email"}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Link
                        href="/profile/edit"
                        className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span>Edit Profile</span>
                      </Link>
                      {user.is_local && !user.is_guide && (
                        <Link
                          href="/become-guide"
                          className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span>Become a Guide</span>
                        </Link>
                      )}
                      {user.is_admin && (
                        <Link
                          href="/create-admin"
                          className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span>Create Admin</span>
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          signOut()
                          setMobileMenuOpen(false)
                        }}
                        className="flex items-center p-2 rounded-lg hover:bg-gray-100 text-red-600 w-full text-left"
                      >
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Register</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
