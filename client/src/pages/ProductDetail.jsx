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

  return (
    <section className="grid gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:grid-cols-2">
      <img src={product.imageUrl} alt={product.name} className="h-80 w-full rounded-xl object-cover" />

      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold text-slate-800">{product.name}</h1>
        <p className="text-slate-600">{product.description}</p>
        <p className="text-2xl font-bold text-pink-600">{product.price} RON</p>
        <p className="text-sm text-slate-500">Stoc: {product.stock}</p>
        <button
          onClick={() =>
            addToCart({
              productId: product.id,
              name: product.name,
              price: product.price,
              quantity: 1
            })
          }
          className="rounded-lg bg-pink-500 px-6 py-2 font-semibold text-white hover:bg-pink-600"
        >
          Adauga in cos
        </button>
      </div>
    </section>
  )
}

export default ProductDetail
