import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const Cart = () => {
  const navigate = useNavigate()
  const { cartItems, removeFromCart, updateCartItem, total } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white p-6 text-center shadow-sm dark:bg-slate-900 dark:border-slate-850">
        <p className="mb-4 text-slate-600 dark:text-slate-400">Cosul este gol.</p>
        <Link to="/catalog" className="rounded-lg bg-pink-500 px-4 py-2 font-semibold text-white">
          Vezi produse
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-page">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Cosul meu</h1>
      <div className="space-y-3">
        {cartItems.map((item) => (
          <div key={item.cartId || item.productId} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border bg-white p-4 gap-4 dark:bg-slate-900 dark:border-slate-800">
            <div className="space-y-1">
              <p className="font-semibold text-slate-800 dark:text-slate-100">{item.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {item.quantity} x {item.price} RON
              </p>
              {item.type === 'custom-bouquet' && (
                <button
                  onClick={() =>
                    navigate('/builder', {
                      state: {
                        editCartId: item.cartId,
                        flowers: item.flowers,
                        wrapColor: item.wrapColor,
                        name: item.name
                      }
                    })
                  }
                  className="text-sm font-medium text-pink-500 underline hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300"
                >
                  Editeaza buchetul
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-4 justify-between sm:justify-end">
              <div className="flex items-center gap-2">
                <button
                  disabled={item.quantity <= 1}
                  onClick={() => updateCartItem(item.cartId, { quantity: item.quantity - 1 })}
                  className="h-8 w-8 rounded-lg border border-slate-300 flex items-center justify-center font-bold text-slate-600 disabled:opacity-30 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Scade cantitate"
                >
                  -
                </button>
                <span className="w-8 text-center font-semibold text-slate-800 dark:text-slate-100">{item.quantity}</span>
                <button
                  disabled={item.stock !== undefined && item.stock !== null && item.quantity >= item.stock}
                  onClick={() => {
                    const maxStock = Number.isFinite(Number(item.stock)) ? Number(item.stock) : 99
                    updateCartItem(item.cartId, { quantity: Math.min(item.quantity + 1, maxStock) })
                  }}
                  className="h-8 w-8 rounded-lg border border-slate-300 flex items-center justify-center font-bold text-slate-600 disabled:opacity-30 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Creste cantitate"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.cartId)}
                className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-750 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              >
                Sterge
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-xl bg-slate-900 p-4 text-white dark:bg-slate-800">
        <p className="text-lg font-bold">Total: {total.toFixed(2)} RON</p>
        <Link to="/checkout" className="rounded-lg bg-emerald-400 px-4 py-2 font-semibold text-slate-900 hover:bg-emerald-350 transition-colors">
          Continua la checkout
        </Link>
      </div>
    </div>
  )
}

export default Cart
