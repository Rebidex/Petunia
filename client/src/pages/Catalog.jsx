import { useEffect, useState } from 'react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'
import ChatbotRecommend from '../components/ChatbotRecommend'

const Catalog = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(['toate'])
  const [category, setCategory] = useState('toate')
  const [search, setSearch] = useState('')

  // Load static categories once
  useEffect(() => {
    const loadAllCategories = async () => {
      try {
        const response = await api.get('/products')
        const cats = ['toate', ...new Set(response.data.products.map((p) => p.category))]
        setCategories(cats)
      } catch {}
    }
    loadAllCategories()
  }, [])

  // Load products with search and category filters on the backend (with debounce)
  useEffect(() => {
    let active = true

    const delayDebounce = setTimeout(() => {
      const loadProducts = async () => {
        try {
          const response = await api.get('/products', {
            params: {
              search: search.trim() || undefined,
              category: category !== 'toate' ? category : undefined
            }
          })
          if (active) {
            setProducts(response.data.products)
          }
        } catch {
          if (active) {
            setProducts([])
          }
        }
      }
      loadProducts()
    }, 250)

    return () => {
      active = false
      clearTimeout(delayDebounce)
    }
  }, [category, search])

  return (
    <div className="space-y-6 animate-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Catalog Petunia</h1>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Cauta produse..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-purple-500"
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="py-10 text-center text-slate-500 dark:text-slate-400">
          Nu s-au gasit produse pentru cautarea ta.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <ChatbotRecommend products={products} />
    </div>
  )
}

export default Catalog
