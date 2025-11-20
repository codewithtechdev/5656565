import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '../lib/cart-context'
import SearchBar from './SearchBar'

export default function Header() {
  const { getCartCount } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-dark shadow-lg' : 'bg-dark/95 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <img src="/images/logo.png" alt="CodeWithTechDev" className="w-8 h-8" />
            </div>
            <span className="text-xl font-bold text-white font-montserrat hidden sm:block">
              CodeWithTechDev
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-accent transition font-medium">
              Home
            </Link>
            <Link href="/products/category/html-css-js" className="text-white hover:text-accent transition font-medium">
              HTML/CSS/JS
            </Link>
            <Link href="/products/category/python" className="text-white hover:text-accent transition font-medium">
              Python
            </Link>
            <Link href="/products/category/open-source" className="text-white hover:text-accent transition font-medium">
              Open Source
            </Link>
            <Link href="/library" className="text-white hover:text-accent transition font-medium">
              My Library
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <SearchBar />

            {/* Cart */}
            <Link href="/cart" className="relative text-white hover:text-accent transition p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Admin Link */}
            <Link href="/admin" className="bg-accent text-dark px-4 py-2 rounded-lg text-sm font-semibold hover:bg-warning transition hidden md:block">
              Admin
            </Link>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-dark border-t border-gray-700 py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-white hover:text-accent transition font-medium">
                Home
              </Link>
              <Link href="/products/category/html-css-js" className="text-white hover:text-accent transition font-medium">
                HTML/CSS/JS Projects
              </Link>
              <Link href="/products/category/python" className="text-white hover:text-accent transition font-medium">
                Python Projects
              </Link>
              <Link href="/products/category/open-source" className="text-white hover:text-accent transition font-medium">
                Open Source Projects
              </Link>
              <Link href="/library" className="text-white hover:text-accent transition font-medium">
                My Library
              </Link>
              <Link href="/admin" className="text-white hover:text-accent transition font-medium">
                Admin Panel
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}