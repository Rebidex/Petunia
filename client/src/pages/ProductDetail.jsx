import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import { useCart } from '../context/CartContext'

const ProductDetail = () => {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`)
        setProduct(response.data.product)
      } catch {
        setProduct(null)
      }
    }

    loadProduct()
  }, [id])

  if (!product) {
    return <p className="text-slate-500">Produsul nu a fost gasit.</p>
  }

  const stockValue = Number(product.stock)
  const isOutOfStock = Number.isFinite(stockValue) && stockValue <= 0

  return (
    <section className="grid gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:grid-cols-2 dark:bg-slate-900 dark:border-slate-800 animate-page">
      <img src={product.imageUrl} alt={product.name} className="h-80 w-full rounded-xl object-cover" />

      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{product.name}</h1>
        <p className="text-slate-600 dark:text-slate-300">{product.description}</p>
        <p className="text-2xl font-bold text-pink-600 dark:text-purple-400">{product.price} RON</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">Stoc: {product.stock}</p>
        <button
          disabled={isOutOfStock}
          onClick={() =>
            addToCart({
              productId: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
              stock: product.stock
            })
          }
          className={`rounded-lg px-6 py-2 font-semibold text-white transition-colors ${
            isOutOfStock 
              ? 'cursor-not-allowed bg-slate-300 dark:bg-slate-800 dark:text-slate-600' 
              : 'bg-pink-500 hover:bg-pink-600 dark:bg-purple-600 dark:hover:bg-purple-700'
          }`}
        >
          {isOutOfStock ? 'Stoc epuizat' : 'Adauga in cos'}
        </button>
      </div>
    </section>
  )
}

export default ProductDetail
