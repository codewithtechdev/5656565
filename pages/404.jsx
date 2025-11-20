import Link from 'next/link'
import Head from 'next/head'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found - CodeWithTechDev</title>
      </Head>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="text-9xl font-bold text-accent opacity-20">404</div>
            <h1 className="text-3xl font-bold text-dark mt-4 mb-2 font-montserrat">Page Not Found</h1>
            <p className="text-gray-600 mb-8">
              Sorry, we couldn't find the page you're looking for. The page might be moved or doesn't exist.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link 
              href="/"
              className="block bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-warning transition"
            >
              Go Back Home
            </Link>
            
            <Link 
              href="/products/category/all"
              className="block border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition"
            >
              Browse Projects
            </Link>
          </div>

          <div className="mt-8 p-4 bg-primary bg-opacity-10 rounded-lg">
            <p className="text-primary text-sm">
              <strong>Quick Links:</strong>
            </p>
            <div className="flex justify-center space-x-4 mt-2">
              <Link href="/products/category/html-css-js" className="text-primary hover:text-secondary text-sm">
                HTML/CSS/JS
              </Link>
              <Link href="/products/category/python" className="text-primary hover:text-secondary text-sm">
                Python
              </Link>
              <Link href="/products/category/open-source" className="text-primary hover:text-secondary text-sm">
                Open Source
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}