import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>CodeWithTechDev - Digital Code Projects</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white pt-16">
        {/* Header */}
        <header className="bg-gray-900 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="text-xl font-bold">CodeWithTechDev</span>
            </div>
            <nav className="flex space-x-6">
              <Link href="/" className="hover:text-orange-400 transition">Home</Link>
              <Link href="/admin" className="hover:text-orange-400 transition">Admin</Link>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-orange-500">CodeWithTechDev</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your digital code projects e-commerce website is being set up.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admin" className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
              Go to Admin Panel
            </Link>
          </div>
        </section>

        {/* Info Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Website Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-100 border border-green-400 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">✅ Backend Connected</h3>
                <p className="text-green-700">Supabase database is ready</p>
              </div>
              <div className="bg-blue-100 border border-blue-400 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">🛒 E-commerce Ready</h3>
                <p className="text-blue-700">Shopping cart system implemented</p>
              </div>
              <div className="bg-purple-100 border border-purple-400 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-2">📱 Responsive Design</h3>
                <p className="text-purple-700">Works on all devices</p>
              </div>
              <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">⚡ Fast Performance</h3>
                <p className="text-yellow-700">Optimized for speed</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
