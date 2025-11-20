import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'
import Head from 'next/head'

export default function Admin() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [activeTab, setActiveTab] = useState('products')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    description: '',
    price: '',
    original_price: '',
    image_url: '',
    file_url: '',
    category_id: '',
    is_active: true,
    is_featured: false,
    has_live_demo: false,
    live_demo_url: '',
    features: []
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    setProducts(data || [])
  }

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
    setCategories(data || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingProduct) {
        // Update product
        const { error } = await supabase
          .from('products')
          .update({
            ...formData,
            price: parseFloat(formData.price),
            original_price: formData.original_price ? parseFloat(formData.original_price) : null,
            features: Array.isArray(formData.features) ? formData.features : formData.features.split(',').map(f => f.trim())
          })
          .eq('id', editingProduct.id)

        if (error) throw error
        toast.success('Product updated successfully!')
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([{
            ...formData,
            price: parseFloat(formData.price),
            original_price: formData.original_price ? parseFloat(formData.original_price) : null,
            features: Array.isArray(formData.features) ? formData.features : formData.features.split(',').map(f => f.trim())
          }])

        if (error) throw error
        toast.success('Product created successfully!')
      }

      resetForm()
      fetchProducts()
    } catch (error) {
      toast.error('Error saving product: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      short_description: '',
      description: '',
      price: '',
      original_price: '',
      image_url: '',
      file_url: '',
      category_id: '',
      is_active: true,
      is_featured: false,
      has_live_demo: false,
      live_demo_url: '',
      features: []
    })
    setEditingProduct(null)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      short_description: product.short_description || '',
      description: product.description,
      price: product.price,
      original_price: product.original_price || '',
      image_url: product.image_url,
      file_url: product.file_url,
      category_id: product.category_id,
      is_active: product.is_active,
      is_featured: product.is_featured,
      has_live_demo: product.has_live_demo,
      live_demo_url: product.live_demo_url || '',
      features: product.features || []
    })
  }

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error
      toast.success('Product deleted successfully!')
      fetchProducts()
    } catch (error) {
      toast.error('Error deleting product: ' + error.message)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <>
      <Head>
        <title>Admin Panel - CodeWithTechDev</title>
      </Head>
      <Toaster />
      
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-dark mb-8 font-montserrat">Admin Panel</h1>

          {/* Tabs */}
          <div className="flex border-b mb-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-3 font-semibold border-b-2 transition ${
                activeTab === 'products'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-600 hover:text-dark'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-3 font-semibold border-b-2 transition ${
                activeTab === 'categories'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-600 hover:text-dark'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 font-semibold border-b-2 transition ${
                activeTab === 'analytics'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-600 hover:text-dark'
              }`}
            >
              Analytics
            </button>
          </div>

          {activeTab === 'products' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Form */}
              <div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6 font-montserrat">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Enter product name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                      <input
                        type="text"
                        name="short_description"
                        value={formData.short_description}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Brief description for cards"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Detailed product description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Original Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          name="original_price"
                          value={formData.original_price}
                          onChange={handleInputChange}
                          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                        <input
                          type="url"
                          name="image_url"
                          value={formData.image_url}
                          onChange={handleInputChange}
                          required
                          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">File URL</label>
                        <input
                          type="url"
                          name="file_url"
                          value={formData.file_url}
                          onChange={handleInputChange}
                          required
                          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        required
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma separated)</label>
                      <input
                        type="text"
                        name="features"
                        value={Array.isArray(formData.features) ? formData.features.join(', ') : formData.features}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          features: e.target.value
                        }))}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Responsive Design, Dark Mode, etc."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="is_active"
                          checked={formData.is_active}
                          onChange={handleInputChange}
                          className="text-accent rounded"
                        />
                        <span>Active</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="is_featured"
                          checked={formData.is_featured}
                          onChange={handleInputChange}
                          className="text-accent rounded"
                        />
                        <span>Featured</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="has_live_demo"
                          checked={formData.has_live_demo}
                          onChange={handleInputChange}
                          className="text-accent rounded"
                        />
                        <span>Has Live Demo</span>
                      </label>
                      {formData.has_live_demo && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Live Demo URL</label>
                          <input
                            type="url"
                            name="live_demo_url"
                            value={formData.live_demo_url}
                            onChange={handleInputChange}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-warning transition disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                      </button>
                      {editingProduct && (
                        <button
                          type="button"
                          onClick={resetForm}
                          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* Products List */}
              <div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6 font-montserrat">Products ({products.length})</h2>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-gray-600 text-sm">${product.price}</p>
                            <div className="flex space-x-1 mt-1">
                              {!product.is_active && (
                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Inactive</span>
                              )}
                              {product.is_featured && (
                                <span className="bg-accent text-white px-2 py-1 rounded text-xs">Featured</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-800 p-2 transition"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-800 p-2 transition"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 font-montserrat">Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-accent font-semibold">{category.slug}</span>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-800 text-sm">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 font-montserrat">Analytics Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-primary bg-opacity-20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary mb-1">{products.length}</div>
                  <div className="text-sm text-gray-600">Total Products</div>
                </div>
                <div className="bg-secondary bg-opacity-20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-secondary mb-1">
                    {products.filter(p => p.is_active).length}
                  </div>
                  <div className="text-sm text-gray-600">Active Products</div>
                </div>
                <div className="bg-accent bg-opacity-20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-accent mb-1">
                    {products.filter(p => p.is_featured).length}
                  </div>
                  <div className="text-sm text-gray-600">Featured Products</div>
                </div>
                <div className="bg-warning bg-opacity-20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-warning mb-1">
                    {products.filter(p => p.price === 0).length}
                  </div>
                  <div className="text-sm text-gray-600">Free Products</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}