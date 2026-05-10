import { useEffect, useMemo, useState } from 'react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'
import ChatbotRecommend from '../components/ChatbotRecommend'

const Catalog = () => {
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('toate')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get('/products')
        setProducts(response.data.products)
      } catch {
        setProducts([])
      }
    }

    loadProducts()
  }, [])

  const categories = useMemo(
    () => ['toate', ...new Set(products.map((product) => product.category))],
    [products]
  )

  const filteredProducts =
    category === 'toate' ? products : products.filter((product) => product.category === category)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Catalog Petunia</h1>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <ChatbotRecommend products={products} />
    </div>
  )
}

export default Catalog
