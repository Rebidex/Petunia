import { useEffect, useState } from 'react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'
import ChatbotRecommend from '../components/ChatbotRecommend'

const Catalog = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(['toate'])
  const [category, setCategory] = useState('toate')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

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
    setIsLoading(true)

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
            setIsLoading(false)
          }
        } catch {
          if (active) {
            setProducts([])
            setIsLoading(false)
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
    <>
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

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-850 dark:bg-slate-900 animate-pulse">
                <div className="h-52 w-full bg-slate-200 dark:bg-slate-800"></div>
                <div className="flex flex-1 flex-col space-y-3 p-4">
                  <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-800"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800"></div>
                    <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800"></div>
                  </div>
                  <div className="h-5 w-1/4 rounded bg-slate-200 dark:bg-slate-800"></div>
                  <div className="mt-auto flex gap-2 pt-2">
                    <div className="h-9 flex-1 rounded-lg bg-slate-200 dark:bg-slate-800"></div>
                    <div className="h-9 flex-1 rounded-lg bg-slate-200 dark:bg-slate-800"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
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
      </div>

      <ChatbotRecommend products={products} />
    </>
  )
}

export default Catalog
