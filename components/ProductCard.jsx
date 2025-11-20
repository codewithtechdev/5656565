import Link from 'next/link'
import { useCart } from '../lib/cart-context'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    toast.success('Added to cart!')
  }

  const handleBuyNow = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    toast.success('Added to cart!')
  }

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100">
      <div className="relative overflow-hidden">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition duration-300"
        />
        
        <div className="absolute top-3 left-3 flex flex-col space-y-1">
          {product.is_featured && (
            <span className="bg-accent text-white px-2 py-1 rounded text-xs font-semibold">
              Featured
            </span>
          )}
          {product.price === 0 && (
            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
              FREE
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-dark mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{product.short_description?.substring(0, 80)}...</p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-accent font-bold text-lg">${product.price}</span>
          <div className="flex space-x-2">
            <button 
              onClick={handleBuyNow}
              className="bg-accent text-white px-3 py-1 rounded text-sm font-semibold hover:bg-warning transition"
            >
              Buy Now
            </button>
            <button 
              onClick={handleAddToCart}
              className="bg-primary text-white px-3 py-1 rounded text-sm font-semibold hover:bg-secondary transition"
            >
              Add to Cart
            </button>
          </div>
        </div>

        <Link 
          href={`/products/${product.id}`}
          className="w-full bg-dark text-white py-2 rounded text-sm font-semibold hover:bg-gray-800 transition text-center block"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}