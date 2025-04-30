import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Tunisia Guide</h3>
            <p className="text-gray-400">
              Explore Tunisia with local guides. Discover cities, attractions, and authentic experiences.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cities" className="text-gray-400 hover:text-white">
                  Cities
                </Link>
              </li>
              <li>
                <Link href="/regions" className="text-gray-400 hover:text-white">
                  Regions
                </Link>
              </li>
              <li>
                <Link href="/book-guide" className="text-gray-400 hover:text-white">
                  Find a Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Join Us</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/register" className="text-gray-400 hover:text-white">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-400 hover:text-white">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/become-guide" className="text-gray-400 hover:text-white">
                  Become a Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Email: info@tunisiaguide.com</li>
              <li className="text-gray-400">Phone: +216 123 456 789</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Tunisia Guide. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
