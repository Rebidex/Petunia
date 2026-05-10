import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

const Home = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get('/products')
        setProducts(response.data.products.slice(0, 4))
      } catch {
        setProducts([])
      }
    }

    loadProducts()
  }, [])

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500 via-pink-400 to-emerald-400 p-8 text-white shadow-sm">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-3xl font-extrabold md:text-5xl">Petunia - buchete care spun povesti</h1>
          <p className="text-sm text-pink-50 md:text-base">
            Comanda rapid din catalog sau creeaza propriul buchet in Builder cu preview live.
          </p>
          <div className="flex gap-3">
            <Link to="/catalog" className="rounded-lg bg-white px-5 py-2 font-semibold text-pink-600">
              Vezi Catalogul
            </Link>
            <Link to="/builder" className="rounded-lg border border-white px-5 py-2 font-semibold text-white">
              Creeaza Buchet
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-slate-800">Produse populare</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
