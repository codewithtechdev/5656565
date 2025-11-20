import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import ProductCard from '../../../components/ProductCard'
import Head from 'next/head'

export default function CategoryPage() {
  const router = useRouter()
  const { category } = router.query
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryInfo, setCategoryInfo] = useState(null)
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    features: [],
    sortBy: 'newest'
  })

  useEffect(() => {
    if (category) {
      fetchCategoryProducts()
    }
  }, [category])

  const fetchCategoryProducts = async () => {
    try {
      // First, get the category info
      const { data: categoryData } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', category)
        .single()

      setCategoryInfo(categoryData)

      // Then, get products for this category
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryData?.id)
        .eq('is_active', true)

      setProducts(productsData || [])
      setFilteredProducts(productsData || [])
    } catch (error) {
      console.error('Error fetching category products:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Price filter
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    )

    // Sort products
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
    }

    setFilteredProducts(filtered)
  }

  useEffect(() => {
    applyFilters()
  }, [filters, products])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark mb-4">Category Not Found</h1>
          <button 
            onClick={() => router.push('/')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{categoryInfo.name} - CodeWithTechDev</title>
        <meta name="description" content={categoryInfo.description} />
      </Head>

      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Category Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-dark mb-4 font-montserrat">
              {categoryInfo.name}
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {categoryInfo.description}
            </p>
            <div className="mt-4 flex justify-center">
              <span className="bg-primary bg-opacity-20 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                {filteredProducts.length} projects available
              </span>
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-4">
              <select 
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>

              <select 
                value={filters.priceRange[1]}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  priceRange: [0, parseInt(e.target.value)] 
                }))}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value={1000}>All Prices</option>
                <option value={25}>Under $25</option>
                <option value={50}>Under $50</option>
                <option value={100}>Under $100</option>
                <option value={0}>Free Only</option>
              </select>
            </div>

            <div className="text-gray-600">
              Showing {filteredProducts.length} of {products.length} projects
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-dark mb-2">No projects found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters to find what you're looking for.</p>
              <button 
                onClick={() => setFilters({
                  priceRange: [0, 1000],
                  features: [],
                  sortBy: 'newest'
                })}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}