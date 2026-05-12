import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const stockValue = Number(product.stock)
  const isOutOfStock = Number.isFinite(stockValue) && stockValue <= 0

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <img src={product.imageUrl} alt={product.name} className="h-52 w-full object-cover" />
      <div className="flex flex-1 flex-col space-y-3 p-4">
        <h3 className="text-lg font-bold text-slate-800">{product.name}</h3>
        <p className="line-clamp-2 min-h-[2.75rem] text-sm text-slate-500">
          {product.description}
        </p>
        <p className="text-base font-bold text-pink-600">{product.price} RON</p>

        <div className="mt-auto flex gap-2">
          <Link
            to={`/products/${product.id}`}
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Detalii
          </Link>
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
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold text-white ${
              isOutOfStock ? 'cursor-not-allowed bg-slate-300' : 'bg-pink-500 hover:bg-pink-600'
            }`}
          >
            {isOutOfStock ? 'Stoc epuizat' : 'Adauga'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
