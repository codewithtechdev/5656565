import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useCart } from '../../lib/cart-context'
import Head from 'next/head'
import toast, { Toaster } from 'react-hot-toast'

export default function ProductDetail() {
  const router = useRouter()
  const { id } = router.query
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [activeTab, setActiveTab] = useState('description')
  const [loading, setLoading] = useState(true)
  const [realTimeUpdates, setRealTimeUpdates] = useState([])

  useEffect(() => {
    if (id) {
      fetchProduct()
      subscribeToRealTimeUpdates()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      const { data: productData, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setProduct(productData)

      // Fetch related products
      if (productData) {
        const { data: relatedData } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', productData.category_id)
          .neq('id', id)
          .eq('is_active', true)
          .limit(4)
        
        setRelatedProducts(relatedData || [])
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Product not found')
    } finally {
      setLoading(false)
    }
  }

  const subscribeToRealTimeUpdates = () => {
    const subscription = supabase
      .channel('product_updates')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'products',
          filter: `id=eq.${id}`
        }, 
        (payload) => {
          setProduct(payload.new)
          setRealTimeUpdates(prev => [{
            id: Date.now(),
            timestamp: new Date(),
            type: 'update',
            message: 'Product has been updated',
            changes: payload.new
          }, ...prev.slice(0, 4)]) // Keep only last 5 updates
          
          toast.success('Product updated in real-time!', {
            icon: '🔄'
          })
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }

  const handleBuyNow = () => {
    if (product) {
      addToCart(product)
      router.push('/checkout')
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product)
      toast.success(`${product.name} added to cart!`)
    }
  }

  const handleLiveDemo = () => {
    if (product?.live_demo_url) {
      window.open(product.live_demo_url, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark mb-4">Product Not Found</h1>
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
        <title>{product.name} - CodeWithTechDev</title>
        <meta name="description" content={product.short_description || product.description} />
      </Head>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li><a href="/" className="hover:text-accent transition">Home</a></li>
              <li>/</li>
              <li><a href={`/products/category/${product.categories.slug}`} className="hover:text-accent transition">{product.categories.name}</a></li>
              <li>/</li>
              <li className="text-dark font-semibold">{product.name}</li>
            </ol>
          </nav>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              {/* Product Image & Gallery */}
              <div className="md:w-1/2 p-6">
                <div className="rounded-lg overflow-hidden mb-4">
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </div>
                
                {/* Additional Images */}
                {product.gallery_images && product.gallery_images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.gallery_images.map((img, index) => (
                      <img 
                        key={index}
                        src={img} 
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition"
                      />
                    ))}
                  </div>
                )}

                {/* Real-time Updates Section */}
                <div className="mt-6 p-4 bg-primary bg-opacity-10 rounded-lg border border-primary border-opacity-20">
                  <h3 className="font-semibold text-secondary mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Live Updates
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {realTimeUpdates.map((update) => (
                      <div key={update.id} className="text-sm p-2 bg-white rounded border">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-green-600">Update</span>
                          <span className="text-xs text-gray-500">
                            {update.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-gray-600 mt-1">{update.message}</div>
                      </div>
                    ))}
                    {realTimeUpdates.length === 0 && (
                      <div className="text-center text-gray-500 py-4">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        No recent updates
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Product Info */}
              <div className="md:w-1/2 p-6">
                <div className="mb-4">
                  <span className="inline-block bg-secondary bg-opacity-20 text-secondary px-3 py-1 rounded-full text-sm font-semibold mb-2">
                    {product.categories.name}
                  </span>
                  <h1 className="text-3xl font-bold text-dark mb-2 font-montserrat">{product.name}</h1>
                  <p className="text-gray-600 text-lg">{product.short_description}</p>
                </div>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center mb-4">
                    <div className="flex text-accent">
                      {'★'.repeat(Math.floor(product.rating))}
                      {'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span className="ml-2 text-gray-600">({product.review_count || 0} reviews)</span>
                  </div>
                )}

                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-accent">${product.price}</span>
                    {product.original_price && product.original_price > product.price && (
                      <>
                        <span className="text-xl text-gray-400 line-through">${product.original_price}</span>
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                          Save ${(product.original_price - product.price).toFixed(2)}
                        </span>
                      </>
                    )}
                  </div>
                  {product.price === 0 && (
                    <div className="text-green-600 font-semibold text-lg">FREE Download</div>
                  )}
                </div>

                {/* Key Features */}
                <div className="mb-6">
                  <h3 className="font-semibold text-dark mb-2">What's Included:</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.features?.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    )) || [
                      'Complete source code',
                      'Detailed documentation',
                      'Lifetime updates',
                      'Technical support',
                      'MIT License',
                      'Responsive design'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  <button 
                    onClick={handleBuyNow}
                    disabled={!product.is_active}
                    className="w-full bg-accent text-white py-4 rounded-lg font-semibold hover:bg-warning transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Buy Now
                  </button>
                  
                  <button 
                    onClick={handleAddToCart}
                    disabled={!product.is_active}
                    className="w-full bg-secondary text-white py-4 rounded-lg font-semibold hover:bg-primary transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add to Cart
                  </button>

                  {product.has_live_demo && product.live_demo_url && (
                    <button 
                      onClick={handleLiveDemo}
                      className="w-full bg-dark text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Live Demo
                    </button>
                  )}
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Instant Download
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Lifetime Updates
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Technical Support
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Source Code Included
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="border-t">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`px-6 py-4 font-semibold border-b-2 transition ${
                    activeTab === 'description'
                      ? 'border-accent text-accent'
                      : 'border-transparent text-gray-600 hover:text-dark'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('features')}
                  className={`px-6 py-4 font-semibold border-b-2 transition ${
                    activeTab === 'features'
                      ? 'border-accent text-accent'
                      : 'border-transparent text-gray-600 hover:text-dark'
                  }`}
                >
                  Features
                </button>
                <button
                  onClick={() => setActiveTab('requirements')}
                  className={`px-6 py-4 font-semibold border-b-2 transition ${
                    activeTab === 'requirements'
                      ? 'border-accent text-accent'
                      : 'border-transparent text-gray-600 hover:text-dark'
                  }`}
                >
                  Requirements
                </button>
                <button
                  onClick={() => setActiveTab('changelog')}
                  className={`px-6 py-4 font-semibold border-b-2 transition ${
                    activeTab === 'changelog'
                      ? 'border-accent text-accent'
                      : 'border-transparent text-gray-600 hover:text-dark'
                  }`}
                >
                  Changelog
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.detailed_features?.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    )) || (
                      <div className="text-gray-500">No detailed features provided.</div>
                    )}
                  </div>
                )}

                {activeTab === 'requirements' && (
                  <div className="space-y-3">
                    {product.requirements?.map((req, index) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <svg className="w-4 h-4 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {req}
                      </div>
                    )) || (
                      <div className="text-gray-500">No specific requirements.</div>
                    )}
                  </div>
                )}

                {activeTab === 'changelog' && (
                  <div className="space-y-4">
                    {product.changelog?.map((log, index) => (
                      <div key={index} className="border-l-4 border-accent pl-4 py-1">
                        <div className="font-semibold text-dark">{log.version} - {log.date}</div>
                        <ul className="list-disc list-inside text-gray-700 mt-1 ml-4">
                          {log.changes.map((change, changeIndex) => (
                            <li key={changeIndex}>{change}</li>
                          ))}
                        </ul>
                      </div>
                    )) || (
                      <div className="text-gray-500">No changelog available.</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-dark mb-6 font-montserrat">Related Projects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <div key={relatedProduct.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
                    <img 
                      src={relatedProduct.image_url} 
                      alt={relatedProduct.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-dark mb-2 line-clamp-1">{relatedProduct.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{relatedProduct.short_description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-accent font-bold">${relatedProduct.price}</span>
                        <a 
                          href={`/products/${relatedProduct.id}`}
                          className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-secondary transition"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}