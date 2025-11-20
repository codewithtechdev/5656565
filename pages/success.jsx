import Link from 'next/link'
import Head from 'next/head'

export default function Success() {
  return (
    <>
      <Head>
        <title>Order Successful - CodeWithTechDev</title>
      </Head>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-dark mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been confirmed and you can now access your digital products.
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/library"
              className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-warning transition block"
            >
              Access My Library
            </Link>
            
            <Link 
              href="/products/category/all"
              className="w-full border border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition block"
            >
              Continue Shopping
            </Link>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-700 text-sm">
              <strong>What's next?</strong><br />
              You'll receive an email with download links and instructions. Your products are also available in your library.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}