import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()

  return (
    <article className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <img src={product.imageUrl} alt={product.name} className="h-52 w-full object-cover" />
      <div className="space-y-3 p-4">
        <h3 className="text-lg font-bold text-slate-800">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-slate-500">{product.description}</p>
        <p className="text-base font-bold text-pink-600">{product.price} RON</p>

        <div className="flex gap-2">
          <Link
            to={`/products/${product.id}`}
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Detalii
          </Link>
          <button
            onClick={() =>
              addToCart({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
              })
            }
            className="flex-1 rounded-lg bg-pink-500 px-3 py-2 text-sm font-semibold text-white hover:bg-pink-600"
          >
            Adauga
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
