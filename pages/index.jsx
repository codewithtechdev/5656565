import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'
import Head from 'next/head'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [categoriesData, productsData] = await Promise.all([
        supabase.from('categories').select('*').eq('is_active', true),
        supabase.from('products').select('*').eq('is_active', true).eq('is_featured', true).limit(8)
      ])
      
      setCategories(categoriesData.data || [])
      setFeaturedProducts(productsData.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>CodeWithTechDev - Premium Digital Code Projects</title>
        <meta name="description" content="Download ready-to-use HTML, CSS, JS, Python projects and open source code" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-primary to-white pt-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold text-dark mb-4">
            Build Amazing Projects with <span className="text-accent">Ready Code</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Download professionally crafted code projects with documentation and support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products/category/html-css-js" className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-warning transition">
              Explore Projects
            </Link>
            <Link href="/products/category/open-source" className="border-2 border-secondary text-secondary px-8 py-3 rounded-lg font-semibold hover:bg-secondary hover:text-white transition">
              Free Projects
            </Link>
          </div>
        </section>

        {/* Categories Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-center text-dark mb-12">Project Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
                <h3 className="text-2xl font-semibold text-secondary mb-3">{category.name}</h3>
                <p className="text-gray-600 mb-6">{category.description}</p>
                <Link 
                  href={`/products/category/${category.slug}`}
                  className="inline-flex items-center text-accent font-semibold hover:text-warning transition"
                >
                  Browse Projects →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-dark mb-12">Featured Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{product.short_description?.substring(0, 80)}...</p>
                    <div className="flex justify-between items-center">
                      <span className="text-accent font-bold">${product.price}</span>
                      <Link 
                        href={`/products/${product.id}`}
                        className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-secondary transition"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}