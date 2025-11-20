import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Head from 'next/head'

export default function Library() {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch user's purchases from Supabase
    // For demo, we'll use localStorage
    const demoPurchases = [
      {
        id: 1,
        product_name: 'Responsive Portfolio Template',
        product_id: '1',
        purchased_at: new Date().toISOString(),
        download_url: '/downloads/portfolio-template.zip',
        image_url: '/images/portfolio-template.jpg'
      }
    ]
    setPurchases(demoPurchases)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>My Library - CodeWithTechDev</title>
      </Head>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-dark mb-2">My Library</h1>
          <p className="text-gray-600 mb-8">Access all your purchased digital projects</p>
          
          {purchases.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="w-24 h-24 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-dark mb-4">No purchases yet</h2>
              <p className="text-gray-600 mb-6">Your purchased projects will appear here after you make a purchase.</p>
              <a href="/products/category/all" className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-warning transition inline-block">
                Browse Projects
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchases.map((purchase) => (
                <div key={purchase.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img 
                    src={purchase.image_url} 
                    alt={purchase.product_name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-dark mb-2">{purchase.product_name}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Purchased on {new Date(purchase.purchased_at).toLocaleDateString()}
                    </p>
                    <div className="flex space-x-2">
                      <a 
                        href={purchase.download_url}
                        className="flex-1 bg-accent text-white py-2 rounded text-center text-sm font-semibold hover:bg-warning transition"
                      >
                        Download
                      </a>
                      <a 
                        href={`/products/${purchase.product_id}`}
                        className="flex-1 border border-primary text-primary py-2 rounded text-center text-sm font-semibold hover:bg-primary hover:text-white transition"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}